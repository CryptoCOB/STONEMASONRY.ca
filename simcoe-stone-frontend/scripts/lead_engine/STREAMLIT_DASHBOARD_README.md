# Simcoe Stone Lead Engine Dashboard (Streamlit Version)

A modern, interactive dashboard for lead management and business discovery using Streamlit.

## Features

- **Interactive Dashboard**: Streamlit-based UI with real-time metrics and visualizations
- **Lead Analytics**: Comprehensive analysis of lead sources, quality, and conversion
- **Form Performance**: Detailed metrics for different lead capture forms
- **Automated Business Discovery**: Find contractors using OpenStreetMap APIs
- **Data Import/Export**: Flexible tools for data management

## Setup & Installation

### Quick Start (Windows)

Run the provided batch file from the project root:
```
start-lead-engine.bat
```

This will:
1. Create a Python virtual environment if needed
2. Install all required dependencies
3. Launch the Streamlit dashboard

### Manual Setup

1. Create and activate a virtual environment:
   ```bash
   # Using uv (recommended)
   uv venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Unix/macOS
   ```

2. Install dependencies:
   ```bash
   cd scripts/lead_engine
   python setup.py
   ```

3. Launch the dashboard:
   ```bash
   python run.py
   ```

## Dashboard Components

### 1. Main Dashboard
- Key performance metrics
- Lead volume trends
- Source distribution
- Service interest breakdown
- Recent leads table

### 2. Lead Analytics
- Lead status visualization
- Conversion potential analysis
- Response time tracking
- Lead quality by source

### 3. Form Performance
- Form-specific metrics
- Conversion rates by form type
- Response time analysis
- Service distribution by form

### 4. Automated Business Discovery
- Scraping configuration
- City targeting
- Multi-source scraping (OpenStreetMap, Google Maps, Yelp)
- Error logging and monitoring

### 5. Settings
- Dashboard preferences
- Data import/export
- System information

## Configuration

The dashboard can be configured through the Settings panel, or by editing the following files:

- `dashboard.py`: Main dashboard configuration
- `setup.py`: Dependency management
- `run.py`: Launch configuration

## Requirements

- Python 3.8+
- Streamlit
- Pandas
- Plotly
- Requests (for API access)
- Additional dependencies are installed automatically

## Troubleshooting

If you encounter issues:

1. Ensure you have Python 3.8+ installed
2. Try deleting the `.venv` directory and running `start-lead-engine.bat` again
3. Check that all required packages are installed with `pip list`
4. Make sure you have internet access for data fetching

## License

© 2023 Simcoe Stone. All rights reserved.