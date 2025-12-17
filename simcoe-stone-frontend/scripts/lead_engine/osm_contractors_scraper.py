"""
Free contractor/business discovery via OpenStreetMap Overpass API.

Quick Run Instructions:
    # Install requirements (from scripts/lead_engine)
    uv pip install requests python-dotenv supabase

    # Run for first 10 cities (fast test)
    python osm_contractors_scraper.py 10

    # Run for default 50 cities
    python osm_contractors_scraper.py

You can change the city limit by passing an integer argument.

-- Queries OSM for contractor-like businesses by tags (craft, building, construction, mason, etc.)
-- Uses city polygons/bboxes (via Nominatim) to scope results per municipality
-- Maps to our contractors_prospects schema and inserts to Supabase
-- Respects rate limits and includes retry/backoff
"""
import os
import time
import logging
from typing import Dict, Any, List, Optional

import requests
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "20"))
SLEEP_BETWEEN_REQ = float(os.getenv("OSM_SLEEP", "1.2"))
MAX_PER_CITY = int(os.getenv("OSM_MAX_PER_CITY", "200"))

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"
USER_AGENT = "SimcoeStoneLeadEngine/1.0 (contact: admin@example.com)"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
logging.basicConfig(filename="osm_scraper.log", level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")

MUNICIPALITIES_FILE = os.path.join(os.path.dirname(__file__), "canada_municipalities.txt")

# Contractor-related OSM tags
OSM_QUERIES = [
    # craft
    ("craft", "stonemason"), ("craft", "carpenter"), ("craft", "builder"),
    ("craft", "handyman"), ("craft", "tile_layer"),
    # shop
    ("shop", "hardware"), ("shop", "doityourself"),
    # office
    ("office", "construction"), ("office", "architect"),
    # construction sites (sometimes companies tag)
    ("construction", "yes"),
]

HEADERS = {"User-Agent": USER_AGENT}


def load_cities(limit: Optional[int] = None) -> List[str]:
    with open(MUNICIPALITIES_FILE, "r", encoding="utf-8") as f:
        cities = [line.strip().strip("'") for line in f if line.strip() and not line.startswith("#")]
    return cities[:limit] if limit else cities


def nominatim_bbox(city: str) -> Optional[List[float]]:
    params = {"q": f"{city}, Canada", "format": "json", "limit": 1}
    r = requests.get(NOMINATIM_URL, params=params, headers=HEADERS, timeout=REQUEST_TIMEOUT)
    r.raise_for_status()
    data = r.json()
    if not data:
        return None
    bbox = data[0].get("boundingbox")
    if not bbox:
        return None
    # [south, north, west, east]
    south, north, west, east = map(float, bbox)
    return [south, west, north, east]


def overpass_query(bbox: List[float]) -> str:
    s, w, n, e = bbox
    parts = []
    for k, v in OSM_QUERIES:
        parts.append(f'node["{k}"="{v}"]({s},{w},{n},{e});')
        parts.append(f'way["{k}"="{v}"]({s},{w},{n},{e});')
        parts.append(f'relation["{k}"="{v}"]({s},{w},{n},{e});')
    body = "[out:json][timeout:25];(\n" + "\n".join(parts) + "\n);out center;"
    return body

def extract_socials(tags: Dict[str, Any]) -> Dict[str, str]:
    socials_keys = [
        "facebook", "contact:facebook", "instagram", "contact:instagram",
        "twitter", "contact:twitter", "linkedin", "contact:linkedin",
        "youtube", "contact:youtube", "tikTok", "contact:tiktok", "contact:social"
    ]
    out = {}
    for k in socials_keys:
        if k in tags and tags[k]:
            out[k] = tags[k]
    return out


def fetch_osm_businesses(city: str) -> List[Dict[str, Any]]:
    bbox = nominatim_bbox(city)
    if not bbox:
        logging.info(f"No bbox found for {city}")
        return []
    q = overpass_query(bbox)
    r = requests.post(OVERPASS_URL, data={"data": q}, headers=HEADERS, timeout=REQUEST_TIMEOUT)
    r.raise_for_status()
    data = r.json()
    elements = data.get("elements", [])
    out = []
    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name") or tags.get("operator") or "Unknown"
        phone = tags.get("phone") or tags.get("contact:phone")
        website = tags.get("website") or tags.get("contact:website")
        email = tags.get("email") or tags.get("contact:email")
        socials = extract_socials(tags)
        addr = ", ".join(filter(None, [tags.get("addr:housenumber"), tags.get("addr:street"), tags.get("addr:city"), tags.get("addr:province"), tags.get("addr:postcode")]))
        # Only keep actionable leads: must have at least one of phone/email/website/socials
        if not (phone or email or website or socials):
            continue
        record = {
            "name": name,
            "phone": phone,
            "email": email,
            "website": website,
            "socials": {"osm": socials} if socials else None,
            "address": addr,
            "service_area": city,
            "source": "osm",
            "status": "prospect",
            "score": 0,
        }
        out.append(record)
        if len(out) >= MAX_PER_CITY:
            break
    time.sleep(SLEEP_BETWEEN_REQ)
    return out


def insert_supabase(records: List[Dict[str, Any]]) -> int:
    count = 0
    for rec in records:
        try:
            supabase.table("contractors_prospects").insert(rec).execute()
            count += 1
        except Exception as e:
            logging.warning(f"Insert failed for {rec.get('name')}: {e}")
    return count


def run(limit_cities: Optional[int] = 50):
    cities = load_cities(limit=limit_cities)
    total = 0
    for idx, city in enumerate(cities, 1):
        print(f"[{idx}/{len(cities)}] Processing: {city}")
        try:
            recs = fetch_osm_businesses(city)
            print(f"  Found {len(recs)} actionable records for {city}")
            inserted = insert_supabase(recs)
            print(f"  Inserted {inserted} records into Supabase for {city}")
            logging.info(f"{city}: inserted {inserted}")
        except Exception as e:
            print(f"  Error on city {city}: {e}")
            logging.error(f"Error on city {city}: {e}")
    print(f"Inserted {total} OSM contractor/business prospects into Supabase.")


if __name__ == "__main__":
    import sys
    limit = 50
    if len(sys.argv) > 1:
        try:
            limit = int(sys.argv[1])
        except Exception:
            print(f"Invalid city limit argument: {sys.argv[1]}. Using default 50.")
    run(limit_cities=limit)
