"""
Census data handling module for the Contractor Lead Engine
"""
import os
import csv
from typing import Dict, List, Any

from ..utils.config import get_data_path

# Census data mappings
pop_map: Dict[str, int] = {}
census_map: Dict[str, Dict[str, str]] = {}
census_columns: List[str] = []
business_count_map: Dict[str, int] = {}

def load_census_data():
    """Load census data from files"""
    global pop_map, census_map, census_columns, business_count_map
    
    # Load population data
    population_file = get_data_path("canada_municipalities_population.csv")
    if os.path.exists(population_file):
        with open(population_file, "r", encoding="utf-8") as pf:
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
    
    # Load census wide data
    census_file = get_data_path("census_province_wide.csv")
    if os.path.exists(census_file):
        with open(census_file, "r", encoding="utf-8") as cf:
            reader = csv.DictReader(cf)
            census_columns = reader.fieldnames[1:] if reader.fieldnames else []
            for row in reader:
                province = row[reader.fieldnames[0]]
                census_map[province] = {col: row[col] for col in census_columns}
    
    # Load OSM business counts from log
    business_log = get_data_path("osm_scraper.log")
    import re
    if os.path.exists(business_log):
        with open(business_log, "r", encoding="utf-8") as f:
            for line in f:
                match = re.search(r"Found (\d+) contractors in (.+)", line)
                if match:
                    count, city = match.groups()
                    business_count_map[city.strip()] = int(count)

def get_province_for_municipality(muni: str) -> str:
    """Determine province for a municipality"""
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

def load_municipalities() -> List[str]:
    """Load municipalities from file"""
    municipalities_file = get_data_path("canada_municipalities.txt")
    municipalities = []
    try:
        with open(municipalities_file, "r", encoding="utf-8") as f:
            for line in f:
                muni = line.strip()
                if muni:
                    municipalities.append(muni)
    except Exception as e:
        print(f"[Warning] Failed to load municipalities: {e}")
    
    # Cluster municipalities by population and business density for RAG effectiveness
    # This will be used for systematic coverage of municipalities
    cluster_municipalities = []
    remaining = set(municipalities)
    
    # First, take top 100 by population
    pop_sorted = sorted([(m, pop_map.get(m, 0)) for m in municipalities], key=lambda x: x[1], reverse=True)
    for m, _ in pop_sorted[:100]:
        if m in remaining:
            cluster_municipalities.append(m)
            remaining.remove(m)
    
    # Then, add any with high business count
    for m in list(remaining):
        if m in business_count_map and business_count_map[m] > 10:
            cluster_municipalities.append(m)
            remaining.remove(m)
    
    # Finally, add the rest
    for m in sorted(remaining):
        cluster_municipalities.append(m)
    
    return municipalities, cluster_municipalities

# Initialize data
load_census_data()
municipalities, cluster_municipalities = load_municipalities()