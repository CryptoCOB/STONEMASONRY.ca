"""
Lead Generation Script

This script runs the actual lead generation process:
1. Scrapes contractor data from OpenStreetMap for multiple cities
2. Saves the results to the leads CSV file
3. Updates the RAG database with new leads
"""

import os
import sys
import json
import logging
from datetime import datetime
from typing import List, Dict, Any

# Add the parent directory to the path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Import scraping modules
from scraping.osm import get_city_bbox, scrape_contractors

# Import data sync module
from modules.data.sync import DataSyncManager

# Import RAG module
try:
    from modules.data.rag import RAGEngine
    RAG_AVAILABLE = True
except ImportError:
    print("RAG module not available, will not update vector database")
    RAG_AVAILABLE = False

# Enrichment selector (Ollama/OpenAI/heuristic)
CONFIG_PATH = os.path.join(parent_dir, "data", "config.json")
try:
    from enrichers.selector import enrich_lead_with_selector
    ENRICH_AVAILABLE = True
except Exception:
    ENRICH_AVAILABLE = False

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename=os.path.join(current_dir, "lead_generation.log"),
    filemode='a'
)
logger = logging.getLogger("LeadGeneration")

# Target cities for scraping
DEFAULT_CITIES = [
    "Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", 
    "Richmond Hill", "Oakville", "Burlington", "Hamilton", "Oshawa",
    "Ottawa", "Montreal", "Vancouver", "Calgary", "Edmonton"
]

def generate_leads(
    cities: List[str] = None, 
    save_to_csv: bool = True,
    update_rag: bool = True,
    per_hour_cap: int = 50,
) -> Dict[str, Any]:
    """Generate leads from OpenStreetMap for specified cities
    
    Args:
        cities: List of city names to scrape (default is major Canadian cities)
        save_to_csv: Whether to save results to CSV file
        update_rag: Whether to update the RAG database
        
    Returns:
        Dictionary with stats about the lead generation process
    """
    if cities is None:
        cities = DEFAULT_CITIES
    
    # Initialize data sync manager
    sync_manager = DataSyncManager()
    
    # Initialize RAG engine if available and requested
    rag_engine = None
    if RAG_AVAILABLE and update_rag:
        try:
            rag_engine = RAGEngine()
            print("RAG engine initialized")
        except Exception as e:
            logger.error(f"Failed to initialize RAG engine: {e}")
            print(f"Error initializing RAG engine: {e}")
    
    # Stats tracking
    stats = {
        "total_leads": 0,
        "new_leads": 0,
        "cities_processed": 0,
        "cities_failed": 0,
        "start_time": datetime.now().isoformat(),
        "end_time": None,
        "rag_updated": False
    }
    
    all_leads: List[Dict[str, Any]] = []
    
    print(f"Starting lead generation for {len(cities)} cities...")
    logger.info(f"Starting lead generation for {len(cities)} cities")
    
    # Process each city
    for city in cities:
        try:
            print(f"Processing {city}...")
            logger.info(f"Processing {city}")
            
            # Get city bounding box
            bbox = get_city_bbox(city)
            
            if not bbox:
                print(f"Could not find bounding box for {city}, skipping")
                logger.warning(f"Could not find bounding box for {city}, skipping")
                stats["cities_failed"] += 1
                continue
            
            # Scrape contractors in the city
            contractors = scrape_contractors(city, bbox)
            
            if contractors:
                print(f"Found {len(contractors)} contractors in {city}")
                logger.info(f"Found {len(contractors)} contractors in {city}")
                all_leads.extend(contractors)
                stats["total_leads"] += len(contractors)
            else:
                print(f"No contractors found in {city}")
                logger.warning(f"No contractors found in {city}")
            
            stats["cities_processed"] += 1
            
        except Exception as e:
            print(f"Error processing {city}: {e}")
            logger.error(f"Error processing {city}: {e}")
            stats["cities_failed"] += 1
    
    # Apply deduplication against existing and per-hour cap, then enrich
    new_candidates: List[Dict[str, Any]] = []
    if all_leads:
        try:
            existing_leads_df = sync_manager.load_leads_from_csv()
            import pandas as pd
            if not existing_leads_df.empty:
                existing_leads_df["match_key"] = existing_leads_df["name"].astype(str) + "|" + existing_leads_df["service_area"].astype(str)
                existing_keys = set(existing_leads_df["match_key"].tolist())
            else:
                existing_keys = set()
        except Exception:
            existing_keys = set()

        # Filter unique by (name|service_area) against existing
        seen = set()
        for lead in all_leads:
            key = f"{lead.get('name','')}|{lead.get('service_area','')}"
            if key and key not in existing_keys and key not in seen:
                new_candidates.append(lead)
                seen.add(key)

        # Cap the number of new leads to process this run
        if per_hour_cap and len(new_candidates) > per_hour_cap:
            new_candidates = new_candidates[:per_hour_cap]

        # Enrich the selected new candidates
        enriched_count = 0
        if ENRICH_AVAILABLE and new_candidates:
            enriched = []
            for lead in new_candidates:
                enriched_lead = enrich_lead_with_selector(lead, CONFIG_PATH)
                enriched.append(enriched_lead)
                enriched_count += 1
            new_candidates = enriched
        stats["enriched"] = enriched_count

    # Save results if requested
    if save_to_csv and (new_candidates or all_leads):
        try:
            # Load existing leads
            existing_leads = sync_manager.load_leads_from_csv()
            
            # Convert all_leads to DataFrame
            import pandas as pd
            # Prefer the new deduped candidates if available; else fall back to all_leads
            target_leads = new_candidates if new_candidates else all_leads
            new_leads_df = pd.DataFrame(target_leads)
            
            # Count new leads (not in existing leads)
            if not existing_leads.empty:
                # Create a key for matching (name + service_area)
                new_leads_df["match_key"] = new_leads_df["name"] + "|" + new_leads_df["service_area"]
                existing_leads["match_key"] = existing_leads["name"] + "|" + existing_leads["service_area"]
                
                # Find truly new leads
                new_leads_mask = ~new_leads_df["match_key"].isin(existing_leads["match_key"])
                truly_new_leads = new_leads_df[new_leads_mask]
                stats["new_leads"] = len(truly_new_leads)
                
                # Remove temporary match_key column
                new_leads_df = new_leads_df.drop(columns=["match_key"])
                existing_leads = existing_leads.drop(columns=["match_key"])
                
                # Combine with existing leads
                combined_leads = pd.concat([existing_leads, truly_new_leads], ignore_index=True)
            else:
                # All leads are new if there are no existing leads
                stats["new_leads"] = len(new_leads_df)
                combined_leads = new_leads_df
            
            # Save combined leads
            if sync_manager.save_leads_to_csv(combined_leads):
                print(f"Saved {len(combined_leads)} total leads to CSV (+{stats['new_leads']} new this run)")
                logger.info(f"Saved {len(combined_leads)} total leads to CSV (+{stats['new_leads']} new this run)")
                
                # Create backup
                sync_manager.backup_leads(combined_leads)
                print("Created backup of leads data")
            else:
                print("Failed to save leads to CSV")
                logger.error("Failed to save leads to CSV")
        
        except Exception as e:
            print(f"Error saving leads to CSV: {e}")
            logger.error(f"Error saving leads to CSV: {e}")
    
    # Update RAG database if requested
    if update_rag and RAG_AVAILABLE and rag_engine and all_leads:
        try:
            # Add new leads to RAG database
            added_count = 0
            for lead in all_leads:
                if rag_engine.add_contractor(lead):
                    added_count += 1
            
            if added_count > 0:
                print(f"Added {added_count} leads to RAG database")
                logger.info(f"Added {added_count} leads to RAG database")
                stats["rag_updated"] = True
            else:
                print("No leads added to RAG database")
                logger.warning("No leads added to RAG database")
        
        except Exception as e:
            print(f"Error updating RAG database: {e}")
            logger.error(f"Error updating RAG database: {e}")
    
    # Update stats
    stats["end_time"] = datetime.now().isoformat()
    
    # Save stats to file
    stats_file = os.path.join(current_dir, "lead_generation_stats.json")
    try:
        with open(stats_file, 'w') as f:
            json.dump(stats, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving stats to file: {e}")
    
    return stats

def main():
    """Main function for running lead generation"""
    import argparse
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Generate leads from OpenStreetMap")
    parser.add_argument(
        "--cities", 
        type=str, 
        nargs="+", 
        help="List of cities to scrape (default: major Canadian cities)"
    )
    parser.add_argument(
        "--no-csv", 
        action="store_true", 
        help="Don't save results to CSV file"
    )
    parser.add_argument(
        "--no-rag", 
        action="store_true", 
        help="Don't update RAG database"
    )
    parser.add_argument(
        "--cap",
        type=int,
        default=50,
        help="Per-hour cap for number of leads to process (default: 50)"
    )
    
    args = parser.parse_args()
    
    # Run lead generation
    stats = generate_leads(
        cities=args.cities,
        save_to_csv=not args.no_csv,
        update_rag=not args.no_rag,
        per_hour_cap=args.cap,
    )
    
    # Print summary
    print("\nLead Generation Summary:")
    print(f"Cities processed: {stats['cities_processed']} (failed: {stats['cities_failed']})")
    print(f"Total leads found: {stats['total_leads']}")
    print(f"New leads added: {stats['new_leads']}")
    print(f"RAG database updated: {stats['rag_updated']}")
    print(f"Start time: {stats['start_time']}")
    print(f"End time: {stats['end_time']}")

if __name__ == "__main__":
    main()