"""
Test script for the Data Sync module
"""

import os
import sys
import json
import pandas as pd
from modules.data.sync import DataSyncManager

def main():
    """Main test function"""
    print("Testing Data Sync Module...")
    
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
                "name": "Test Contractor 1",
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
                "name": "Test Contractor 2",
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
    
    # Test validation
    clean_df, errors = sync_manager.validate_lead_data(leads_df)
    print(f"Validation errors: {len(errors)}")
    if errors:
        print(f"Errors: {json.dumps(errors, indent=2)}")
    
    # Test backup
    backup_success = sync_manager.backup_leads(leads_df)
    print(f"Backup created: {backup_success}")
    
    # List backups
    backups = sync_manager.get_backup_files()
    print(f"Found {len(backups)} backup files")
    if backups:
        print(f"Latest backup: {os.path.basename(backups[0])}")
    
    # Test sync history
    history = sync_manager.get_sync_history()
    print(f"Sync history entries: {len(history)}")

if __name__ == "__main__":
    main()