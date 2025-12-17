"""
Data Synchronization Module

This module handles synchronization between:
1. Local CSV files and in-memory database
2. Local data and Supabase remote database
3. Import/export of lead records with validation
"""

import os
import csv
import json
import logging
import pandas as pd
from datetime import datetime
from typing import Dict, List, Any, Tuple, Optional, Set

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("DataSync")

# Define default paths
DEFAULT_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
DEFAULT_LEADS_CSV = os.path.join(DEFAULT_DATA_DIR, "lead_records.csv")
DEFAULT_SYNC_LOG = os.path.join(DEFAULT_DATA_DIR, "sync_log.json")

# Supabase integration (conditional import)
try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    logger.warning("Supabase client not available. Remote sync disabled.")
    SUPABASE_AVAILABLE = False

class DataSyncManager:
    """Manages data synchronization between local and remote storage"""
    
    def __init__(
        self,
        data_dir: Optional[str] = None,
        leads_csv: Optional[str] = None,
        supabase_url: Optional[str] = None,
        supabase_key: Optional[str] = None
    ):
        """Initialize the DataSyncManager
        
        Args:
            data_dir: Directory for data files
            leads_csv: Path to leads CSV file
            supabase_url: Supabase URL for remote sync
            supabase_key: Supabase API key for remote sync
        """
        # Set up paths
        self.data_dir = data_dir or DEFAULT_DATA_DIR
        self.leads_csv = leads_csv or DEFAULT_LEADS_CSV
        self.sync_log_path = os.path.join(self.data_dir, "sync_log.json")
        
        # Create data directory if it doesn't exist
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize sync log if it doesn't exist
        if not os.path.exists(self.sync_log_path):
            self._create_empty_sync_log()
        
        # Set up Supabase client if available
        self.supabase = None
        self.supabase_available = SUPABASE_AVAILABLE
        
        if SUPABASE_AVAILABLE and supabase_url and supabase_key:
            try:
                self.supabase = create_client(supabase_url, supabase_key)
                logger.info("Supabase client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                self.supabase_available = False
    
    def _create_empty_sync_log(self):
        """Create an empty sync log file"""
        initial_log = {
            "last_sync": None,
            "sync_history": []
        }
        
        with open(self.sync_log_path, 'w') as f:
            json.dump(initial_log, f, indent=2)
    
    def load_leads_from_csv(self, csv_path: Optional[str] = None) -> pd.DataFrame:
        """Load leads from CSV file
        
        Args:
            csv_path: Path to CSV file (if None, uses default)
            
        Returns:
            DataFrame with lead records
        """
        path = csv_path or self.leads_csv
        
        try:
            if os.path.exists(path):
                df = pd.read_csv(path)
                logger.info(f"Loaded {len(df)} leads from {path}")
                return df
            else:
                logger.warning(f"CSV file not found at {path}")
                # Return empty DataFrame with expected columns
                return pd.DataFrame(columns=[
                    "name", "service_area", "craft_type", "phone", "email", 
                    "website", "address", "notes", "source"
                ])
        
        except Exception as e:
            logger.error(f"Failed to load leads from CSV: {e}")
            # Return empty DataFrame with expected columns
            return pd.DataFrame(columns=[
                "name", "service_area", "craft_type", "phone", "email", 
                "website", "address", "notes", "source"
            ])
    
    def save_leads_to_csv(self, leads: pd.DataFrame, csv_path: Optional[str] = None) -> bool:
        """Save leads to CSV file
        
        Args:
            leads: DataFrame with lead records
            csv_path: Path to CSV file (if None, uses default)
            
        Returns:
            True if successful, False otherwise
        """
        path = csv_path or self.leads_csv
        
        try:
            # Ensure data directory exists
            os.makedirs(os.path.dirname(path), exist_ok=True)
            
            # Write to CSV
            leads.to_csv(path, index=False)
            logger.info(f"Saved {len(leads)} leads to {path}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to save leads to CSV: {e}")
            return False
    
    def validate_lead_data(self, leads: pd.DataFrame) -> Tuple[pd.DataFrame, List[Dict[str, Any]]]:
        """Validate lead data and return clean dataframe
        
        Args:
            leads: DataFrame with lead records
            
        Returns:
            Tuple of (cleaned DataFrame, list of validation errors)
        """
        errors = []
        
        # Make a copy to avoid modifying the original
        df = leads.copy()
        
        # Check for required columns
        required_columns = ["name", "service_area", "craft_type"]
        for col in required_columns:
            if col not in df.columns:
                errors.append({"error": f"Missing required column: {col}"})
                # Add empty column
                df[col] = ""
        
        # Ensure all expected columns exist (add if missing)
        expected_columns = [
            "name", "service_area", "craft_type", "phone", "email", 
            "website", "address", "notes", "source"
        ]
        
        for col in expected_columns:
            if col not in df.columns:
                df[col] = ""
        
        # Check for duplicate names in same service area
        duplicates = df.duplicated(subset=["name", "service_area"], keep=False)
        if duplicates.any():
            duplicate_records = df[duplicates]
            for _, row in duplicate_records.iterrows():
                errors.append({
                    "error": "Duplicate record",
                    "name": row["name"],
                    "service_area": row["service_area"]
                })
        
        # Validate email format if present
        if "email" in df.columns:
            # Simple regex for email validation
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            
            for i, email in enumerate(df["email"]):
                if email and not pd.isna(email) and not pd.Series(email).str.match(email_pattern).iloc[0]:
                    errors.append({
                        "error": "Invalid email format",
                        "name": df.iloc[i]["name"] if "name" in df.columns else f"Row {i}",
                        "email": email
                    })
        
        # Return cleaned dataframe and errors
        return df, errors
    
    def import_leads_from_csv(
        self, 
        csv_path: str, 
        existing_leads: Optional[pd.DataFrame] = None
    ) -> Tuple[pd.DataFrame, Dict[str, int]]:
        """Import leads from CSV file and merge with existing data
        
        Args:
            csv_path: Path to CSV file to import
            existing_leads: Optional DataFrame with existing leads
            
        Returns:
            Tuple of (merged DataFrame, import stats)
        """
        stats = {
            "total": 0,
            "new": 0,
            "updated": 0,
            "unchanged": 0,
            "errors": 0
        }
        
        try:
            # Load new leads
            new_leads = pd.read_csv(csv_path)
            stats["total"] = len(new_leads)
            
            # Validate new leads
            new_leads, validation_errors = self.validate_lead_data(new_leads)
            stats["errors"] = len(validation_errors)
            
            # If existing leads not provided, load from default location
            if existing_leads is None:
                existing_leads = self.load_leads_from_csv()
            
            # If no existing leads, just return the new ones
            if len(existing_leads) == 0:
                stats["new"] = len(new_leads)
                return new_leads, stats
            
            # Track updated records
            updated_records = []
            new_records = []
            
            # Check each new lead against existing data
            for _, new_row in new_leads.iterrows():
                # Look for matching record (by name and service area)
                match = existing_leads[
                    (existing_leads["name"] == new_row["name"]) & 
                    (existing_leads["service_area"] == new_row["service_area"])
                ]
                
                if len(match) > 0:
                    # Compare to see if there are any differences
                    match_row = match.iloc[0]
                    changes = False
                    
                    for col in new_row.index:
                        # Skip comparing NaN values
                        if pd.isna(new_row[col]) and pd.isna(match_row[col]):
                            continue
                        
                        # Check if values are different
                        if new_row[col] != match_row[col]:
                            changes = True
                            break
                    
                    if changes:
                        # Mark the existing record for update
                        index = match.index[0]
                        existing_leads.loc[index] = new_row
                        updated_records.append(dict(new_row))
                    else:
                        stats["unchanged"] += 1
                else:
                    # Add as new record
                    new_records.append(dict(new_row))
            
            # Append new records to existing leads
            if new_records:
                new_df = pd.DataFrame(new_records)
                existing_leads = pd.concat([existing_leads, new_df], ignore_index=True)
            
            # Update stats
            stats["new"] = len(new_records)
            stats["updated"] = len(updated_records)
            
            return existing_leads, stats
        
        except Exception as e:
            logger.error(f"Failed to import leads from CSV: {e}")
            if existing_leads is not None:
                return existing_leads, stats
            else:
                return pd.DataFrame(columns=[
                    "name", "service_area", "craft_type", "phone", "email", 
                    "website", "address", "notes", "source"
                ]), stats
    
    def export_leads_to_csv(self, leads: pd.DataFrame, csv_path: str) -> bool:
        """Export leads to CSV file
        
        Args:
            leads: DataFrame with lead records
            csv_path: Path to CSV file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Ensure directory exists
            os.makedirs(os.path.dirname(csv_path), exist_ok=True)
            
            # Save to CSV
            leads.to_csv(csv_path, index=False)
            logger.info(f"Exported {len(leads)} leads to {csv_path}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to export leads to CSV: {e}")
            return False
    
    def sync_with_supabase(self, leads: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, int]]:
        """Synchronize leads with Supabase database
        
        Args:
            leads: DataFrame with lead records
            
        Returns:
            Tuple of (synced DataFrame, sync stats)
        """
        stats = {
            "uploaded": 0,
            "downloaded": 0,
            "conflicts": 0,
            "errors": 0
        }
        
        if not self.supabase_available or not self.supabase:
            logger.warning("Supabase not available for sync")
            return leads, stats
        
        try:
            # Get last sync timestamp
            sync_log = self._load_sync_log()
            last_sync = sync_log.get("last_sync")
            
            # Fetch records from Supabase
            response = self.supabase.table("leads").select("*").execute()
            
            if hasattr(response, "data"):
                remote_data = response.data
                remote_df = pd.DataFrame(remote_data)
                
                # Convert to same format as local data
                if "id" in remote_df.columns:
                    remote_df = remote_df.drop(columns=["id"])
                
                # Get records modified since last sync
                if last_sync:
                    # Convert last_sync to datetime
                    last_sync_dt = datetime.fromisoformat(last_sync.replace("Z", "+00:00"))
                    
                    # Filter records modified since last sync
                    if "updated_at" in remote_df.columns:
                        remote_df["updated_at"] = pd.to_datetime(remote_df["updated_at"])
                        new_remote = remote_df[remote_df["updated_at"] > last_sync_dt]
                    else:
                        # If no updated_at column, treat all as new
                        new_remote = remote_df
                else:
                    # If no last sync, treat all as new
                    new_remote = remote_df
                
                # Merge remote data with local data
                if len(new_remote) > 0:
                    # Track changes
                    for _, remote_row in new_remote.iterrows():
                        # Look for matching local record
                        match = leads[
                            (leads["name"] == remote_row["name"]) & 
                            (leads["service_area"] == remote_row["service_area"])
                        ]
                        
                        if len(match) > 0:
                            # Check for conflicts
                            index = match.index[0]
                            
                            # Update local record
                            leads.loc[index] = remote_row
                            stats["downloaded"] += 1
                        else:
                            # Add as new record
                            leads = pd.concat([leads, pd.DataFrame([remote_row])], ignore_index=True)
                            stats["downloaded"] += 1
            
            # Upload local data to Supabase
            # Convert to list of dictionaries for upload
            records_to_upload = leads.to_dict(orient="records")
            
            # Upload in batches
            batch_size = 100
            for i in range(0, len(records_to_upload), batch_size):
                batch = records_to_upload[i:i+batch_size]
                
                try:
                    # Use upsert to handle both inserts and updates
                    response = self.supabase.table("leads").upsert(batch).execute()
                    
                    if hasattr(response, "data"):
                        stats["uploaded"] += len(response.data)
                    else:
                        logger.warning(f"Unexpected response format: {response}")
                
                except Exception as e:
                    logger.error(f"Failed to upload batch to Supabase: {e}")
                    stats["errors"] += 1
            
            # Update sync log
            self._update_sync_log(stats)
            
            return leads, stats
        
        except Exception as e:
            logger.error(f"Failed to sync with Supabase: {e}")
            return leads, stats
    
    def _load_sync_log(self) -> Dict[str, Any]:
        """Load sync log from file
        
        Returns:
            Dictionary with sync log data
        """
        try:
            if os.path.exists(self.sync_log_path):
                with open(self.sync_log_path, 'r') as f:
                    return json.load(f)
            else:
                # Create empty sync log
                self._create_empty_sync_log()
                return {"last_sync": None, "sync_history": []}
        
        except Exception as e:
            logger.error(f"Failed to load sync log: {e}")
            return {"last_sync": None, "sync_history": []}
    
    def _update_sync_log(self, stats: Dict[str, int]):
        """Update sync log with new sync information
        
        Args:
            stats: Dictionary with sync statistics
        """
        try:
            # Load existing log
            sync_log = self._load_sync_log()
            
            # Add new sync entry
            now = datetime.utcnow().isoformat() + "Z"
            sync_entry = {
                "timestamp": now,
                "stats": stats
            }
            
            sync_log["last_sync"] = now
            sync_log["sync_history"].append(sync_entry)
            
            # Limit history to 100 entries
            if len(sync_log["sync_history"]) > 100:
                sync_log["sync_history"] = sync_log["sync_history"][-100:]
            
            # Save to file
            with open(self.sync_log_path, 'w') as f:
                json.dump(sync_log, f, indent=2)
        
        except Exception as e:
            logger.error(f"Failed to update sync log: {e}")
    
    def get_sync_history(self) -> List[Dict[str, Any]]:
        """Get sync history from log
        
        Returns:
            List of sync history entries
        """
        try:
            sync_log = self._load_sync_log()
            return sync_log.get("sync_history", [])
        
        except Exception as e:
            logger.error(f"Failed to get sync history: {e}")
            return []
    
    def backup_leads(self, leads: pd.DataFrame) -> bool:
        """Create a backup of leads data
        
        Args:
            leads: DataFrame with lead records
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Create backup directory if it doesn't exist
            backup_dir = os.path.join(self.data_dir, "backups")
            os.makedirs(backup_dir, exist_ok=True)
            
            # Generate backup filename with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = os.path.join(backup_dir, f"leads_backup_{timestamp}.csv")
            
            # Save backup
            leads.to_csv(backup_path, index=False)
            logger.info(f"Created backup at {backup_path}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to create backup: {e}")
            return False
    
    def get_backup_files(self) -> List[str]:
        """Get list of available backup files
        
        Returns:
            List of backup file paths
        """
        try:
            backup_dir = os.path.join(self.data_dir, "backups")
            
            if not os.path.exists(backup_dir):
                return []
            
            # Get all CSV files in backup directory
            backup_files = [
                os.path.join(backup_dir, f) 
                for f in os.listdir(backup_dir) 
                if f.startswith("leads_backup_") and f.endswith(".csv")
            ]
            
            # Sort by modification time (newest first)
            backup_files.sort(key=lambda x: os.path.getmtime(x), reverse=True)
            
            return backup_files
        
        except Exception as e:
            logger.error(f"Failed to get backup files: {e}")
            return []
    
    def restore_from_backup(self, backup_path: str) -> pd.DataFrame:
        """Restore leads from backup file
        
        Args:
            backup_path: Path to backup file
            
        Returns:
            DataFrame with restored lead records
        """
        try:
            if os.path.exists(backup_path):
                df = pd.read_csv(backup_path)
                logger.info(f"Restored {len(df)} leads from backup {backup_path}")
                return df
            else:
                logger.warning(f"Backup file not found: {backup_path}")
                return pd.DataFrame()
        
        except Exception as e:
            logger.error(f"Failed to restore from backup: {e}")
            return pd.DataFrame()