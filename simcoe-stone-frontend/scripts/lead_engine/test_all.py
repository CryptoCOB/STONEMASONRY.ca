"""
Test script for all lead engine components
"""

import os
import sys
import json
import time
import pandas as pd
from datetime import datetime

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import all components for testing
try:
    # Scraping components
    from scraping.osm import get_city_bbox, search_nearby_contractors
    
    # RAG components
    from modules.data.rag import RAGEngine
    
    # Data sync components
    from modules.data.sync import DataSyncManager
    
    # All tests succeeded
    all_components_imported = True
    
except Exception as e:
    print(f"Error importing components: {e}")
    all_components_imported = False

def test_osm_scraper():
    """Test the OSM scraper functionality"""
    print("\n===== Testing OSM Scraper =====")
    try:
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
                print(f"First result: {nearby[0]['name']}")
                return True
        else:
            print(f"Could not get bbox for {city}")
            return False
    
    except Exception as e:
        print(f"Error testing OSM scraper: {e}")
        return False

def test_rag_module():
    """Test the RAG module functionality"""
    print("\n===== Testing RAG Module =====")
    try:
        # Initialize RAG engine
        rag = RAGEngine()
        
        # Print stats
        stats = rag.get_stats()
        print(f"RAG Stats: {len(stats)} entries")
        print(f"Collections: {stats.get('collections', {}).keys()}")
        
        # Add test contractor
        test_contractor = {
            "name": f"Test Contractor {int(time.time())}",
            "service_area": "Toronto",
            "craft_type": "stonemason",
            "phone": "416-555-1234",
            "email": "test@example.com",
            "website": "https://example.com",
            "address": "123 Test St, Toronto, ON",
            "score": 8
        }
        
        success = rag.add_contractor(test_contractor)
        print(f"Added test contractor: {success}")
        
        # Query for the contractor
        results = rag.query("stonemason in Toronto")
        print(f"Query results: {len(results)} found")
        
        return success and len(results) > 0
    
    except Exception as e:
        print(f"Error testing RAG module: {e}")
        return False

def test_data_sync():
    """Test the data sync functionality"""
    print("\n===== Testing Data Sync Module =====")
    try:
        # Initialize sync manager
        sync_manager = DataSyncManager()
        
        # Check if lead CSV exists
        print(f"Default leads CSV path: {sync_manager.leads_csv}")
        exists = os.path.exists(sync_manager.leads_csv)
        print(f"CSV exists: {exists}")
        
        # Load existing leads or create test leads
        if exists:
            leads_df = sync_manager.load_leads_from_csv()
            print(f"Loaded {len(leads_df)} leads from CSV")
        else:
            print("Creating test leads...")
            # Create test leads
            test_leads = [
                {
                    "name": f"Test Contractor {int(time.time())}",
                    "service_area": "Toronto",
                    "craft_type": "stonemason",
                    "phone": "416-555-1234",
                    "email": "test1@example.com",
                    "website": "https://example1.com",
                    "address": "123 Test St, Toronto, ON",
                    "notes": "Test notes",
                    "source": "test"
                },
                {
                    "name": f"Test Contractor 2 {int(time.time())}",
                    "service_area": "Vancouver",
                    "craft_type": "mason",
                    "phone": "604-555-5678",
                    "email": "test2@example.com",
                    "website": "https://example2.com",
                    "address": "456 Test Ave, Vancouver, BC",
                    "notes": "Test notes 2",
                    "source": "test"
                }
            ]
            leads_df = pd.DataFrame(test_leads)
            success = sync_manager.save_leads_to_csv(leads_df)
            print(f"Saved test leads: {success}")
        
        # Test backup
        backup_success = sync_manager.backup_leads(leads_df)
        print(f"Backup created: {backup_success}")
        
        # List backups
        backups = sync_manager.get_backup_files()
        print(f"Found {len(backups)} backup files")
        
        return backup_success and (exists or success)
    
    except Exception as e:
        print(f"Error testing data sync: {e}")
        return False

def main():
    """Main test function"""
    print("===== Lead Engine Component Tests =====")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Working directory: {os.getcwd()}")
    
    if not all_components_imported:
        print("❌ Failed to import all components")
        return
    
    # Run all tests
    osm_success = test_osm_scraper()
    rag_success = test_rag_module()
    sync_success = test_data_sync()
    
    # Print summary
    print("\n===== Test Results =====")
    print(f"OSM Scraper: {'✅ PASSED' if osm_success else '❌ FAILED'}")
    print(f"RAG Module: {'✅ PASSED' if rag_success else '❌ FAILED'}")
    print(f"Data Sync: {'✅ PASSED' if sync_success else '❌ FAILED'}")
    print(f"Overall: {'✅ PASSED' if (osm_success and rag_success and sync_success) else '❌ FAILED'}")

if __name__ == "__main__":
    main()