"""
Test script for the OSM scraper module
"""

import os
import sys
import json
from scraping.osm import get_city_bbox, search_nearby_contractors

def main():
    """Main test function"""
    print("Testing OSM Scraper...")
    
    # Test city bbox lookup
    city = "Toronto"
    print(f"Getting bbox for {city}...")
    bbox = get_city_bbox(city)
    
    if bbox:
        print(f"Toronto bbox: {bbox}")
        
        # Test nearby search
        print("Testing nearby search...")
        toronto_lat, toronto_lon = 43.6532, -79.3832
        nearby = search_nearby_contractors(toronto_lat, toronto_lon, radius_km=2)
        
        print(f"Found {len(nearby)} contractors near Toronto center")
        
        if nearby:
            print(f"First result: {json.dumps(nearby[0], indent=2)}")
    else:
        print(f"Could not get bbox for {city}")

if __name__ == "__main__":
    main()