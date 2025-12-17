"""
Configuration module for the Contractor Lead Engine
"""
import os
from typing import Dict, Any, List

# Constants and configuration values
SCRAPE_BATCH_SIZE = 5
MAX_PER_CITY = 50
AUTO_SCRAPE_INTERVAL = 3600  # 1 hour in seconds

# User agent for API requests
USER_AGENT = "StoneMasonry.ca Lead Engine/1.0 (business prospecting; info@stonemasonry.ca)"

# API Endpoints
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# OSM Query Tags
OSM_QUERIES = [
    ("craft", "stonemason"),
    ("craft", "carpenter"),
    ("building:cladding", "stone"),
    ("building:material", "stone"),
    ("craft", "builder"),
    ("shop", "builder"),
    ("building:material", "wood"),
    ("office", "construction"),
    ("construction", "yes")
]

# Path configurations
def get_data_path(filename: str) -> str:
    """Get absolute path to a data file in the lead_engine package root"""
    # modules/utils/config.py -> modules/utils -> modules -> lead_engine
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    return os.path.join(base_dir, filename)

# Heuristics to exclude large corporations not likely to use services
BLACKLIST_NAMES = {
    "home depot", "lowe", "lowe's", "canadian tire", "walmart", "costco",
    "ikea", "rona", "rona+", "home hardware building centre", "bmr", "kent building supplies",
}
BLACKLIST_DOMAINS = {
    "homedepot.ca", "homedepot.com", "lowes.ca", "lowes.com", "canadiantire.ca",
    "walmart.ca", "walmart.com", "costco.ca", "costco.com", "ikea.com", "ikea.ca",
    "rona.ca", "homehardware.ca", "kent.ca", "bmr.co",
}

def is_large_corp(name: str | None, website: str | None) -> bool:
    n = (name or "").lower().strip()
    if any(b in n for b in BLACKLIST_NAMES):
        return True
    w = (website or "").lower()
    for d in BLACKLIST_DOMAINS:
        if d in w:
            return True
    return False

# Ollama model configuration
OLLAMA_MODEL = "llama3"

# Initialize scraping stats
scraping_stats = {
    "running": False,
    "next_city_index": 0,
    "cities_processed": 0,
    "total_scraped": 0,
    "last_run": None,
    "errors": []
}