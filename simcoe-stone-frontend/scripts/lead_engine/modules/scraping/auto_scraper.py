"""
Scraping module for automatically discovering contractor leads
"""
import time
import threading
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import requests

from ..utils.config import (
    USER_AGENT, NOMINATIM_URL, OVERPASS_URL, OSM_QUERIES,
    MAX_PER_CITY, SCRAPE_BATCH_SIZE, AUTO_SCRAPE_INTERVAL, scraping_stats,
    is_large_corp,
)
from ..data.database import supabase, collection, save_to_chroma, check_duplicate
from ..data.sync import DataSyncManager
from ..data.census import cluster_municipalities

def get_city_bbox(city_name: str) -> Optional[Tuple[float, float, float, float]]:
    """Get bounding box for a city from Nominatim"""
    try:
        params = {
            "q": city_name,
            "format": "json",
            "limit": 1,
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
                    name = tags.get("name")
                    if not name:
                        # Skip entries without explicit names
                        continue
                    # Exclude large corporations by name or domain
                    if is_large_corp(name, tags.get("website")):
                        continue
                    
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
                        "scraped_at": datetime.now().isoformat(),
                        "type": "contractor"  # Type marker for Chroma
                    }
                    
                    # Score based on available contact info
                    if contractor["phone"]: contractor["score"] += 2
                    if contractor["email"]: contractor["score"] += 2
                    if contractor["website"]: contractor["score"] += 3
                    
                    # Deduplicate within this batch by name + service area
                    if not any(c.get("name") == contractor["name"] and c.get("service_area") == contractor["service_area"] for c in contractors):
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
            sync = DataSyncManager()
            try:
                existing_df = sync.load_leads_from_csv()
                if not existing_df.empty:
                    existing_df["match_key"] = (existing_df["name"].astype(str).str.strip().str.lower()
                                                 + "|" + existing_df["service_area"].astype(str).str.strip().str.lower())
                    existing_keys = set(existing_df["match_key"].tolist())
                else:
                    existing_keys = set()
            except Exception:
                existing_keys = set()

            pending_local_add: List[Dict[str, Any]] = []
            for city in cities_batch:
                try:
                    # Get city bounding box
                    bbox = get_city_bbox(city)
                    if not bbox:
                        continue
                    
                    print(f"[AutoScrape] Processing {city}...")
                    
                    # Scrape contractors
                    contractors = scrape_contractors_in_city(city, bbox)
                    
                    # Insert into Supabase with deduplication and large-corp exclusion
                    for contractor in contractors:
                        try:
                            # Exclude large corporations globally
                            if is_large_corp(contractor.get("name"), contractor.get("website")):
                                continue
                            # Build local dedup key
                            key = f"{(contractor.get('name') or '').strip().lower()}|{(contractor.get('service_area') or '').strip().lower()}"
                            if key in existing_keys:
                                continue
                            # Check remote duplicate (best-effort)
                            try:
                                if check_duplicate("contractors_prospects", "name", contractor["name"]):
                                    # Still add to local if not present there
                                    existing_keys.add(key)
                                    continue
                            except Exception:
                                # If remote check fails, proceed with local flow
                                pass
                                
                            # Try insert new contractor to Supabase (if available)
                            inserted_remote = False
                            try:
                                if supabase is not None:
                                    # Some Supabase schemas may not accept craft_type; send minimal payload
                                    sup_payload = {k: contractor.get(k) for k in [
                                        "name","service_area","phone","email","website","address","source","status","score","latitude","longitude","scraped_at","category","quality_score","profile","enriched_by"
                                    ] if contractor.get(k) is not None}
                                    supabase.table("contractors_prospects").insert(sup_payload).execute()
                                    inserted_remote = True
                            except Exception as insert_e:
                                print(f"[Warning] Failed to insert {contractor['name']}: {insert_e}")
                                inserted_remote = False
                            
                            # Always add to pending local if passes local dedup
                            pending_local_add.append(contractor)
                            existing_keys.add(key)
                            print(f"[AutoScrape] Accepted: {contractor['name']} in {city} (batch+1)")
                                
                            # Add to Chroma for immediate searchability
                            save_to_chroma(
                                contractor, 
                                doc_id=f"auto_contractor:{contractor['name']}:{city}",
                                document=contractor["name"]
                            )
                                
                            batch_scraped += 1
                                
                        except Exception as insert_e:
                            print(f"[Warning] Processing error for {contractor.get('name')}: {insert_e}")
                            continue
                    
                    scraping_stats["cities_processed"] += 1
                    
                except Exception as city_e:
                    scraping_stats["errors"].append(f"{city}: {str(city_e)[:100]}")
                    # Keep only last 10 errors
                    scraping_stats["errors"] = scraping_stats["errors"][-10:]
                    continue
            
            # Persist any locally pending leads (merge + dedup) so progress is not lost
            try:
                if pending_local_add:
                    new_df = None
                    try:
                        import pandas as pd
                        new_df = pd.DataFrame(pending_local_add)
                    except Exception:
                        new_df = None
                    if new_df is not None and not new_df.empty:
                        print(f"[AutoScrape] Persisting locally: {len(new_df)} new leads")
                        existing_df = sync.load_leads_from_csv()
                        # Normalize match key for dedup
                        new_df["match_key"] = (new_df["name"].astype(str).str.strip().str.lower()
                                                + "|" + new_df["service_area"].astype(str).str.strip().str.lower())
                        if not existing_df.empty and "match_key" in existing_df.columns:
                            merged = pd.concat([existing_df, new_df], ignore_index=True)
                            merged = merged.drop_duplicates(subset=["match_key"], keep="first")
                        else:
                            merged = pd.concat([existing_df, new_df], ignore_index=True)
                            merged = merged.drop_duplicates(subset=["name","service_area"], keep="first")
                        sync.save_leads_to_csv(merged)
            except Exception as e:
                print(f"[Warning] Local persist failed: {e}")

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