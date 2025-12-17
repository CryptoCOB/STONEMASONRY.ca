"""
Streamlit Dashboard for Lead Engine

This dashboard provides a user-friendly interface for:
- Viewing metrics and recent leads
- Running engines (scrape, enrich, RAG, sync)
- Checking environment status
"""

import streamlit as st
from ui.streamlit_components import setup_page_config, add_custom_css

# Import page renderers
from pages.dashboard import render_dashboard_page
from pages.lead_search import render_lead_search_page
from pages.lead_generation import render_lead_generation_page
from pages.data_sync import render_data_sync_page
from pages.rag_search import render_rag_search_page
from pages.settings import render_settings_page


def main():
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
        pages[selection]()
    except Exception as e:
        import traceback
        st.error(f"Error rendering page '{selection}': {e}")
        st.code(traceback.format_exc())
    st.sidebar.markdown("---")
    st.sidebar.markdown("© 2025 Simcoe Stone")


if __name__ == "__main__":
    main()
