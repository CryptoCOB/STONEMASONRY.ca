# Simcoe Stone Lead Engine Module Instructions

## Overview
This module provides a robust, automated lead-generation dashboard for Simcoe Stone, featuring:
- Streamlit multi-page dashboard
- OSM scraping (Nominatim + Overpass)
- Census-driven city prioritization
- Deduplication and large-corp exclusion
- CSV import/export and backup
- RAG (ChromaDB) vectorstore integration
- LLM enrichment (OpenAI/Ollama/heuristic)
- Supabase sync (optional)
- 6-hour auto-runner and PowerShell scheduler

## Directory Structure
```
scripts/lead_engine/
    app.py                # Main Streamlit multipage controller
    run.py                # Dashboard runner (calls app.py)
    dashboard.py          # Legacy dashboard (not used)
    generate_leads.py     # Lead generation script
    run_auto_census.py    # Auto-scraper for N hours
    modules/
        data/
            sync.py       # DataSyncManager: CSV, dedup, backup
            rag.py        # RAGEngine: ChromaDB vectorstore
            lead_records.csv # Main leads CSV
        scraping/
            auto_scraper.py # Auto-scraper logic
    scraping/
        osm.py            # OSM/Nominatim/Overpass scraping
        __init__.py       # (empty)
    pages/
        dashboard.py      # Dashboard page renderer
        lead_generation.py# Lead Generation page
        rag_search.py     # RAG Search page
        ...               # Other pages
    ui/
        streamlit_components.py # UI helpers
    data/
        config.json       # Config for enrichment, etc.
        backups/          # CSV backups
```

## Key Features & Usage

### 1. Streamlit Dashboard
- Entry: `app.py` (run with Streamlit)
- Sidebar navigation for all pages
- Pages: Dashboard, Lead Search, Lead Generation, Data Sync, RAG Search, Settings

### 2. Lead Generation
- Scrapes contractors from OSM for selected cities
- Deduplicates by name/service_area
- Excludes large corporations (see `is_large_corp` in config)
- Enriches leads via LLM (OpenAI/Ollama/heuristic)
- Saves to CSV and backs up
- Updates RAG vectorstore

### 3. RAG Search
- Uses ChromaDB for semantic search over contractors, municipalities, census
- Query via dashboard page
- Returns top-K results with metadata

### 4. Automation
- `run_auto_census.py` runs auto-scraper for N hours
- PowerShell scheduler can be set for background runs
- Only appends new leads; never overwrites CSV

### 5. Data Management
- DataSyncManager (`modules/data/sync.py`) handles CSV load/save, dedup, backup
- CSV import/export via dashboard
- Backups created automatically

### 6. Supabase Sync
- Attempts to sync leads to Supabase
- If schema mismatch (missing columns), local CSV is unaffected

## Setup & Run
1. Create and activate venv:
   ```powershell
   uv venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```powershell
   uv pip install streamlit pandas plotly chromadb supabase openai
   ```
3. Run dashboard:
   ```powershell
   streamlit run scripts/lead_engine/app.py --server.port 8503
   ```
   - If port is busy, try 8504 or stop other Streamlit processes:
     ```powershell
     Get-Process -Name streamlit -ErrorAction SilentlyContinue | Stop-Process -Force
     streamlit run scripts/lead_engine/app.py --server.port 8504
     ```

## Troubleshooting
- If you see "Multiple Pages specified with URL pathname dashboard":
  - Ensure only `app.py` is used as the main entry, not `dashboard.py`.
- If you see ImportError ("attempted relative import beyond top-level package"):
  - Use absolute imports (e.g., `from modules.utils.config import ...`).
- If Supabase insert fails:
  - Add missing columns to Supabase or ignore; local CSV is always correct.
- If blank pages:
  - Ensure page renderers are called by the main app controller.

## Customization
- To add more cities, update `DEFAULT_CITIES` in `generate_leads.py`.
- To change enrichment provider, update `config.json`.
- To adjust deduplication, modify `DataSyncManager` logic.
- To add new dashboard pages, create a new file in `pages/` and add to `app.py`.

## Contact & Support
For further help, see the code comments or ask for a specific module deep-dive.
