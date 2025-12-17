"""
Lead Search Page

This module provides the interface for searching, filtering, and viewing leads.
"""

import streamlit as st
import pandas as pd
import os
import sys
from typing import Dict, List, Any

# Add the current directory to the path
current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Import data sync module for loading leads
from modules.data.sync import DataSyncManager

def render_lead_search_page():
    """Render the lead search page"""
    st.header("Lead Search")
    st.write("Search and filter leads in the database.")
    
    # Initialize data sync manager
    sync_manager = DataSyncManager()
    
    # Load current leads data
    leads_df = sync_manager.load_leads_from_csv()
    
    if leads_df.empty:
        st.warning("No leads found in the database.")
        st.info("Generate leads first using the Lead Generation feature.")
        return
    
    # Display total count
    st.write(f"Found {len(leads_df)} leads in the database.")
    
    # Two column layout
    col1, col2 = st.columns([1, 3])
    
    # Filters in left column
    with col1:
        st.subheader("Filters")
        
        # Service area filter
        service_areas = ["All"] + sorted(leads_df["service_area"].unique().tolist())
        selected_area = st.selectbox("Service Area", service_areas)
        
        # Craft type filter
        craft_types = ["All"] + sorted(leads_df["craft_type"].unique().tolist())
        selected_craft = st.selectbox("Craft Type", craft_types)
        
        # Score filter (if available)
        if "score" in leads_df.columns:
            min_score = int(leads_df["score"].min()) if not leads_df["score"].isna().all() else 0
            max_score = int(leads_df["score"].max()) if not leads_df["score"].isna().all() else 10
            
            score_range = st.slider(
                "Minimum Score", 
                min_value=min_score,
                max_value=max_score,
                value=min_score
            )
        else:
            score_range = None
        
        # Source filter
        if "source" in leads_df.columns:
            sources = ["All"] + sorted(leads_df["source"].unique().tolist())
            selected_source = st.selectbox("Source", sources)
        else:
            selected_source = "All"
        
        # Text search
        search_text = st.text_input("Search", placeholder="Enter name, email, etc.")
        
        # Apply filters button
        st.button("Apply Filters", type="primary")
    
    # Results in right column
    with col2:
        st.subheader("Results")
        
        # Apply filters to the dataframe
        filtered_df = leads_df.copy()
        
        if selected_area != "All":
            filtered_df = filtered_df[filtered_df["service_area"] == selected_area]
        
        if selected_craft != "All":
            filtered_df = filtered_df[filtered_df["craft_type"] == selected_craft]
        
        if score_range is not None and "score" in filtered_df.columns:
            filtered_df = filtered_df[filtered_df["score"] >= score_range]
        
        if selected_source != "All" and "source" in filtered_df.columns:
            filtered_df = filtered_df[filtered_df["source"] == selected_source]
        
        if search_text:
            # Search across all string columns
            search_mask = pd.Series(False, index=filtered_df.index)
            
            for col in filtered_df.columns:
                if filtered_df[col].dtype == 'object':
                    search_mask = search_mask | filtered_df[col].astype(str).str.contains(search_text, case=False, na=False)
            
            filtered_df = filtered_df[search_mask]
        
        # Display filtered results
        st.write(f"Showing {len(filtered_df)} leads")
        
        # Select columns to display
        display_cols = [
            "name", "service_area", "craft_type", "phone", 
            "email", "website", "address"
        ]
        
        if "score" in filtered_df.columns:
            display_cols.append("score")
        
        # Display results
        st.dataframe(
            filtered_df[display_cols], 
            width='stretch',
            column_config={
                "name": "Name",
                "service_area": "Service Area",
                "craft_type": "Craft Type",
                "phone": "Phone",
                "email": "Email",
                "website": st.column_config.LinkColumn("Website"),
                "address": "Address",
                "score": "Score"
            }
        )
        
        # Export filtered results
        if not filtered_df.empty:
            # Convert DataFrame to CSV
            csv_data = filtered_df.to_csv(index=False)
            
            st.download_button(
                label="Export Results to CSV",
                data=csv_data,
                file_name=f"lead_search_results.csv",
                mime="text/csv"
            )
    
    # Lead details section
    st.subheader("Lead Details")
    # Defensive session state for widget
    if not filtered_df.empty:
        lead_names = filtered_df["name"].tolist()
        if "selected_lead" not in st.session_state:
            st.session_state["selected_lead"] = lead_names[0] if lead_names else None
        selected_lead = st.selectbox("Select a lead for details", lead_names, key="selected_lead")
        if selected_lead:
            lead_data = filtered_df[filtered_df["name"] == selected_lead].iloc[0]
            st.markdown(f"""
            ### {lead_data['name']}
            **Service Area:** {lead_data['service_area']}  
            **Craft Type:** {lead_data['craft_type']}  
            **Phone:** {lead_data['phone']}  
            **Email:** {lead_data['email']}  
            **Website:** {lead_data['website']}  
            **Address:** {lead_data['address']}  
            """)
            if "notes" in lead_data and lead_data["notes"]:
                st.markdown(f"**Notes:** {lead_data['notes']}")
            if "score" in lead_data:
                st.markdown(f"**Score:** {lead_data['score']}")
            col1, col2, col3 = st.columns(3)
            with col1:
                if lead_data["phone"]:
                    st.button(f"📞 Call {lead_data['phone']}")
                else:
                    st.button("📞 Call", disabled=True)
            with col2:
                if lead_data["email"]:
                    st.button(f"✉️ Email {lead_data['email']}")
                else:
                    st.button("✉️ Email", disabled=True)
            with col3:
                if lead_data["website"]:
                    st.button("🌐 Visit Website")
                else:
                    st.button("🌐 Visit Website", disabled=True)
    else:
        st.info("No leads found matching the filters.")

if __name__ == "__main__":
    # For testing the module directly
    import streamlit as st
    
    st.set_page_config(
        page_title="Lead Search - Lead Engine Dashboard",
        page_icon="🔍",
        layout="wide"
    )
    
    render_lead_search_page()