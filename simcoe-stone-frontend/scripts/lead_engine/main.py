#!/usr/bin/env python3
"""
Contractor Lead Engine - Main Entry Point
=========================================

A modular lead generation and enrichment system for contractor acquisition.

Features:
- Automated scraping of contractors using OpenStreetMap
- RAG (Retrieval Augmented Generation) with Chroma vector database
- LLM enrichment using Ollama
- Supabase integration for lead storage
- Interactive Dash dashboard with search, filtering, and visualization
"""

import sys
import os

# Add the parent directory to path for easier imports
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Import the modular app
from modules.ui.app import run_server
from modules.data.census import load_census_data

if __name__ == "__main__":
    # Load data
    load_census_data()
    
    # Start the Dash app
    print("🚀 Starting Contractor Lead Engine...")
    print("📊 Dashboard will be available at: http://127.0.0.1:8050/")
    run_server(debug=False, host="127.0.0.1", port=8050)