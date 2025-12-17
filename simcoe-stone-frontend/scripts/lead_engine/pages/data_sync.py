"""
Data Synchronization Dashboard Page

This module provides the Streamlit interface for:
1. Importing/exporting lead data from CSV files
2. Synchronizing with remote Supabase database 
3. Managing data backups and restores
4. Visualizing sync history and data changes
"""

import os
import io
import time
import pandas as pd
import streamlit as st
from datetime import datetime
from typing import Dict, List, Any, Tuple, Optional

# Import the data sync manager
from modules.data.sync import DataSyncManager

def render_data_sync_page():
    """Render the data synchronization page in the Streamlit dashboard"""
    st.title("Data Synchronization")
    
    # Initialize data sync manager
    sync_manager = DataSyncManager()
    
    # Create tabs for different sync operations
    tab1, tab2, tab3, tab4 = st.tabs([
        "Import/Export CSV", 
        "Supabase Sync", 
        "Backups & Restore",
        "Sync History"
    ])
    
    # Tab 1: Import/Export CSV
    with tab1:
        render_csv_import_export(sync_manager)
    
    # Tab 2: Supabase Sync
    with tab2:
        render_supabase_sync(sync_manager)
    
    # Tab 3: Backups & Restore
    with tab3:
        render_backups_restore(sync_manager)
    
    # Tab 4: Sync History
    with tab4:
        render_sync_history(sync_manager)

def render_csv_import_export(sync_manager: DataSyncManager):
    """Render CSV import/export interface
    
    Args:
        sync_manager: DataSyncManager instance
    """
    st.header("Import/Export CSV Data")
    
    # Load current leads data
    current_leads = sync_manager.load_leads_from_csv()
    
    col1, col2 = st.columns(2)
    
    # Import CSV section
    with col1:
        st.subheader("Import CSV File")
        
        # File uploader
        uploaded_file = st.file_uploader(
            "Upload leads CSV file", 
            type=["csv"],
            help="Upload a CSV file with lead records. The file should have the following columns: name, service_area, craft_type, phone, email, website, address, notes, source"
        )
        
        # When file is uploaded, process it
        if uploaded_file is not None:
            # Process the file
            with st.spinner("Processing uploaded file..."):
                # Load file into memory
                file_data = uploaded_file.read()
                
                # Create temporary file
                temp_file_path = os.path.join(
                    os.path.dirname(sync_manager.leads_csv),
                    f"temp_import_{int(time.time())}.csv"
                )
                
                with open(temp_file_path, 'wb') as f:
                    f.write(file_data)
                
                # Import data
                merged_leads, stats = sync_manager.import_leads_from_csv(
                    temp_file_path, 
                    existing_leads=current_leads
                )
                
                # Display stats
                st.success("File processed successfully!")
                st.write("Import Statistics:")
                
                stat_cols = st.columns(5)
                stat_cols[0].metric("Total Records", stats["total"])
                stat_cols[1].metric("New Records", stats["new"])
                stat_cols[2].metric("Updated", stats["updated"])
                stat_cols[3].metric("Unchanged", stats["unchanged"])
                stat_cols[4].metric("Errors", stats["errors"])
                
                # Show data preview
                st.subheader("Preview")
                st.dataframe(merged_leads.head(10), use_container_width=True)
                
                # Save button
                if st.button("Save Changes"):
                    if sync_manager.save_leads_to_csv(merged_leads):
                        st.success("Changes saved successfully!")
                    else:
                        st.error("Failed to save changes.")
                
                # Clean up temp file
                try:
                    os.remove(temp_file_path)
                except:
                    pass
    
    # Export CSV section
    with col2:
        st.subheader("Export CSV File")
        
        # Display current data stats
        st.write(f"Current data: {len(current_leads)} records")
        
        # Filter options
        st.write("Export Filters (Optional)")
        
        # Service area filter
        service_areas = ["All"] + sorted(current_leads["service_area"].unique().tolist())
        selected_area = st.selectbox("Service Area", service_areas)
        
        # Craft type filter
        craft_types = ["All"] + sorted(current_leads["craft_type"].unique().tolist())
        selected_craft = st.selectbox("Craft Type", craft_types)
        
        # Apply filters
        filtered_leads = current_leads.copy()
        
        if selected_area != "All":
            filtered_leads = filtered_leads[filtered_leads["service_area"] == selected_area]
        
        if selected_craft != "All":
            filtered_leads = filtered_leads[filtered_leads["craft_type"] == selected_craft]
        
        # Display filtered count
        st.write(f"Filtered data: {len(filtered_leads)} records")
        
        # Export button
        if st.button("Export to CSV"):
            # Convert DataFrame to CSV
            csv_data = filtered_leads.to_csv(index=False)
            
            # Create download button
            st.download_button(
                label="Download CSV",
                data=csv_data,
                file_name=f"leads_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                mime="text/csv"
            )

def render_supabase_sync(sync_manager: DataSyncManager):
    """Render Supabase synchronization interface
    
    Args:
        sync_manager: DataSyncManager instance
    """
    st.header("Supabase Synchronization")
    
    # Check if Supabase is available
    if not sync_manager.supabase_available:
        st.warning(
            "Supabase integration is not available. Please install the required packages:\n\n"
            "```\nuv pip install supabase\n```"
        )
        
        # Configuration section for Supabase credentials
        st.subheader("Supabase Configuration")
        
        # If we have credentials in session state, display them
        supabase_url = st.text_input(
            "Supabase URL", 
            value=st.session_state.get("supabase_url", ""),
            type="password"
        )
        
        supabase_key = st.text_input(
            "Supabase API Key", 
            value=st.session_state.get("supabase_key", ""),
            type="password"
        )
        
        # Save credentials to session state
        if st.button("Save Credentials"):
            st.session_state["supabase_url"] = supabase_url
            st.session_state["supabase_key"] = supabase_key
            st.success("Credentials saved to session state")
            st.info("Please reload the page to apply changes")
        
        return
    
    # Load current leads data
    current_leads = sync_manager.load_leads_from_csv()
    
    # Display current data stats
    st.write(f"Local data: {len(current_leads)} records")
    
    # Sync options
    st.subheader("Synchronization Options")
    
    sync_direction = st.radio(
        "Sync Direction",
        ["Two-way sync", "Upload only", "Download only"],
        horizontal=True
    )
    
    # Conflict resolution
    conflict_resolution = st.radio(
        "Conflict Resolution",
        ["Remote wins", "Local wins", "Newest wins"],
        horizontal=True
    )
    
    # Start sync button
    if st.button("Start Synchronization"):
        with st.spinner("Synchronizing with Supabase..."):
            # Perform sync
            synced_leads, stats = sync_manager.sync_with_supabase(current_leads)
            
            # Display stats
            st.success("Synchronization completed!")
            st.write("Sync Statistics:")
            
            stat_cols = st.columns(4)
            stat_cols[0].metric("Uploaded", stats["uploaded"])
            stat_cols[1].metric("Downloaded", stats["downloaded"])
            stat_cols[2].metric("Conflicts", stats["conflicts"])
            stat_cols[3].metric("Errors", stats["errors"])
            
            # Show data preview
            st.subheader("Updated Data Preview")
            st.dataframe(synced_leads.head(10), use_container_width=True)
            
            # Save button
            if st.button("Save Changes to Local"):
                if sync_manager.save_leads_to_csv(synced_leads):
                    st.success("Changes saved to local CSV!")
                else:
                    st.error("Failed to save changes.")

def render_backups_restore(sync_manager: DataSyncManager):
    """Render backups and restore interface
    
    Args:
        sync_manager: DataSyncManager instance
    """
    st.header("Backups & Restore")
    
    # Load current leads data
    current_leads = sync_manager.load_leads_from_csv()
    
    col1, col2 = st.columns(2)
    
    # Create backup section
    with col1:
        st.subheader("Create Backup")
        st.write(f"Current data: {len(current_leads)} records")
        
        # Backup options
        backup_name = st.text_input(
            "Backup Name (Optional)",
            value=f"backup_{datetime.now().strftime('%Y%m%d')}"
        )
        
        # Create backup button
        if st.button("Create Backup"):
            with st.spinner("Creating backup..."):
                if sync_manager.backup_leads(current_leads):
                    st.success("Backup created successfully!")
                else:
                    st.error("Failed to create backup.")
    
    # Restore section
    with col2:
        st.subheader("Restore from Backup")
        
        # Get available backups
        backup_files = sync_manager.get_backup_files()
        
        if not backup_files:
            st.info("No backup files found.")
        else:
            # Get filenames only
            backup_names = [os.path.basename(f) for f in backup_files]
            
            # Select backup to restore
            selected_backup_idx = st.selectbox(
                "Select Backup to Restore",
                range(len(backup_names)),
                format_func=lambda i: backup_names[i]
            )
            
            # Show backup info
            selected_backup = backup_files[selected_backup_idx]
            backup_time = datetime.fromtimestamp(os.path.getmtime(selected_backup))
            st.write(f"Backup Date: {backup_time.strftime('%Y-%m-%d %H:%M:%S')}")
            
            # Preview button
            if st.button("Preview Backup"):
                with st.spinner("Loading backup..."):
                    backup_data = sync_manager.restore_from_backup(selected_backup)
                    st.write(f"Backup contains {len(backup_data)} records")
                    st.dataframe(backup_data.head(10), use_container_width=True)
            
            # Restore button
            if st.button("Restore from Backup"):
                with st.spinner("Restoring from backup..."):
                    restored_data = sync_manager.restore_from_backup(selected_backup)
                    
                    if not restored_data.empty:
                        # Save restored data
                        if sync_manager.save_leads_to_csv(restored_data):
                            st.success("Data restored successfully!")
                        else:
                            st.error("Failed to restore data.")
                    else:
                        st.error("Failed to restore data from backup.")

def render_sync_history(sync_manager: DataSyncManager):
    """Render synchronization history interface
    
    Args:
        sync_manager: DataSyncManager instance
    """
    st.header("Synchronization History")
    
    # Get sync history
    sync_history = sync_manager.get_sync_history()
    
    if not sync_history:
        st.info("No synchronization history found.")
        return
    
    # Display history
    for i, entry in enumerate(reversed(sync_history)):
        # Extract timestamp and stats
        timestamp = entry.get("timestamp", "Unknown")
        stats = entry.get("stats", {})
        
        # Convert timestamp to datetime
        try:
            dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
            timestamp_str = dt.strftime("%Y-%m-%d %H:%M:%S")
        except:
            timestamp_str = timestamp
        
        # Create expandable section for each entry
        with st.expander(f"Sync #{len(sync_history)-i}: {timestamp_str}"):
            # Display stats
            stat_cols = st.columns(4)
            
            # Uploaded/Downloaded stats (for Supabase sync)
            if "uploaded" in stats:
                stat_cols[0].metric("Uploaded", stats.get("uploaded", 0))
                stat_cols[1].metric("Downloaded", stats.get("downloaded", 0))
                stat_cols[2].metric("Conflicts", stats.get("conflicts", 0))
                stat_cols[3].metric("Errors", stats.get("errors", 0))
            
            # Import stats (for CSV import)
            elif "new" in stats:
                stat_cols[0].metric("Total", stats.get("total", 0))
                stat_cols[1].metric("New", stats.get("new", 0))
                stat_cols[2].metric("Updated", stats.get("updated", 0))
                stat_cols[3].metric("Errors", stats.get("errors", 0))

if __name__ == "__main__":
    # For testing the module directly
    import streamlit as st
    
    st.set_page_config(
        page_title="Data Sync - Lead Engine Dashboard",
        page_icon="🔄",
        layout="wide"
    )
    
    render_data_sync_page()