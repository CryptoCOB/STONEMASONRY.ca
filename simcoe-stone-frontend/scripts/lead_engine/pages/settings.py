"""
Settings Page

Configure basic paths and credentials.
"""

import os
import json
import streamlit as st

from ui.streamlit_components import render_page_header, render_card
from modules.scraping.auto_scraper import start_automated_scraping, stop_automated_scraping
from modules.utils.config import scraping_stats

CONFIG_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "config.json")


def _load_config():
    try:
        if os.path.exists(CONFIG_PATH):
            with open(CONFIG_PATH, "r") as f:
                return json.load(f)
    except Exception:
        pass
    return {}


def _save_config(cfg: dict):
    try:
        os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
        with open(CONFIG_PATH, "w") as f:
            json.dump(cfg, f, indent=2)
        return True
    except Exception:
        return False


def render_settings_page():
    render_page_header("Settings", "Manage environment and credentials", "⚙️")

    cfg = _load_config()

    st.subheader("Enrichment Provider")
    provider = st.selectbox("Provider", ["heuristic", "ollama", "openai"], index=["heuristic","ollama","openai"].index(cfg.get("enrichment_provider","heuristic")))
    if provider == "ollama":
        ollama_model = st.text_input("Ollama Model", value=cfg.get("ollama_model", "llama3.1"))
        ollama_host = st.text_input("Ollama Host", value=cfg.get("ollama_host", "http://localhost:11434"))
    elif provider == "openai":
        st.info("OpenAI uses environment variable OPENAI_API_KEY; optional model override below")
        openai_model = st.text_input("OpenAI Model", value=cfg.get("openai_model", "gpt-4o-mini"))

    st.subheader("Supabase Credentials")
    supabase_url = st.text_input("Supabase URL", value=cfg.get("supabase_url", ""))
    supabase_key = st.text_input("Supabase API Key", value=cfg.get("supabase_key", ""), type="password")

    st.subheader("Paths")
    leads_csv = st.text_input("Leads CSV Path", value=cfg.get("leads_csv", ""))

    if st.button("Save Settings", type="primary"):
        cfg_update = {
            "enrichment_provider": provider,
            "supabase_url": supabase_url,
            "supabase_key": supabase_key,
            "leads_csv": leads_csv,
        }
        if provider == "ollama":
            cfg_update.update({"ollama_model": ollama_model, "ollama_host": ollama_host})
        if provider == "openai":
            cfg_update.update({"openai_model": openai_model})
        if _save_config(cfg_update):
            st.success("Settings saved")
        else:
            st.error("Failed to save settings")

    st.subheader("Auto Scraper (Census-Prioritized)")
    col1, col2, col3 = st.columns(3)
    with col1:
        if st.button("Start Auto Scrape"):
            msg = start_automated_scraping()
            st.success(msg)
    with col2:
        if st.button("Stop Auto Scrape"):
            msg = stop_automated_scraping()
            st.info(msg)
    with col3:
        st.metric("Running", "Yes" if scraping_stats.get("running") else "No")
    st.caption(f"Last run: {scraping_stats.get('last_run') or '—'} | Cities processed: {scraping_stats.get('cities_processed')} | Total scraped: {scraping_stats.get('total_scraped')}")
