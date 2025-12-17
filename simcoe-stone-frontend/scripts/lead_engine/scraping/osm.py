"""
OpenStreetMap (OSM) Scraping Module

This module handles scraping contractor data from OpenStreetMap APIs:
1. Uses Nominatim for geocoding and location search
2. Uses Overpass API for querying POIs and businesses
3. Implements caching and rate limiting to avoid API blocks
"""

import os
import time
import requests
import json
import logging
import hashlib
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
    filename=os.path.join(os.path.dirname(os.path.dirname(__file__)), "osm_scraper.log"),
    filemode='a'
)
logger = logging.getLogger("OSM_Scraper")

# API endpoints and USER_AGENT are imported from shared config

# Scraping parameters
DELAY_BETWEEN_REQUESTS = 2  # Seconds between API calls
RESULTS_CACHE_DURATION = 24 * 60 * 60  # Cache results for 24 hours

# Cache directory
CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "cache")
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

def scrape_contractors(city_name: str, bbox: Tuple[float, float, float, float]) -> List[Dict[str, Any]]:
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
                    # Apply large-corp filter and dedup by name+service_area
                    cleaned = []
                    seen = set()
                    for c in cached_data:
                        name = (c.get("name") or "").strip()
                        if not name:
                            continue
                        if is_large_corp(name, c.get("website")):
                            continue
                        key = (name, c.get("service_area"))
                        if key in seen:
                            continue
                        seen.add(key)
                        cleaned.append(c)
                    logger.info(f"Loaded {len(cleaned)} contractors from cache for {city_name}")
                    # Re-cache cleaned data
                    try:
                        with open(cache_file, 'w') as wf:
                            json.dump(cleaned, wf)
                    except Exception:
                        pass
                    return cleaned
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

def search_nearby_contractors(lat: float, lon: float, radius_km: float = 5) -> List[Dict[str, Any]]:
    """Search for contractors near a specific location
    
    Args:
        lat: Latitude
        lon: Longitude
        radius_km: Search radius in kilometers
        
    Returns:
        List of contractor data dictionaries
    """
    contractors = []
    cache_key = f"nearby_{lat}_{lon}_{radius_km}"
    cache_file = os.path.join(CACHE_DIR, f"{hashlib.md5(cache_key.encode()).hexdigest()}.json")
    
    # Check cache first
    if os.path.exists(cache_file):
        cache_age = time.time() - os.path.getmtime(cache_file)
        if cache_age < RESULTS_CACHE_DURATION:
            try:
                with open(cache_file, 'r') as f:
                    cached_data = json.load(f)
                    # Apply large-corp filter and dedup by name only (nearby search)
                    cleaned = []
                    seen = set()
                    for c in cached_data:
                        name = (c.get("name") or "").strip()
                        if not name:
                            continue
                        if is_large_corp(name, c.get("website")):
                            continue
                        if name in seen:
                            continue
                        seen.add(name)
                        cleaned.append(c)
                    logger.info(f"Loaded {len(cleaned)} nearby contractors from cache")
                    try:
                        with open(cache_file, 'w') as wf:
                            json.dump(cleaned, wf)
                    except Exception:
                        pass
                    return cleaned
            except Exception as e:
                logger.warning(f"Failed to load nearby contractors from cache: {e}")
    
    # Convert radius to degrees (approximate)
    radius_deg = radius_km / 111.0  # ~111km per degree at equator
    
    # If not in cache or cache expired, fetch from API
    for tag_key, tag_value in OSM_QUERIES:
        try:
            logger.info(f"Querying OSM for {tag_key}={tag_value} near ({lat}, {lon})")
            
            # Build Overpass query with around filter
            overpass_query = f"""
            [out:json][timeout:25];
            (
              node["{tag_key}"="{tag_value}"](around:{radius_km * 1000},{lat},{lon});
              way["{tag_key}"="{tag_value}"](around:{radius_km * 1000},{lat},{lon});
              relation["{tag_key}"="{tag_value}"](around:{radius_km * 1000},{lat},{lon});
            );
            out center meta;
            """
            
            headers = {"User-Agent": USER_AGENT}
            resp = requests.post(OVERPASS_URL, data=overpass_query, headers=headers, timeout=30)
            
            if resp.status_code == 200:
                data = resp.json()
                elements = data.get("elements", [])
                logger.info(f"Found {len(elements)} {tag_key}={tag_value} elements near ({lat}, {lon})")
                
                # Process elements
                for element in elements:
                    tags = element.get("tags", {})
                    name = tags.get("name")
                    
                    # Skip entries without names
                    if not name:
                        continue

                    # Exclude large corporations by name or domain
                    if is_large_corp(name, tags.get("website")):
                        continue
                    
                    # Extract coordinates
                    element_lat = element.get("lat") or (element.get("center", {}).get("lat"))
                    element_lon = element.get("lon") or (element.get("center", {}).get("lon"))
                    
                    # Build contractor data
                    contractor = {
                        "name": name,
                        "service_area": tags.get("addr:city", "Unknown"),
                        "phone": tags.get("phone", ""),
                        "email": tags.get("email", ""),
                        "website": tags.get("website", ""),
                        "address": tags.get("addr:full") or f"{tags.get('addr:housenumber', '')} {tags.get('addr:street', '')}".strip(),
                        "craft_type": f"{tag_key}:{tag_value}",
                        "source": "OSM_NearbySearch",
                        "status": "scraped",
                        "score": 5,  # Base score
                        "latitude": element_lat,
                        "longitude": element_lon,
                        "distance_km": None,  # Will calculate below if coordinates available
                        "scraped_at": datetime.now().isoformat()
                    }
                    
                    # Calculate distance if coordinates available
                    if element_lat and element_lon:
                        try:
                            from math import sin, cos, sqrt, atan2, radians
                            
                            # Approximate distance calculation using Haversine formula
                            R = 6371.0  # Earth radius in km
                            
                            lat1, lon1 = radians(lat), radians(lon)
                            lat2, lon2 = radians(element_lat), radians(element_lon)
                            
                            dlon = lon2 - lon1
                            dlat = lat2 - lat1
                            
                            a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
                            c = 2 * atan2(sqrt(a), sqrt(1 - a))
                            
                            distance = R * c
                            contractor["distance_km"] = round(distance, 2)
                        except Exception as e:
                            logger.warning(f"Error calculating distance: {e}")
                    
                    # Score based on available contact info and distance
                    if contractor["phone"]: contractor["score"] += 2
                    if contractor["email"]: contractor["score"] += 2
                    if contractor["website"]: contractor["score"] += 3
                    
                    # Deduplicate based on name
                    if not any(c["name"] == name for c in contractors):
                        contractors.append(contractor)
            
            # Rate limiting between queries
            time.sleep(DELAY_BETWEEN_REQUESTS)
            
        except Exception as e:
            logger.error(f"Error querying OSM for {tag_key}={tag_value} near ({lat}, {lon}): {e}")
            time.sleep(DELAY_BETWEEN_REQUESTS * 2)  # Longer delay after error
    
    # Sort by distance if available
    contractors = sorted(contractors, key=lambda x: x.get("distance_km", float('inf')) if x.get("distance_km") is not None else float('inf'))
    
    # Cache the results
    if contractors:
        try:
            with open(cache_file, 'w') as f:
                json.dump(contractors, f)
            logger.info(f"Cached {len(contractors)} nearby contractors")
        except Exception as e:
            logger.warning(f"Failed to cache nearby contractors: {e}")
    
    return contractors[:MAX_PER_CITY]  # Ensure we don't exceed the max per result

def main():
    """Main function for testing"""
    test_cities = ["Toronto", "Ottawa", "Vancouver"]
    
    for city in test_cities:
        print(f"Testing OSM scraping for {city}...")
        bbox = get_city_bbox(city)
        
        if bbox:
            contractors = scrape_contractors(city, bbox)
            print(f"Found {len(contractors)} contractors in {city}")
            
            # Print first contractor as example
            if contractors:
                print(f"Example: {json.dumps(contractors[0], indent=2)}")
        else:
            print(f"Could not get bbox for {city}")
        
        print("=" * 50)
    
    # Test nearby search
    print("Testing nearby search...")
    # Toronto coordinates
    toronto_lat, toronto_lon = 43.6532, -79.3832
    nearby = search_nearby_contractors(toronto_lat, toronto_lon, radius_km=5)
    print(f"Found {len(nearby)} contractors near Toronto center")
    
    if nearby:
        print(f"Closest: {json.dumps(nearby[0], indent=2)}")

if __name__ == "__main__":
    main()
