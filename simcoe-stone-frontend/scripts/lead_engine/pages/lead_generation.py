"""
Lead Generation Page

Run scrapers to collect leads and save to CSV, with optional RAG update.
"""

import os
import sys
import streamlit as st
from typing import List

current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from ui.streamlit_components import render_page_header, render_card
from generate_leads import generate_leads, DEFAULT_CITIES
from modules.data.sync import DataSyncManager


def render_lead_generation_page():
    render_page_header("Lead Generation", "Scrape OSM and update leads", "🧭")

    sync = DataSyncManager()
    leads = sync.load_leads_from_csv()
    st.caption(f"Current leads in CSV: {len(leads)}")

    st.subheader("Run Scraper")
    cities = st.multiselect("Cities to scrape", DEFAULT_CITIES, default=["Toronto", "Mississauga", "Brampton"])
    update_rag = st.checkbox("Update RAG database", value=False)

    if st.button("Start Lead Generation", type="primary"):
        with st.spinner("Scraping and saving leads... this may take a while"):
            stats = generate_leads(cities=cities or None, save_to_csv=True, update_rag=update_rag)
        st.success("Lead generation completed")
        st.json(stats)

    st.subheader("Quick Actions")
    col1, col2 = st.columns(2)
    with col1:
        if st.button("Scrape Toronto Only"):
            with st.spinner("Scraping Toronto..."):
                stats = generate_leads(cities=["Toronto"], save_to_csv=True, update_rag=update_rag)
            st.success("Done")
            st.json(stats)

# Render function is invoked by the main app controller
    with col2:
        if st.button("Scrape GTA (Fast)"):
            gta = ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville", "Burlington"]
            with st.spinner("Scraping GTA..."):
                stats = generate_leads(cities=gta, save_to_csv=True, update_rag=update_rag)
            st.success("Done")
            st.json(stats)
