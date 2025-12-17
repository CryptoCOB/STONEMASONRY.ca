"""
Production-grade Contractor RAG Pipeline
- Uses Chroma for local vector search
- Integrates Ollama for LLM-powered enrichment/ranking
- Dash app for interactive review/approval
- Pushes approved data to Supabase

Requirements:
- uv pip install chromadb dash supabase ollama python-dotenv
- Ollama server running locally (https://ollama.com)
"""

import os
import time
import threading
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
load_dotenv()
import chromadb
from chromadb.config import Settings
from dash import Dash, html, dcc, Input, Output, State, callback_context
import dash_cytoscape as cyto
import pandas as pd
from supabase import create_client, Client
from ollama import Client as OllamaClient
import csv
import json
import requests
import logging

import hashlib


# Load municipalities and filter for high conversion (population > 10,000)
MUNICIPALITIES_FILE = os.path.join(os.path.dirname(__file__), "canada_municipalities.txt")
POPULATION_FILE = os.path.join(os.path.dirname(__file__), "canada_municipalities_population.csv")
CENSUS_WIDE_FILE = os.path.join(os.path.dirname(__file__), "census_province_wide.csv")

# Load population data if available
pop_map = {}
if os.path.exists(POPULATION_FILE):
    with open(POPULATION_FILE, "r", encoding="utf-8") as pf:
        reader = csv.DictReader(pf)
        for row in reader:
            name = row.get("municipality")
            try:
                pop = int(row.get("population", "0"))
            except Exception:
                pop = 0
            if name:
                if name in pop_map:
                    pop_map[name] = max(pop_map[name], pop)
                else:
                    pop_map[name] = pop

# Load census wide data for province/territory enrichment
census_map = {}
census_columns = []
if os.path.exists(CENSUS_WIDE_FILE):
    with open(CENSUS_WIDE_FILE, "r", encoding="utf-8") as cf:
        reader = csv.DictReader(cf)
        census_columns = reader.fieldnames[1:] if reader.fieldnames else []
        for row in reader:
            province = row[reader.fieldnames[0]]
            census_map[province] = {col: row[col] for col in census_columns}

# Municipality to province/territory mapping (simple heuristic: last word for most, manual for edge cases)
def get_province_for_municipality(muni):
    # Manual overrides for edge cases
    manual = {
        "Toronto": "Ontario",
        "Montreal": "Quebec",
        "Vancouver": "British Columbia",
        "Calgary": "Alberta",
        "Edmonton": "Alberta",
        "Ottawa": "Ontario",
        "Winnipeg": "Manitoba",
        "Halifax": "Nova Scotia",
        "St. John's": "Newfoundland and Labrador",
        "Charlottetown": "Prince Edward Island",
        "Fredericton": "New Brunswick",
        "Regina": "Saskatchewan",
        "Yellowknife": "Northwest Territories",
        "Whitehorse": "Yukon",
        "Iqaluit": "Nunavut"
    }
    if muni in manual:
        return manual[muni]
    # Heuristic: last word is province/territory
    for prov in census_map.keys():
        if muni.endswith(prov):
            return prov
    # Fallback: Ontario (most populous)
    return "Ontario"

# Load OSM business counts from log
OSM_LOG_FILE = os.path.join(os.path.dirname(__file__), "osm_scraper.log")
business_count_map = {}
import re
if os.path.exists(OSM_LOG_FILE):
    with open(OSM_LOG_FILE, "r", encoding="utf-8") as lf:
        for line in lf:
            m = re.match(r".*INFO ([^:]+): inserted (\d+)", line)
            if m:
                city = m.group(1).strip()
                count = int(m.group(2))
                business_count_map[city] = count

with open(MUNICIPALITIES_FILE, "r", encoding="utf-8") as f:
    municipalities = [line.strip() for line in f if line.strip() and not line.startswith("#")]

def normalize_name(s: str) -> str:
    return (s or "").strip().lower()

# Build normalized population map to improve matching
pop_map_norm = {normalize_name(k): v for k, v in pop_map.items()}


# Filter for target cluster (population between 50,000 and 100,000)
MIN_POP = int(os.getenv("MIN_CLUSTER_POP", "50000"))
MAX_POP = int(os.getenv("MAX_CLUSTER_POP", "2000000"))
cluster_municipalities = [m for m in municipalities if MIN_POP <= pop_map_norm.get(normalize_name(m), 0) < MAX_POP]
if not cluster_municipalities:
    print(f"[Warning] No municipalities in population range {MIN_POP}-{MAX_POP}. Showing all.")
    cluster_municipalities = municipalities
print(f"[Startup] Municipalities loaded: {len(municipalities)} | In cluster: {len(cluster_municipalities)}")


"""Initialize Supabase before indexing contractor leads"""
# Supabase setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
print(f"[Startup] Supabase URL configured: {bool(SUPABASE_URL)} | Key present: {bool(SUPABASE_KEY)}")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Unified Chroma index for municipalities and contractor/business leads
persist_dir = os.path.join(os.path.dirname(__file__), "chroma_db")
print(f"[Startup] Initializing Chroma (persist: {persist_dir})...")
chroma_client = chromadb.Client(Settings(persist_directory=persist_dir))
collection = chroma_client.get_or_create_collection("leads")

# Optionally limit first-time indexing to speed up startup
index_limit = int(os.getenv("CHROMA_INDEX_LIMIT", "500"))
print(f"[Startup] Preparing high-conversion municipality index (limit={index_limit})...")

# Load contractor/business leads from Supabase (self-contained)
def load_contractor_leads():
    try:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        if not url or not key:
            return []
        sb: Client = create_client(url, key)
        resp = sb.table("contractors_prospects").select("*").execute()
        data = resp.data if hasattr(resp, "data") else resp
        leads = data or []
        # Only actionable leads: at least one of phone/email/website/socials
        actionable = []
        for lead in leads:
            if lead.get("phone") or lead.get("email") or lead.get("website") or lead.get("socials"):
                actionable.append(lead)
        return actionable
    except Exception as e:
        print(f"[Warning] Failed to load contractor leads from Supabase: {e}")
        return []

# Only add if collection is empty (avoid duplicate ids)
existing_count = 0
try:
    existing_count = collection.count()
except Exception:
    existing_count = 0

if existing_count == 0:
    to_index = cluster_municipalities[:min(index_limit, 50)]  # Start with smaller batch
    print(f"[Startup] Indexing {len(to_index)} municipalities into Chroma (batch processing)...")
    batch_size = 10
    for i in range(0, len(to_index), batch_size):
        batch = to_index[i:i+batch_size]
        print(f"[Startup] Processing batch {i//batch_size + 1}/{(len(to_index)-1)//batch_size + 1}...")
        for city in batch:
            try:
                collection.add(documents=[city], metadatas=[{"name": city, "type": "municipality"}], ids=[f"muni:{city}"])
            except Exception as e:
                print(f"[Warning] Failed to index municipality '{city}': {e}")
                continue
        time.sleep(0.1)  # Small delay between batches
    
    # Index contractor/business leads from Supabase with error handling
    print("[Startup] Skipping existing contractor indexing - will be handled by automated scraping")
    # contractor_leads = load_contractor_leads()
    # ... contractor indexing code moved to automated scraping
    print("[Startup] Initial indexing complete. Automated scraping will add more data.")
else:
    print(f"[Startup] Using existing Chroma collection with {existing_count} items.")

# Ollama setup
ollama = OllamaClient()
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")  # Can be overridden via env

# Automated Scraping Configuration
AUTO_SCRAPE_INTERVAL = int(os.getenv("AUTO_SCRAPE_INTERVAL", "3600"))  # 1 hour default
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"
USER_AGENT = "SimcoeStoneLeadEngine/1.0"
SCRAPE_BATCH_SIZE = int(os.getenv("SCRAPE_BATCH_SIZE", "5"))  # Cities per batch
MAX_PER_CITY = int(os.getenv("OSM_MAX_PER_CITY", "50"))  # Businesses per city

# OSM contractor-related queries
OSM_QUERIES = [
    ("craft", "stonemason"), ("craft", "carpenter"), ("craft", "builder"),
    ("craft", "handyman"), ("craft", "tile_layer"), ("craft", "roofer"),
    ("shop", "construction"), ("shop", "hardware"), ("shop", "building_supplies"),
    ("office", "construction_company"), ("office", "contractor"),
    ("industrial", "construction"), ("amenity", "contractor")
]

# Global scraping state
scraping_stats = {
    "last_run": None,
    "total_scraped": 0,
    "cities_processed": 0,
    "next_city_index": 0,
    "running": False,
    "errors": []
}

def get_city_bbox(city_name: str) -> Optional[tuple]:
    """Get bounding box for a city using Nominatim"""
    try:
        params = {
            "q": f"{city_name}, Canada",
            "format": "json",
            "limit": 1,
            "extratags": 1,
            "addressdetails": 1
        }
        headers = {"User-Agent": USER_AGENT}
        
        resp = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data:
                bbox = data[0].get("boundingbox")
                if bbox and len(bbox) == 4:
                    # Convert to (south, west, north, east)
                    return (float(bbox[0]), float(bbox[2]), float(bbox[1]), float(bbox[3]))
        time.sleep(1)  # Rate limiting
        return None
    except Exception as e:
        print(f"[Warning] Failed to get bbox for {city_name}: {e}")
        return None

def scrape_contractors_in_city(city_name: str, bbox: tuple) -> List[Dict[str, Any]]:
    """Scrape contractors in a specific city using OSM Overpass API"""
    contractors = []
    south, west, north, east = bbox
    
    for tag_key, tag_value in OSM_QUERIES[:3]:  # Limit queries to avoid timeout
        try:
            overpass_query = f"""
            [out:json][timeout:25];
            (
              node["{tag_key}"="{tag_value}"]({south},{west},{north},{east});
              way["{tag_key}"="{tag_value}"]({south},{west},{north},{east});
              relation["{tag_key}"="{tag_value}"]({south},{west},{north},{east});
            );
            out center meta;
            """
            
            headers = {"User-Agent": USER_AGENT}
            resp = requests.post(OVERPASS_URL, data=overpass_query, headers=headers, timeout=30)
            
            if resp.status_code == 200:
                data = resp.json()
                for element in data.get("elements", [])[:MAX_PER_CITY//len(OSM_QUERIES)]:
                    tags = element.get("tags", {})
                    name = tags.get("name", f"Contractor {len(contractors)+1}")
                    
                    # Extract coordinates
                    lat = element.get("lat") or (element.get("center", {}).get("lat"))
                    lon = element.get("lon") or (element.get("center", {}).get("lon"))
                    
                    contractor = {
                        "name": name,
                        "service_area": city_name,
                        "phone": tags.get("phone", ""),
                        "email": tags.get("email", ""),
                        "website": tags.get("website", ""),
                        "address": tags.get("addr:full") or f"{tags.get('addr:housenumber', '')} {tags.get('addr:street', '')}".strip(),
                        "craft_type": f"{tag_key}:{tag_value}",
                        "source": "OSM_Auto",
                        "status": "scraped",
                        "score": 5,  # Base score
                        "latitude": lat,
                        "longitude": lon,
                        "scraped_at": datetime.now().isoformat()
                    }
                    
                    # Score based on available contact info
                    if contractor["phone"]: contractor["score"] += 2
                    if contractor["email"]: contractor["score"] += 2
                    if contractor["website"]: contractor["score"] += 3
                    
                    contractors.append(contractor)
                    
            time.sleep(2)  # Rate limiting between queries
            
        except Exception as e:
            print(f"[Warning] Failed OSM query {tag_key}={tag_value} in {city_name}: {e}")
            continue
    
    return contractors[:MAX_PER_CITY]

def automated_scraping_worker():
    """Background worker that continuously scrapes new businesses"""
    global scraping_stats
    
    while True:
        try:
            if not scraping_stats["running"]:
                time.sleep(60)  # Check every minute if scraping should start
                continue
                
            print(f"[AutoScrape] Starting batch from city index {scraping_stats['next_city_index']}")
            
            # Get batch of cities to process
            start_idx = scraping_stats["next_city_index"]
            cities_batch = cluster_municipalities[start_idx:start_idx + SCRAPE_BATCH_SIZE]
            
            if not cities_batch:
                # Reset to beginning
                scraping_stats["next_city_index"] = 0
                cities_batch = cluster_municipalities[:SCRAPE_BATCH_SIZE]
                print("[AutoScrape] Completed full cycle, restarting from beginning")
            
            batch_scraped = 0
            for city in cities_batch:
                try:
                    # Get city bounding box
                    bbox = get_city_bbox(city)
                    if not bbox:
                        continue
                    
                    print(f"[AutoScrape] Processing {city}...")
                    
                    # Scrape contractors
                    contractors = scrape_contractors_in_city(city, bbox)
                    
                    # Insert into Supabase with deduplication
                    for contractor in contractors:
                        try:
                            # Check if already exists
                            existing = supabase.table("contractors_prospects").select("id").eq("name", contractor["name"]).eq("service_area", city).execute()
                            
                            if not existing.data:
                                # Insert new contractor
                                supabase.table("contractors_prospects").insert(contractor).execute()
                                
                                # Add to Chroma for immediate searchability
                                try:
                                    collection.add(
                                        documents=[contractor["name"]], 
                                        metadatas=[{k: v for k, v in contractor.items() if isinstance(v, (str, int, float, bool))}], 
                                        ids=[f"auto_contractor:{contractor['name']}:{city}"]
                                    )
                                except Exception as chroma_e:
                                    print(f"[Warning] Failed to add {contractor['name']} to Chroma: {chroma_e}")
                                
                                batch_scraped += 1
                                
                        except Exception as insert_e:
                            print(f"[Warning] Failed to insert {contractor['name']}: {insert_e}")
                            continue
                    
                    scraping_stats["cities_processed"] += 1
                    
                except Exception as city_e:
                    scraping_stats["errors"].append(f"{city}: {str(city_e)[:100]}")
                    # Keep only last 10 errors
                    scraping_stats["errors"] = scraping_stats["errors"][-10:]
                    continue
            
            # Update stats
            scraping_stats["total_scraped"] += batch_scraped
            scraping_stats["next_city_index"] += len(cities_batch)
            scraping_stats["last_run"] = datetime.now().isoformat()
            
            print(f"[AutoScrape] Batch complete: {batch_scraped} new contractors from {len(cities_batch)} cities")
            
            # Wait for next interval
            time.sleep(AUTO_SCRAPE_INTERVAL)
            
        except Exception as e:
            print(f"[Error] Automated scraping failed: {e}")
            scraping_stats["errors"].append(f"Worker error: {str(e)[:100]}")
            scraping_stats["errors"] = scraping_stats["errors"][-10:]
            time.sleep(300)  # Wait 5 minutes before retrying

def start_automated_scraping():
    """Start the automated scraping in background thread"""
    global scraping_stats
    if not scraping_stats["running"]:
        scraping_stats["running"] = True
        thread = threading.Thread(target=automated_scraping_worker, daemon=True)
        thread.start()
        print("[AutoScrape] Background scraping started")
        return "✅ Automated scraping started"
    return "⚠️ Already running"

def stop_automated_scraping():
    """Stop the automated scraping"""
    global scraping_stats
    scraping_stats["running"] = False
    print("[AutoScrape] Background scraping stopped")
    return "🛑 Automated scraping stopped"

def validate_social_media(website, socials):
    """Enhanced social media background check"""
    social_score = 0
    social_details = {}
    try:
        if website:
            social_score += 3
            social_details["website"] = "active"
        if socials:
            platforms = socials.lower()
            if "facebook" in platforms: 
                social_score += 2
                social_details["facebook"] = "present"
            if "instagram" in platforms: 
                social_score += 2
                social_details["instagram"] = "present"
            if "linkedin" in platforms: 
                social_score += 3
                social_details["linkedin"] = "present"
        return social_score, social_details
    except Exception:
        return 0, {}

def enrich_contractor_with_llm(meta: dict):
    name = meta.get("name", "Unknown")
    service_area = meta.get("service_area", "Unknown")
    phone = meta.get("phone", "")
    email = meta.get("email", "")
    website = meta.get("website", "")
    address = meta.get("address", "")
    prompt = (
        f"You are a lead analyst for a stonemasonry company.\n"
        f"Business: {name}\nService Area: {service_area}\nPhone: {phone}\nEmail: {email}\nWebsite: {website}\nAddress: {address}\n"
        f"Tasks: 1) Classify likely job types we could sell (e.g., fireplace, facade, patio, restoration).\n"
        f"2) Estimate potential deal size range in CAD (low-high).\n"
        f"3) Draft a one-paragraph personalized pitch for first contact.\n"
        f"Return JSON with keys: job_types (array of strings), est_revenue_low (number), est_revenue_high (number), pitch (string), score (1-10), rationale (string)."
    )
    try:
        resp = ollama.generate(model=OLLAMA_MODEL, prompt=prompt)
        text = resp.get("response", "{}")
        try:
            data = json.loads(text)
        except Exception:
            data = {
                "job_types": [],
                "est_revenue_low": 0,
                "est_revenue_high": 0,
                "pitch": text[:500],
                "score": 5,
                "rationale": text[:500]
            }
        return data
    except Exception as e:
        return {
            "job_types": [],
            "est_revenue_low": 0,
            "est_revenue_high": 0,
            "pitch": f"LLM enrichment failed: {e}",
            "score": 0,
            "rationale": ""
        }

# Dash app
app = Dash(__name__)
app.layout = html.Div([
    html.H1("Contractor Lead Engine (Municipalities & Businesses)"),
    dcc.Dropdown(
        id="lead-type-dropdown",
        options=[{"label": "Municipality", "value": "municipality"}, {"label": "Contractor/Business", "value": "contractor"}],
        value="municipality",
        clearable=False,
        style={"width": "300px", "marginBottom": "20px"}
    ),
    dcc.Input(id="search-box", type="text", placeholder="Search..."),
    dcc.Input(id="batch-start", type="number", value=0, min=0, step=50, placeholder="Batch start index (0, 50, ...)",),
    html.Div([
        html.Label("Filter by Census Variable (municipality only):"),
        dcc.Dropdown(
            id="census-var-dropdown",
            options=[{"label": col, "value": col} for col in census_columns[:50]],
            multi=True,
            placeholder="Select census variables to filter..."
        ),
        dcc.Input(id="census-var-threshold", type="text", placeholder="Threshold (e.g. >100000)")
    ], style={"marginBottom": "20px"}),
    html.Div([
        html.Label("Province/Territory (for census context, municipality only):"),
        dcc.Dropdown(
            id="census-province-dropdown",
            options=[{"label": p, "value": p} for p in sorted(census_map.keys())],
            placeholder="Select a province/territory for census context"
        )
    ], style={"marginBottom": "20px"}),
    html.Button("Search", id="search-btn"),
    dcc.Loading(id="loading-results", type="default", children=html.Div(id="results")),
    html.Button("Push Approved to Supabase", id="push-btn"),
    html.Div(id="push-status"),
    html.Hr(),
    html.H2("RAG Graph"),
    html.P("Visualize how provinces, municipalities, and contractors connect."),
    html.Button("Refresh Graph", id="refresh-graph-btn"),
    cyto.Cytoscape(
        id="rag-graph",
        layout={"name": "cose", "animate": False},
        style={"width": "100%", "height": "600px", "border": "1px solid #ddd"},
        elements=[],
        stylesheet=[
            {"selector": "node", "style": {"label": "data(label)", "font-size": 10, "text-valign": "center", "text-halign": "center"}},
            {"selector": "node[type='province']", "style": {"background-color": "#1f77b4", "shape": "round-rectangle"}},
            {"selector": "node[type='municipality']", "style": {"background-color": "#2ca02c"}},
            {"selector": "node[type='contractor']", "style": {"background-color": "#ff7f0e", "shape": "triangle"}},
            {"selector": "edge", "style": {"line-color": "#bbb", "width": 2, "curve-style": "bezier", "target-arrow-shape": "triangle", "target-arrow-color": "#bbb"}},
        ],
    ),
    html.Hr(),
    html.H2("Census Data Summary (Pre-loaded)"),
    html.Label("Province/Territory:"),
    dcc.Dropdown(id="census-table-province", options=[{"label": p, "value": p} for p in sorted(census_map.keys())], placeholder="Select province/territory", style={"width": "300px"}),
    html.Label("Census Variable:"),
    dcc.Dropdown(id="census-table-var", options=[{"label": col, "value": col} for col in census_columns], placeholder="Select census variable", style={"width": "300px"}),
    dcc.Loading(id="census-table-loading", type="default", children=html.Div(id="census-table")),
    html.Hr(),
    
    # 🤖 Automated Scraping Panel
    html.H2("🤖 Automated Business Discovery"),
    html.Div(id="scrape-status", children="Status: Ready", style={"marginBottom": "10px", "padding": "10px", "backgroundColor": "#ecf0f1", "borderRadius": "5px"}),
    html.Div([
        html.Button("▶️ Start Auto-Scraping", id="start-scrape-btn", n_clicks=0, style={"marginRight": "10px", "backgroundColor": "#27ae60", "color": "white", "border": "none", "padding": "10px", "borderRadius": "5px"}),
        html.Button("⏹️ Stop Auto-Scraping", id="stop-scrape-btn", n_clicks=0, style={"marginRight": "10px", "backgroundColor": "#e74c3c", "color": "white", "border": "none", "padding": "10px", "borderRadius": "5px"}),
        html.Button("📊 Refresh Stats", id="refresh-scrape-btn", n_clicks=0, style={"marginRight": "10px", "backgroundColor": "#3498db", "color": "white", "border": "none", "padding": "10px", "borderRadius": "5px"}),
        html.Button("🧪 Test Scraping", id="test-scrape-btn", n_clicks=0, style={"backgroundColor": "#f39c12", "color": "white", "border": "none", "padding": "10px", "borderRadius": "5px"})
    ], style={"marginBottom": "15px"}),
    html.Div(id="test-scrape-status", children="Click to test scraping", style={"marginBottom": "10px", "padding": "8px", "backgroundColor": "#fff3cd", "borderRadius": "5px", "fontSize": "12px"}),
    html.Div([
        html.P("🔄 Interval: Every hour | 🏘️ Batch Size: 5 cities | 🏢 Max per city: 50 businesses", style={"fontSize": "12px", "color": "#7f8c8d", "margin": "0"}),
        html.P("📍 Sources: OpenStreetMap (stonemasons, carpenters, builders, contractors)", style={"fontSize": "12px", "color": "#7f8c8d", "margin": "0"})
    ]),
    html.Hr(),
    
    html.H2("Ask the RAG (Natural Language QA)"),
    dcc.Input(id="qa-input", type="text", placeholder="Ask anything about contractors, municipalities, or census...", style={"width": "60%"}),
    html.Button("Ask", id="qa-btn"),
    html.Button("Export Results to CSV", id="export-csv-btn", style={"marginLeft": "10px"}),
    dcc.Loading(id="qa-loading", type="default", children=html.Div(id="qa-answer")),
    html.Div(id="qa-status", style={"marginTop": "10px", "color": "#007700"}),
    html.H3("Matching Leads & Census Data"),
    html.Div(id="qa-leads-table"),
    dcc.Download(id="download-csv"),
    cyto.Cytoscape(
        id="qa-graph",
        layout={"name": "cose", "animate": False},
        style={"width": "100%", "height": "400px", "border": "1px solid #eee"},
        elements=[],
        stylesheet=[
            {"selector": "node", "style": {"label": "data(label)", "font-size": 10, "text-valign": "center", "text-halign": "center"}},
            {"selector": "node[type='province']", "style": {"background-color": "#1f77b4", "shape": "round-rectangle"}},
            {"selector": "node[type='municipality']", "style": {"background-color": "#2ca02c"}},
            {"selector": "node[type='contractor']", "style": {"background-color": "#ff7f0e", "shape": "triangle"}},
            {"selector": "edge", "style": {"line-color": "#bbb", "width": 2, "curve-style": "bezier", "target-arrow-shape": "triangle", "target-arrow-color": "#bbb"}},
        ],
    )
])


# Unified search callback for both lead types
@app.callback(
    Output("results", "children"),
    Input("search-btn", "n_clicks"),
    State("search-box", "value"),
    State("lead-type-dropdown", "value"),
    State("batch-start", "value"),
    State("census-var-dropdown", "value"),
    State("census-var-threshold", "value"),
    State("census-province-dropdown", "value")
)
def search_leads(n_clicks, query, lead_type, batch_start, census_vars_selected, census_var_threshold, selected_province):
    if not query:
        return "Enter a search term."
    batch_start = batch_start or 0
    items = []
    # Municipality search
    if lead_type == "municipality":
        batch_munis = cluster_municipalities[batch_start:batch_start+50]
        filtered_munis = []
        for m in batch_munis:
            census_vars = census_map.get(selected_province, {}) if selected_province else {}
            passed = True
            for var in census_vars_selected or []:
                val = census_vars.get(var, "")
                if census_var_threshold:
                    try:
                        if census_var_threshold.startswith('>'):
                            if float(val or 0) <= float(census_var_threshold[1:]):
                                passed = False
                        elif census_var_threshold.startswith('<'):
                            if float(val or 0) >= float(census_var_threshold[1:]):
                                passed = False
                    except Exception:
                        passed = False
            if passed:
                filtered_munis.append(m)
        if not filtered_munis:
            filtered_munis = batch_munis
        # Chroma expects $in to be an operator dict, not a raw list
        if filtered_munis and isinstance(filtered_munis, list):
            where_filter = {"$and": [
                {"name": {"$in": filtered_munis}},
                {"type": {"$eq": "municipality"}}
            ]}
        else:
            where_filter = {"type": {"$eq": "municipality"}}
        query_kwargs = {"query_texts": [query], "n_results": 50, "where": where_filter}
        try:
            results = collection.query(**query_kwargs)
        except Exception as e:
            return f"[Error] Chroma query failed: {e}"
        docs = results.get("documents", [])
        metas = results.get("metadatas", [])
        if docs and isinstance(docs[0], list):
            docs = docs[0]
        if metas and isinstance(metas[0], list):
            metas = metas[0]
        for doc, meta in zip(docs, metas):
            name = meta.get("name", "Unknown")
            pop = pop_map.get(name, "N/A")
            business_count = business_count_map.get(name, "N/A")
            province = selected_province or "(select in dropdown)"
            census_vars = census_map.get(selected_province, {}) if selected_province else {}
            try:
                # Unified scoring: blend census, OSM, and business signals
                prompt = (
                    f"Lead scoring for contractor acquisition in {name} (Canada):\n"
                    f"Population: {pop}\n"
                    f"Business count: {business_count}\n"
                    f"Province: {province}\n"
                    f"Key census: {str(census_vars)[:300]}\n"
                    f"OSM density: {business_count}\n"
                    f"Consider economic activity, construction signals, and local business density.\n"
                    f"Return a score 1-10 and a short rationale."
                )
                response = ollama.generate(model=OLLAMA_MODEL, prompt=prompt)
                score, rationale = parse_llm_response(response["response"])
                census_display = html.Details([
                    html.Summary("Census Variables"),
                    html.Ul([html.Li(f"{col}: {census_vars.get(col, '')}") for col in census_columns[:20]])
                ]) if census_vars else html.P("No census data.")
                muni_option_value = json.dumps({
                    "type": "municipality",
                    "name": name,
                    "province": province,
                    "score": score,
                    "rationale": rationale
                })
                items.append(html.Div([
                    html.H3(name),
                    html.P(f"Population: {pop}"),
                    html.P(f"Business count: {business_count}"),
                    html.P(f"Province: {province}"),
                    census_display,
                    html.P(f"Score: {score}"),
                    html.P(f"Rationale: {rationale}"),
                    dcc.Checklist(options=[{"label": "Approve", "value": muni_option_value}], id={"type": "approve", "index": name})
                ]))
            except Exception as e:
                items.append(html.Div([
                    html.H3(name),
                    html.P(f"Population: {pop}"),
                    html.P(f"Business count: {business_count}"),
                    html.P(f"Province: {province}"),
                    html.P(f"[Error] LLM enrichment failed: {e}"),
                ]))
    # Contractor/business search
    elif lead_type == "contractor":
        # Query Chroma for contractor/business leads
        where_filter = {"type": "contractor"}
        query_kwargs = {"query_texts": [query], "n_results": 50, "where": where_filter}
        try:
            results = collection.query(**query_kwargs)
        except Exception as e:
            return f"[Error] Chroma query failed: {e}"
        docs = results.get("documents", [])
        metas = results.get("metadatas", [])
        if docs and isinstance(docs[0], list):
            docs = docs[0]
        if metas and isinstance(metas[0], list):
            metas = metas[0]
        for doc, meta in zip(docs, metas):
            name = meta.get("name", "Unknown")
            phone = meta.get("phone", "")
            email = meta.get("email", "")
            website = meta.get("website", "")
            socials = meta.get("socials", "")
            address = meta.get("address", "N/A")
            service_area = meta.get("service_area", "N/A")
            score = meta.get("score", 0)
            # Only show actionable leads
            if not (phone or email or website or socials):
                continue
            try:
                # Unified scoring: blend business/contact signals
                prompt = (
                    f"Lead scoring for contractor outreach to {name} in {service_area}:\n"
                    f"Phone: {phone}\n"
                    f"Email: {email}\n"
                    f"Website: {website}\n"
                    f"Address: {address}\n"
                    f"Consider business signals, contact completeness, and local construction activity.\n"
                    f"Return a score 1-10 and a short rationale."
                )
                response = ollama.generate(model=OLLAMA_MODEL, prompt=prompt)
                score, rationale = parse_llm_response(response["response"])
                enrich = enrich_contractor_with_llm({
                    "name": name,
                    "phone": phone,
                    "email": email,
                    "website": website,
                    "address": address,
                    "service_area": service_area,
                })
                contractor_option_value = json.dumps({
                    "type": "contractor",
                    "name": name,
                    "service_area": service_area,
                    "phone": phone,
                    "email": email,
                    "website": website,
                    "address": address,
                    "score": enrich.get("score", score),
                    "rationale": enrich.get("rationale", ""),
                    "job_types": enrich.get("job_types", []),
                    "est_revenue_low": enrich.get("est_revenue_low", 0),
                    "est_revenue_high": enrich.get("est_revenue_high", 0),
                    "pitch": enrich.get("pitch", "")
                })
                items.append(html.Div([
                    html.H3(name),
                    html.P(f"Phone: {phone}"),
                    html.P(f"Email: {email}"),
                    html.P(f"Website: {website}"),
                    html.P(f"Address: {address}"),
                    html.P(f"Service Area: {service_area}"),
                    html.P(f"Score: {enrich.get('score', score)}"),
                    html.P(f"Rationale: {enrich.get('rationale', '')}"),
                    html.P(f"Job Types: {', '.join(enrich.get('job_types', []))}"),
                    html.P(f"Est. Revenue (CAD): {enrich.get('est_revenue_low', 0)} - {enrich.get('est_revenue_high', 0)}"),
                    html.P(f"Pitch: {enrich.get('pitch', '')}"),
                    dcc.Checklist(options=[{"label": "Approve", "value": contractor_option_value}], id={"type": "approve", "index": name})
                ]))
            except Exception as e:
                items.append(html.Div([
                    html.H3(name),
                    html.P(f"Phone: {phone}"),
                    html.P(f"Email: {email}"),
                    html.P(f"Website: {website}"),
                    html.P(f"Address: {address}"),
                    html.P(f"Service Area: {service_area}"),
                    html.P(f"[Error] LLM enrichment failed: {e}"),
                ]))
    if not items:
        return "[Info] No results found for query."
    return items

def parse_llm_response(text):
    # Simple parser for LLM output
    import re
    match = re.search(r"score\s*[:=]\s*(\d+)", text, re.I)
    score = int(match.group(1)) if match else 5
    rationale = text
    return score, rationale

@app.callback(
    Output("push-status", "children"),
    Input("push-btn", "n_clicks"),
    State("results", "children")
)
def push_to_supabase(n_clicks, results):
    if not results:
        return "No results to push."
    # Collect approved selections (JSON)
    approved = []
    for item in results:
        try:
            checklist = item.children[-1]
            if checklist.value:
                approved.extend(checklist.value)
        except Exception:
            continue
    # Push to Supabase
    # Hash/save mechanism: mark municipalities as added to RAG
    import hashlib
    rag_hash_file = os.path.join(os.path.dirname(__file__), "rag_added.txt")
    try:
        with open(rag_hash_file, "r", encoding="utf-8") as f:
            already_added = set(line.strip() for line in f if line.strip())
    except Exception:
        already_added = set()
    new_added = []
    for token in approved:
        try:
            data = json.loads(token)
        except Exception:
            data = {"type": "municipality", "name": token}
        key = f"{data.get('type')}|{data.get('name')}"
        name_hash = hashlib.sha256(key.encode()).hexdigest()
        if name_hash in already_added:
            continue  # Skip duplicates
        if data.get("type") == "contractor":
            record = {
                "name": data.get("name"),
                "phone": data.get("phone"),
                "email": data.get("email"),
                "website": data.get("website"),
                "address": data.get("address"),
                "service_area": data.get("service_area"),
                "source": "dash_enriched",
                "status": "prospect",
                "score": data.get("score", 0),
                "service_keywords": ", ".join(data.get("job_types", [])) or None,
                "recent_activity": data.get("pitch", None),
            }
            supabase.table("contractors_prospects").insert(record).execute()
        else:
            name = data.get("name")
            record = {
                "name": name,
                "phone": None,
                "email": None,
                "website": None,
                "socials": None,
                "logo": None,
                "service_keywords": None,
                "recent_activity": data.get("rationale"),
                "address": None,
                "service_area": name,
                "source": "dash_geo",
                "status": "prospect",
                "score": data.get("score", 0),
                "confidence": 0
            }
            supabase.table("contractors_prospects").insert(record).execute()
        new_added.append(name_hash)
    # Save new hashes
    if new_added:
        with open(rag_hash_file, "a", encoding="utf-8") as f:
            for h in new_added:
                f.write(h + "\n")
    return f"Pushed {len(new_added)} new municipalities to Supabase. (Duplicates skipped)"

if __name__ == "__main__":
    print("[Startup] Dash starting at http://127.0.0.1:8050/ ...")
    # Disable debug/reloader to prevent duplicate server threads on Windows
    app.run(debug=False, use_reloader=False)

# Census table callback: show top 20 municipalities for selected province and variable
@app.callback(
    Output("census-table", "children"),
    [Input("census-table-province", "value"), Input("census-table-var", "value")]
)
def census_table_callback(selected_province, selected_var):
    try:
        # Filter municipalities by province
        rows = []
        for m in municipalities:
            prov = get_province_for_municipality(m)
            if selected_province and prov != selected_province:
                continue
            census_vars = census_map.get(prov, {})
            pop = pop_map.get(m, "N/A")
            val = census_vars.get(selected_var, "N/A") if selected_var else "N/A"
            rows.append({"Municipality": m, "Province": prov, "Population": pop, selected_var or "Census": val})
        # Sort by population descending
        rows = sorted(rows, key=lambda r: int(r["Population"]) if str(r["Population"]).isdigit() else 0, reverse=True)
        # Show top 20
        rows = rows[:20]
        if not rows:
            return html.P("No municipalities found for selection.")
        header = [html.Th(col) for col in rows[0].keys()]
        body = [html.Tr([html.Td(r[col]) for col in rows[0].keys()]) for r in rows]
        return html.Table([
            html.Thead(html.Tr(header)),
            html.Tbody(body)
        ], style={"width": "100%", "border": "1px solid #ccc", "fontSize": "12px"})
    except Exception as e:
        return html.P(f"[Error] Census table failed: {e}")

# Enhanced QA callback: query Chroma and LLM, return answer, subgraph, and status
@app.callback(
    [Output("qa-answer", "children"), Output("qa-graph", "elements"), Output("qa-status", "children"), Output("qa-leads-table", "children")],
    Input("qa-btn", "n_clicks"),
    State("qa-input", "value")
)
def qa_callback(n_clicks, question):
    if not question:
        return "Enter a question.", []
    try:
        # Query Chroma for top relevant entities (municipalities + contractors)
        results = collection.query(query_texts=[question], n_results=10)
        docs = results.get("documents", [])
        metas = results.get("metadatas", [])
        if docs and isinstance(docs[0], list):
            docs = docs[0]
        if metas and isinstance(metas[0], list):
            metas = metas[0]
        # Build enhanced context for LLM with census data
        enriched_context = []
        for meta in metas:
            t = meta.get("type", "unknown")
            name = meta.get("name", "Unknown")
            if t == "municipality":
                prov = get_province_for_municipality(name)
                census_vars = census_map.get(prov, {})
                pop = pop_map.get(name, "N/A")
                business_count = business_count_map.get(name, "N/A")
                enriched_context.append(f"Municipality: {name}, Province: {prov}, Population: {pop}, Business Count: {business_count}, Census: {str(census_vars)[:200]}")
            elif t == "contractor":
                social_score, social_details = validate_social_media(meta.get("website", ""), meta.get("socials", ""))
                enriched_context.append(f"Contractor: {name}, Service Area: {meta.get('service_area', '')}, Phone: {meta.get('phone', '')}, Email: {meta.get('email', '')}, Website: {meta.get('website', '')}, Social Score: {social_score}")
        
        context = "\n".join(enriched_context)
        prompt = (
            f"You are an advanced RAG QA assistant for a Canadian contractor acquisition engine with census and business intelligence.\n"
            f"Context:\n{context}\n"
            f"Question: {question}\n"
            f"Provide a comprehensive answer with specific insights about lead quality, market opportunities, census demographics, and actionable recommendations."
        )
        resp = ollama.generate(model=OLLAMA_MODEL, prompt=prompt)
        answer = resp.get("response", "No answer.")
        # Build enhanced subgraph with tooltips and validation
        elements = []
        province_nodes_added = set()
        actionable_to_push = []
        
        for meta in metas:
            t = meta.get("type", "unknown")
            name = meta.get("name", "Unknown")
            if t == "municipality":
                prov = get_province_for_municipality(name)
                if prov and prov not in province_nodes_added:
                    elements.append({"data": {"id": f"prov:{prov}", "label": prov, "type": "province", "tooltip": f"Province: {prov}"}})
                    province_nodes_added.add(prov)
                pop = pop_map.get(name, "N/A")
                elements.append({"data": {"id": f"muni:{name}", "label": f"{name}\n({pop})", "type": "municipality", "tooltip": f"Municipality: {name}\nPopulation: {pop}\nProvince: {prov}"}})
                if prov:
                    elements.append({"data": {"id": f"edge:prov:{prov}->muni:{name}", "source": f"prov:{prov}", "target": f"muni:{name}"}})
                actionable_to_push.append({
                    "name": name, "type": "municipality", "province": prov,
                    "score": meta.get("score", 0), "rationale": meta.get("rationale", "")
                })
            elif t == "contractor":
                social_score, social_details = validate_social_media(meta.get("website", ""), meta.get("socials", ""))
                tooltip = f"Contractor: {name}\nPhone: {meta.get('phone', '')}\nEmail: {meta.get('email', '')}\nSocial Score: {social_score}"
                elements.append({"data": {"id": f"contractor:{name}", "label": name, "type": "contractor", "tooltip": tooltip}})
                sa = (meta.get("service_area") or "").strip()
                if sa:
                    elements.append({"data": {"id": f"edge:contractor:{name}->muni:{sa}", "source": f"contractor:{name}", "target": f"muni:{sa}"}})
                actionable_to_push.append({
                    "name": name, "type": "contractor", "service_area": sa,
                    "phone": meta.get("phone", ""), "email": meta.get("email", ""),
                    "website": meta.get("website", ""), "score": meta.get("score", 0),
                    "social_score": social_score, "social_details": str(social_details)
                })
        
        # Auto-push with enhanced deduplication and validation
        unique = {}
        for item in actionable_to_push:
            key = f"{item.get('type','')}-{item.get('name','')}"
            if key not in unique and (item.get("phone") or item.get("email") or item.get("website") or item.get("type") == "municipality"):
                clean = {k: v for k, v in item.items() if k in ["name","type","province","service_area","phone","email","website","score","rationale","social_score"]}
                unique[key] = clean
        
        batch = list(unique.values())
        pushed = 0
        audit_log = []
        
        # Enhanced batch insert with detailed audit trail
        for item in batch:
            try:
                supabase.table("contractors_prospects").insert(item).execute()
                collection.add(documents=[item["name"]], metadatas=[item], ids=[f"{item['type']}:{item['name']}"])
                pushed += 1
                audit_log.append(f"✓ Pushed: {item['type']} - {item['name']}")
            except Exception as e:
                audit_log.append(f"✗ Skipped: {item.get('type','')} - {item.get('name','')} ({str(e)[:50]})")
        # Build comprehensive leads table
        table_rows = []
        for meta in metas:
            name = meta.get("name", "Unknown")
            t = meta.get("type", "unknown")
            if t == "municipality":
                prov = get_province_for_municipality(name)
                census_vars = census_map.get(prov, {})
                pop = pop_map.get(name, "N/A")
                business_count = business_count_map.get(name, "N/A")
                table_rows.append({
                    "Name": name, "Type": "Municipality", "Province": prov, 
                    "Population": pop, "Business Count": business_count,
                    "Income": str(census_vars.get("Total - Household total income groups in 2020 for private households - 100% data", "N/A"))[:50],
                    "Score": meta.get("score", 0)
                })
            elif t == "contractor":
                social_score, social_details = validate_social_media(meta.get("website", ""), meta.get("socials", ""))
                table_rows.append({
                    "Name": name, "Type": "Contractor", "Service Area": meta.get("service_area", "N/A"),
                    "Phone": meta.get("phone", ""), "Email": meta.get("email", ""),
                    "Website": meta.get("website", ""), "Social Score": social_score,
                    "Revenue Est": f"${meta.get('est_revenue_low', 0):,}-${meta.get('est_revenue_high', 0):,}"
                })
        
        # Create enhanced table
        if table_rows:
            header = [html.Th(col, style={"border": "1px solid #ddd", "padding": "8px", "backgroundColor": "#f2f2f2"}) for col in table_rows[0].keys()]
            body_rows = []
            for row in table_rows:
                cells = [html.Td(str(row[col])[:100], style={"border": "1px solid #ddd", "padding": "8px"}) for col in row.keys()]
                body_rows.append(html.Tr(cells))
            leads_table = html.Table([
                html.Thead(html.Tr(header)),
                html.Tbody(body_rows)
            ], style={"width": "100%", "borderCollapse": "collapse", "fontSize": "11px"})
        else:
            leads_table = html.P("No leads found.")
        
        status_msg = f"🚀 Auto-pushed {pushed} actionable leads to Supabase and RAG. Found {len(table_rows)} total matches." if pushed else f"📊 Found {len(table_rows)} matches. No new leads to push."
        full_status = status_msg + "\n\n" + "\n".join(audit_log[:10])  # Show first 10 audit entries
        
        # Return answer, graph, status, and leads table
        return answer, elements, full_status, leads_table
    except Exception as e:
        return f"[Error] QA failed: {e}", [], f"❌ Error occurred: {e}", html.P("Error loading data.")

# Build graph elements from current filters and data
@app.callback(
    Output("rag-graph", "elements"),
    Input("refresh-graph-btn", "n_clicks"),
    State("lead-type-dropdown", "value"),
    State("batch-start", "value"),
    State("census-province-dropdown", "value"),
)
def build_graph(n_clicks, lead_type, batch_start, selected_province):
    try:
        elements = []
        batch_start = batch_start or 0

        # Limit graph size for performance
        max_munis = 50
        max_contractors = 150

        # Nodes: provinces (selected or inferred), municipalities (batch), contractors (actionable)
        # Provinces
        province_nodes_added = set()

        # Municipalities
        batch_munis = cluster_municipalities[batch_start:batch_start+max_munis]
        for m in batch_munis:
            prov = selected_province or get_province_for_municipality(m)
            if prov and prov not in province_nodes_added:
                elements.append({"data": {"id": f"prov:{prov}", "label": prov, "type": "province"}})
                province_nodes_added.add(prov)
            elements.append({"data": {"id": f"muni:{m}", "label": f"{m}\n(pop: {pop_map.get(m, 'N/A')})", "type": "municipality"}})
            if prov:
                elements.append({"data": {"id": f"edge:prov:{prov}->muni:{m}", "source": f"prov:{prov}", "target": f"muni:{m}"}})

        # Contractors: get actionable ones and connect if service_area matches a municipality name
        actionable_contractors = load_contractor_leads()[:max_contractors]
        muni_set = set(batch_munis)
        for c in actionable_contractors:
            name = c.get("name") or "Unknown"
            cid = f"contractor:{name}"
            elements.append({
                "data": {"id": cid, "label": name, "type": "contractor"}
            })
            sa = (c.get("service_area") or "").strip()
            if sa in muni_set:
                elements.append({"data": {"id": f"edge:{cid}->muni:{sa}", "source": cid, "target": f"muni:{sa}"}})

        return elements
    except Exception as e:
        # If anything fails, return empty graph
        return []

# Automated scraping control callbacks
@app.callback(
    Output("scrape-status", "children"),
    [Input("start-scrape-btn", "n_clicks"), Input("stop-scrape-btn", "n_clicks"), Input("refresh-scrape-btn", "n_clicks")]
)
def handle_scraping_controls(start_clicks, stop_clicks, refresh_clicks):
    global scraping_stats
    
    try:
        print(f"[Debug] Callback triggered: start={start_clicks}, stop={stop_clicks}, refresh={refresh_clicks}")
        
        # Determine which button was clicked
        ctx = callback_context
        if not ctx.triggered:
            print("[Debug] No trigger, showing initial status")
            # Initial load - show current status
            if scraping_stats["running"]:
                return f"🟢 Running | Last: {scraping_stats.get('last_run', 'Never')} | Total: {scraping_stats['total_scraped']} contractors | Cities: {scraping_stats['cities_processed']}"
            else:
                return "🔴 Stopped | Ready to start automated business discovery"
        
        button_id = ctx.triggered[0]["prop_id"].split(".")[0]
        print(f"[Debug] Button clicked: {button_id}")
        
        if button_id == "start-scrape-btn" and start_clicks:
            print("[Debug] Starting automated scraping...")
            result = start_automated_scraping()
            print(f"[Debug] Start result: {result}")
            return f"🟢 {result} | Total: {scraping_stats['total_scraped']} contractors | Cities: {scraping_stats['cities_processed']}"
        
        elif button_id == "stop-scrape-btn" and stop_clicks:
            print("[Debug] Stopping automated scraping...")
            result = stop_automated_scraping()
            print(f"[Debug] Stop result: {result}")
            return f"🔴 {result} | Final Total: {scraping_stats['total_scraped']} contractors | Cities: {scraping_stats['cities_processed']}"
        
        elif button_id == "refresh-scrape-btn" and refresh_clicks:
            print("[Debug] Refreshing stats...")
            # Show detailed stats
            status = "🟢 Running" if scraping_stats["running"] else "🔴 Stopped"
            next_city = cluster_municipalities[scraping_stats["next_city_index"]] if scraping_stats["next_city_index"] < len(cluster_municipalities) else "Cycle complete"
            errors_info = f" | Errors: {len(scraping_stats['errors'])}" if scraping_stats["errors"] else ""
            return f"{status} | Next: {next_city} | Total: {scraping_stats['total_scraped']} contractors | Cities: {scraping_stats['cities_processed']}{errors_info}"
        
        # Default status
        print("[Debug] Returning default status")
        return "🔴 Ready to start automated business discovery"
        
    except Exception as e:
        print(f"[Error] Callback failed: {e}")
        return f"❌ Error: {str(e)[:100]}"

def simple_test_scraping():
    """Simple test function to verify scraping works"""
    try:
        print("[Test] Testing basic scraping functionality...")
        # Test with a small city
        test_city = "Barrie"
        bbox = get_city_bbox(test_city)
        if bbox:
            print(f"[Test] Got bbox for {test_city}: {bbox}")
            contractors = scrape_contractors_in_city(test_city, bbox)
            print(f"[Test] Found {len(contractors)} contractors in {test_city}")
            return f"✅ Test successful: {len(contractors)} contractors found in {test_city}"
        else:
            return "❌ Test failed: Could not get city bbox"
    except Exception as e:
        return f"❌ Test error: {str(e)[:100]}"

# Add test button callback
@app.callback(
    Output("test-scrape-status", "children"),
    Input("test-scrape-btn", "n_clicks")
)
def handle_test_scraping(n_clicks):
    if n_clicks:
        print("[Debug] Test scraping button clicked")
        return simple_test_scraping()
    return "Click to test scraping"

if __name__ == "__main__":
    print("[Startup] Dash starting at http://127.0.0.1:8050/ ...")
    app.run(debug=True, host="127.0.0.1", port=8050)
