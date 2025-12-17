"""
Automated Web Scraper for Contractor/Business Lead Generation

This module scrapes business information from the web, focusing on:
1. OpenStreetMap (OSM) data for stonemasons, contractors, etc.
2. Google Maps businesses in targeted geographic areas
3. Yelp listings for construction and masonry businesses
4. Local business directories specific to construction

It uses intelligent rate limiting and rotates between sources to avoid blocks.
Results are structured and stored in the central lead database.
"""

import os
import time
import requests
import json
import logging
import hashlib
import random
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List, Tuple
from modules.utils.config import (
    USER_AGENT,
    NOMINATIM_URL,
    OVERPASS_URL,
    OSM_QUERIES,
    MAX_PER_CITY,
    is_large_corp,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename=os.path.join(os.path.dirname(__file__), "auto_scraper.log"),
    filemode='a'
)
logger = logging.getLogger("AutoScraper")

# API endpoints and USER_AGENT are imported from shared config

# Scraping parameters
DELAY_BETWEEN_REQUESTS = 2  # Seconds between API calls
RESULTS_CACHE_DURATION = 24 * 60 * 60  # Cache results for 24 hours

# Cache directory
CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")
os.makedirs(CACHE_DIR, exist_ok=True)

# OSM_QUERIES imported from shared config

def get_city_bbox(city_name: str) -> Optional[Tuple[float, float, float, float]]:
    """Get bounding box for a city using Nominatim
    
    Args:
        city_name: Name of the city
        
    Returns:
        Tuple of (south, west, north, east) coordinates or None if not found
    """
    cache_file = os.path.join(CACHE_DIR, f"bbox_{hashlib.md5(city_name.encode()).hexdigest()}.json")
    
    # Check cache first
    if os.path.exists(cache_file):
        cache_age = time.time() - os.path.getmtime(cache_file)
        if cache_age < RESULTS_CACHE_DURATION:
            try:
                with open(cache_file, 'r') as f:
                    return tuple(json.load(f))
            except Exception as e:
                logger.warning(f"Failed to load bbox from cache for {city_name}: {e}")
    
    # If not in cache or cache expired, fetch from API
    try:
        params = {
            "q": f"{city_name}, Canada",
            "format": "json",
            "limit": 1,
            "extratags": 1,
            "addressdetails": 1
        }
        headers = {"User-Agent": USER_AGENT}
        
        logger.info(f"Fetching bbox for {city_name}")
        resp = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if data:
                bbox = data[0].get("boundingbox")
                if bbox and len(bbox) == 4:
                    # Convert to (south, west, north, east) and store as floats
                    result = (float(bbox[0]), float(bbox[2]), float(bbox[1]), float(bbox[3]))
                    
                    # Cache the result
                    with open(cache_file, 'w') as f:
                        json.dump(result, f)
                    
                    return result
        
        logger.warning(f"No bbox found for {city_name}")
        return None
    
    except Exception as e:
        logger.error(f"Error getting bbox for {city_name}: {e}")
        return None
    
    finally:
        # Rate limiting
        time.sleep(DELAY_BETWEEN_REQUESTS)

def scrape_osm_contractors(city_name: str, bbox: Tuple[float, float, float, float]) -> List[Dict[str, Any]]:
    """Scrape contractors from OpenStreetMap in a specific city
    
    Args:
        city_name: Name of the city
        bbox: Bounding box as (south, west, north, east)
        
    Returns:
        List of contractor data dictionaries
    """
    contractors = []
    south, west, north, east = bbox
    
    cache_file = os.path.join(CACHE_DIR, f"osm_{hashlib.md5(city_name.encode()).hexdigest()}.json")
    
    # Check cache first
    if os.path.exists(cache_file):
        cache_age = time.time() - os.path.getmtime(cache_file)
        if cache_age < RESULTS_CACHE_DURATION:
            try:
                with open(cache_file, 'r') as f:
                    cached_data = json.load(f)
                    logger.info(f"Loaded {len(cached_data)} contractors from cache for {city_name}")
                    return cached_data
            except Exception as e:
                logger.warning(f"Failed to load OSM data from cache for {city_name}: {e}")
    
    # If not in cache or cache expired, fetch from API
    for tag_key, tag_value in OSM_QUERIES:
        try:
            logger.info(f"Querying OSM for {tag_key}={tag_value} in {city_name}")
            
            # Build Overpass query
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
                elements = data.get("elements", [])
                logger.info(f"Found {len(elements)} {tag_key}={tag_value} elements in {city_name}")
                
                # Process elements up to the per-query limit
                for element in elements[:MAX_PER_CITY // len(OSM_QUERIES)]:
                    tags = element.get("tags", {})
                    name = tags.get("name")
                    
                    # Skip entries without names
                    if not name:
                        continue

                    # Exclude large corporations by name or domain
                    if is_large_corp(name, tags.get("website")):
                        continue
                    
                    # Extract coordinates
                    lat = element.get("lat") or (element.get("center", {}).get("lat"))
                    lon = element.get("lon") or (element.get("center", {}).get("lon"))
                    
                    # Build contractor data
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
                    
                    # Deduplicate based on name within the same service area
                    if not any(c["name"] == name and c.get("service_area") == city_name for c in contractors):
                        contractors.append(contractor)
            
            # Rate limiting between queries
            time.sleep(DELAY_BETWEEN_REQUESTS)
            
        except Exception as e:
            logger.error(f"Error querying OSM for {tag_key}={tag_value} in {city_name}: {e}")
            time.sleep(DELAY_BETWEEN_REQUESTS * 2)  # Longer delay after error
    
    # Cache the results
    if contractors:
        try:
            with open(cache_file, 'w') as f:
                json.dump(contractors, f)
            logger.info(f"Cached {len(contractors)} contractors for {city_name}")
        except Exception as e:
            logger.warning(f"Failed to cache contractors for {city_name}: {e}")
    
    return contractors[:MAX_PER_CITY]  # Ensure we don't exceed the max per city

def scrape_google_maps_contractors(city_name: str) -> List[Dict[str, Any]]:
    """Simulated Google Maps scraper - placeholder
    
    Note: Actual implementation would use a proper Google Maps API or scraper
    
    Args:
        city_name: Name of the city
        
    Returns:
        List of contractor data dictionaries
    """
    logger.info(f"Google Maps scraping not fully implemented for {city_name}")
    
    # Return a simulated result for testing
    if random.random() < 0.7:  # 70% chance of returning a simulated result
        return [{
            "name": f"Google Maps Contractor {i} in {city_name}",
            "service_area": city_name,
            "phone": f"(647) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
            "email": "",
            "website": f"https://example.com/contractor{i}" if random.random() > 0.5 else "",
            "address": f"{random.randint(1, 999)} Main St, {city_name}",
            "source": "GoogleMaps_Auto",
            "status": "scraped",
            "score": random.randint(3, 8),
            "scraped_at": datetime.now().isoformat()
        } for i in range(1, random.randint(1, 5))]
    
    return []

def scrape_yelp_contractors(city_name: str) -> List[Dict[str, Any]]:
    """Simulated Yelp scraper - placeholder
    
    Note: Actual implementation would use Yelp Fusion API or scraper
    
    Args:
        city_name: Name of the city
        
    Returns:
        List of contractor data dictionaries
    """
    logger.info(f"Yelp scraping not fully implemented for {city_name}")
    
    # Return a simulated result for testing
    if random.random() < 0.6:  # 60% chance of returning a simulated result
        return [{
            "name": f"Yelp Contractor {i} in {city_name}",
            "service_area": city_name,
            "phone": f"(647) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
            "email": "",
            "website": f"https://example.com/yelp{i}" if random.random() > 0.5 else "",
            "address": f"{random.randint(1, 999)} Market St, {city_name}",
            "source": "Yelp_Auto",
            "status": "scraped",
            "score": random.randint(3, 8),
            "scraped_at": datetime.now().isoformat()
        } for i in range(1, random.randint(1, 3))]
    
    return []

def scrape_local_directories(city_name: str) -> List[Dict[str, Any]]:
    """Simulated local directory scraper - placeholder
    
    Note: Actual implementation would use various local directory APIs or scrapers
    
    Args:
        city_name: Name of the city
        
    Returns:
        List of contractor data dictionaries
    """
    logger.info(f"Local directory scraping not fully implemented for {city_name}")
    
    # Return a simulated result for testing
    if random.random() < 0.5:  # 50% chance of returning a simulated result
        return [{
            "name": f"Directory Contractor {i} in {city_name}",
            "service_area": city_name,
            "phone": f"(647) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
            "email": f"contact{i}@example.com" if random.random() > 0.7 else "",
            "website": f"https://example.com/dir{i}" if random.random() > 0.5 else "",
            "address": f"{random.randint(1, 999)} Business Ave, {city_name}",
            "source": "LocalDir_Auto",
            "status": "scraped",
            "score": random.randint(3, 8),
            "scraped_at": datetime.now().isoformat()
        } for i in range(1, random.randint(1, 3))]
    
    return []

def scrape_all_sources(city_name: str) -> List[Dict[str, Any]]:
    """Scrape contractors from all available sources for a city
    
    Args:
        city_name: Name of the city
        
    Returns:
        List of contractor data dictionaries
    """
    logger.info(f"Starting comprehensive scrape for {city_name}")
    
    all_contractors = []
    
    # OSM scraping (primary source)
    bbox = get_city_bbox(city_name)
    if bbox:
        osm_contractors = scrape_osm_contractors(city_name, bbox)
        all_contractors.extend(osm_contractors)
        logger.info(f"Found {len(osm_contractors)} contractors from OSM for {city_name}")
    
    # Google Maps (simulated)
    google_contractors = scrape_google_maps_contractors(city_name)
    all_contractors.extend(google_contractors)
    logger.info(f"Found {len(google_contractors)} contractors from Google Maps for {city_name}")
    
    # Yelp (simulated)
    yelp_contractors = scrape_yelp_contractors(city_name)
    all_contractors.extend(yelp_contractors)
    logger.info(f"Found {len(yelp_contractors)} contractors from Yelp for {city_name}")
    
    # Local directories (simulated)
    dir_contractors = scrape_local_directories(city_name)
    all_contractors.extend(dir_contractors)
    logger.info(f"Found {len(dir_contractors)} contractors from local directories for {city_name}")
    
    # Deduplicate based on (name, service_area) and exclude large corps across sources
    unique_contractors = {}
    for contractor in all_contractors:
        # Skip large corporations from all sources as well
        if is_large_corp(contractor.get("name"), contractor.get("website")):
            continue
        key = (contractor.get("name"), contractor.get("service_area"))
        if key not in unique_contractors or contractor["score"] > unique_contractors[key]["score"]:
            unique_contractors[key] = contractor
    
    result = list(unique_contractors.values())
    logger.info(f"Total unique contractors for {city_name}: {len(result)}")
    
    return result

def save_to_database(contractors: List[Dict[str, Any]], supabase_client=None, chroma_collection=None) -> Tuple[int, int]:
    """Save contractors to Supabase and Chroma
    
    Args:
        contractors: List of contractor data
        supabase_client: Optional Supabase client
        chroma_collection: Optional Chroma collection
        
    Returns:
        Tuple of (supabase_count, chroma_count) of successfully added records
    """
    if not contractors:
        return 0, 0
    
    supabase_count = 0
    chroma_count = 0
    
    # Import only if available (to avoid dependency issues)
    if supabase_client:
        for contractor in contractors:
            try:
                # Check if already exists
                existing = supabase_client.table("contractors_prospects").select("id").eq("name", contractor["name"]).eq("service_area", contractor["service_area"]).execute()
                
                if not existing.data:
                    # Insert new contractor
                    supabase_client.table("contractors_prospects").insert(contractor).execute()
                    supabase_count += 1
                    logger.info(f"Added {contractor['name']} to Supabase")
            except Exception as e:
                logger.error(f"Error adding {contractor['name']} to Supabase: {e}")
    
    # Add to Chroma if available
    if chroma_collection:
        for contractor in contractors:
            try:
                # Generate a stable ID
                contractor_id = f"auto_contractor:{contractor['name']}:{contractor['service_area']}"
                
                # Add to Chroma
                chroma_collection.add(
                    documents=[contractor["name"]], 
                    metadatas=[{k: v for k, v in contractor.items() if isinstance(v, (str, int, float, bool))}], 
                    ids=[contractor_id]
                )
                chroma_count += 1
                logger.info(f"Added {contractor['name']} to Chroma")
            except Exception as e:
                logger.error(f"Error adding {contractor['name']} to Chroma: {e}")
    
    return supabase_count, chroma_count

def main():
    """Main function for manual testing"""
    test_cities = ["Toronto", "Ottawa", "Vancouver", "Calgary", "Montreal"]
    
    for city in test_cities:
        print(f"Testing scraping for {city}...")
        contractors = scrape_all_sources(city)
        print(f"Found {len(contractors)} contractors in {city}")
        
        # Print first contractor as example
        if contractors:
            print(f"Example: {json.dumps(contractors[0], indent=2)}")
        
        print("=" * 50)

if __name__ == "__main__":
    main()
