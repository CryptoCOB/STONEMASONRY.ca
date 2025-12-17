"""
Streamlit Dashboard for Lead Engine

This is the main entry point for the Streamlit dashboard.
It provides a modular interface for:
1. Lead generation and management
2. Data visualization
3. RAG search and analysis
4. Data synchronization
"""

import os
import streamlit as st
import sys
from pathlib import Path

# Add the parent directory to path for easier imports
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Import UI components
from ui.streamlit_components import setup_page_config, add_custom_css

# Import page modules
from pages.dashboard import render_dashboard_page
from pages.lead_search import render_lead_search_page
from pages.lead_generation import render_lead_generation_page
from pages.data_sync import render_data_sync_page
from pages.rag_search import render_rag_search_page
from pages.settings import render_settings_page

def main():
    """Main function for the Streamlit dashboard"""
    setup_page_config()
    add_custom_css()
    st.title("Simcoe Stone Lead Engine")
    st.sidebar.title("Navigation")
    pages = {
        "Dashboard": render_dashboard_page,
        "Lead Search": render_lead_search_page,
        "Lead Generation": render_lead_generation_page,
        "Data Sync": render_data_sync_page,
        "RAG Search": render_rag_search_page,
        "Settings": render_settings_page,
    }
    selection = st.sidebar.radio("Go to", list(pages.keys()))
    try:
        st.info(f"Rendering page: {selection}")
        pages[selection]()
    except Exception as e:
        import traceback
        st.error(f"Error rendering page '{selection}': {e}")
        st.code(traceback.format_exc())
    st.sidebar.markdown("---")
    st.sidebar.markdown("© 2025 Simcoe Stone")

if __name__ == "__main__":
    main()