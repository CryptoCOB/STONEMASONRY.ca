"""
Dashboard Page

Provides overview metrics, recent leads, and simple source breakdown.
"""

import os
import pandas as pd
import streamlit as st
from datetime import datetime

from modules.data.sync import DataSyncManager
from ui.streamlit_components import render_page_header, render_metric_row, render_card


def render_dashboard_page():
    render_page_header("Dashboard", "Overview of leads and activity", "📊")

    sync = DataSyncManager()
    leads = sync.load_leads_from_csv()

    total = len(leads)
    high_priority = int((leads["score"] >= 8).sum()) if "score" in leads.columns else 0
    new_this_week = 0
    if "scraped_at" in leads.columns:
        try:
            leads_dt = pd.to_datetime(leads["scraped_at"], errors="coerce")
            new_this_week = int((datetime.now() - leads_dt).dt.days.le(7).sum())
        except Exception:
            new_this_week = 0

    metrics = {
        "Total Leads": {"value": total},
        "High Priority": {"value": high_priority},
        "New This Week": {"value": new_this_week},
        "Sync Status": {"value": "OK"},
    }
    render_metric_row(metrics, columns=4)

    # Show venv status and allow install
    st.subheader("Environment Status")
    venv_path = os.path.join(os.path.dirname(__file__), "..", ".venv")
    venv_exists = os.path.exists(os.path.join(venv_path, "Scripts", "python.exe"))
    st.write(f"Virtual environment: {'✅ Found' if venv_exists else '❌ Not found'} at {venv_path}")
    if not venv_exists:
        if st.button("Create venv with uv"):
            import subprocess
            subprocess.run(["uv", "venv", ".venv"], cwd=os.path.dirname(__file__), check=False)
            st.success(".venv created. Please restart the app.")
            st.stop()

    # Install all required packages
    if st.button("Install all required packages with uv"):
        import subprocess
        pkgs = ["streamlit", "pandas", "plotly", "chromadb", "supabase", "openai"]
        for pkg in pkgs:
            subprocess.run(["uv", "pip", "install", pkg], cwd=os.path.dirname(__file__), check=False)
        st.success("All packages installed. Please restart the app if needed.")

    # Run all engines
    if st.button("Run All Engines (Scrape, Enrich, RAG, Sync)"):
        import subprocess
        st.info("Running full pipeline. This may take a few minutes...")
        # Scrape and enrich
        result = subprocess.run([
            os.path.join(venv_path, "Scripts", "python.exe"),
            "scripts/lead_engine/generate_leads.py",
            "--cities", "Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville", "Burlington"
        ], capture_output=True, text=True)
        st.code(result.stdout)
        if result.stderr:
            st.error(result.stderr)

    col1, col2 = st.columns(2)
    with col1:
        def _recent():
            if total == 0:
                st.info("No leads yet. Use Lead Generation to add some.")
                return
            display_cols = [c for c in ["name", "service_area", "craft_type", "phone", "email", "website", "score", "scraped_at"] if c in leads.columns]
            df = leads.copy()
            if "scraped_at" in df.columns:
                df["scraped_at"] = pd.to_datetime(df["scraped_at"], errors="coerce")
                df = df.sort_values(by="scraped_at", ascending=False)
            st.dataframe(df[display_cols].head(10), width='stretch')

        render_card("Recent Leads", _recent)

    with col2:
        def _sources():
            if total == 0:
                st.info("No data to show.")
                return
            if "source" not in leads.columns:
                st.info("No source column found.")
                return
            src = leads["source"].fillna("unknown").value_counts().reset_index()
            src.columns = ["source", "count"]
            st.bar_chart(src.set_index("source"))

        render_card("Lead Sources", _sources)
