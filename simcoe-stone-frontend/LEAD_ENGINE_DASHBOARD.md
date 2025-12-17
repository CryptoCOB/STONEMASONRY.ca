# Simcoe Stone Lead Engine Dashboard

A powerful dashboard for tracking and analyzing leads from the Simcoe Stone website.

## Features

- **Real-time Lead Tracking**: Monitor incoming leads as they arrive
- **Lead Analytics**: Analyze lead quality, conversion rates, and trends
- **Form Performance**: Compare performance across different lead capture forms
- **Data Import/Export**: Import external lead data or export analysis for reports

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Virtual environment (recommended)

### Quick Start

1. **Run the dashboard launcher:**

   ```
   .\start-dashboard.bat
   ```

   This script will:
   - Check if a virtual environment exists and create one if needed
   - Install all required dependencies
   - Launch the dashboard in your browser

2. **Access the dashboard:**

   Once running, the dashboard will be available at:
   - http://localhost:8501

## Manual Setup

If you prefer to set up manually:

1. **Create a virtual environment:**

   ```
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

2. **Install dependencies:**

   ```
   python scripts\lead_engine\setup.py
   ```

3. **Run the dashboard:**

   ```
   streamlit run main.py
   ```

## Dashboard Pages

- **Dashboard**: Overview of key metrics and recent leads
- **Lead Analytics**: Detailed analysis of lead quality and status
- **Form Performance**: Performance metrics for each form type
- **Settings**: Dashboard configuration options

## Data Structure

The dashboard currently uses sample data for demonstration. To connect to real data sources:

1. Modify the `load_sample_data()` function in `main.py`
2. Connect to your database or data source
3. Map the data to match the expected format

## Troubleshooting

- **Missing dependencies**: Run `python scripts\lead_engine\setup.py` to install all required packages
- **Port already in use**: Edit the port in the startup command: `streamlit run main.py --server.port=8502`

## License

© 2023 Simcoe Stone. All rights reserved.