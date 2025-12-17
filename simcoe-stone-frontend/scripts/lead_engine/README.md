# Contractor Lead Engine

A modular lead generation and enrichment system for contractor acquisition.

## Features

- **Automated Scraping**: Discover contractors using OpenStreetMap APIs
- **RAG Integration**: Retrieval Augmented Generation with Chroma vector database
- **LLM Enrichment**: AI-powered lead analysis and enrichment using Ollama
- **Supabase Storage**: Cloud database for lead management and tracking
- **Interactive Dashboard**: Dash-based UI with search, filtering, and visualization

## Modular Structure

The application has been organized into modules for better maintainability:

```
scripts/lead_engine/
├── modules/               # Main modular structure
│   ├── api/               # API integration (LLM, QA)
│   ├── data/              # Data processing (census, database)
│   ├── scraping/          # Scraping utilities (auto_scraper)
│   ├── ui/                # Dashboard UI components
│   │   ├── assets/        # CSS and static files
│   │   ├── app.py         # Main UI application
│   │   ├── callbacks.py   # UI interaction callbacks
│   │   └── layout.py      # Dashboard layout with Bootstrap
│   └── utils/             # Utility functions and configuration
├── main.py                # Main entry point
├── requirements.txt       # Required packages
├── install.bat            # Installation script
└── start-dashboard.bat    # Launch script
```

## Setup & Installation

1. Install required packages:
   ```
   ./install.bat
   ```
   
   Or manually with pip:
   ```
   pip install -r requirements.txt
   ```

2. Make sure Ollama is running locally with the `llama3` model:
   ```
   ollama run llama3
   ```

3. Set up Supabase environment variables in a `.env` file:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

## Usage

Start the dashboard:
```
./start-dashboard.bat
```

Or manually:
```
python main.py
```

The dashboard will be available at: http://127.0.0.1:8050/

## Dashboard Features

1. **Search & Filter**: Find municipalities and contractors with custom filters
2. **RAG Graph**: Visualize connections between provinces, municipalities, and contractors
3. **Census Data**: Explore demographic information to identify high-potential markets
4. **Automated Discovery**: Run background scraping to continuously find new leads
5. **Natural Language QA**: Ask questions about your data using AI

## Button Responsiveness

The modular approach has resolved button responsiveness issues by:

1. Properly separating callback functions in a dedicated module
2. Running automated scraping in background threads
3. Implementing proper state management for button clicks
4. Adding loading indicators for long-running operations
5. Using Bootstrap components for consistent styling and interaction