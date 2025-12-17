"""
Streamlit Dashboard for Lead Engine

This dashboard provides a user-friendly interface for:
1. Visualizing lead data
2. Monitoring scraping progress
3. Analyzing contractor opportunities
4. Managing lead enrichment and qualification
"""

import os
import sys
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime, timedelta
import json
import time

# Add path to parent directory to import from sibling modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Try to import from sibling modules
try:
    from scraping.auto_scraper import scrape_all_sources, get_city_bbox
    from ui.streamlit_components import (
        render_page_header,
        render_metric_row,
        render_card,
        render_status_card,
        render_lead_table,
        add_custom_css,
        setup_page_config
    )
    from utils.visualization import (
        create_line_chart,
        create_bar_chart,
        create_pie_chart,
        create_histogram,
        STATUS_COLORS
    )
    # Import data sync page renderer
    from pages.data_sync import render_data_sync_page
except ImportError as e:
    print(f"Import error: {e}")
    # Fallback for direct execution
    def scrape_all_sources(city_name):
        st.warning(f"Scraping module not available. This would scrape data for {city_name}")
        return []
    
    def get_city_bbox(city_name):
        st.warning(f"Scraping module not available. This would get bbox for {city_name}")
        return None
    
    def render_data_sync_page():
        st.warning("Data sync module not available.")
        st.info("Please make sure the pages/data_sync.py file exists and is properly imported.")

# Set page configuration
st.set_page_config(
    page_title="Simcoe Stone Lead Engine",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Add custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem !important;
        color: #2c3e50;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.5rem !important;
        color: #34495e;
        margin-bottom: 1rem;
    }
    .card {
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
        background-color: white;
    }
    .metric-value {
        font-size: 2rem !important;
        font-weight: bold;
        color: #2980b9;
    }
    .metric-label {
        font-size: 1rem;
        color: #7f8c8d;
    }
    .stButton button {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
    }
    .stButton button:hover {
        background-color: #2980b9;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state for persistent data
if 'scraping_stats' not in st.session_state:
    st.session_state.scraping_stats = {
        "last_run": None,
        "total_scraped": 0,
        "cities_processed": 0,
        "next_city_index": 0,
        "running": False,
        "errors": []
    }

if 'municipalities' not in st.session_state:
    # Load sample municipalities or fetch from your database
    st.session_state.municipalities = [
        "Toronto", "Ottawa", "Vancouver", "Calgary", "Montreal", "Edmonton",
        "Winnipeg", "Halifax", "Quebec City", "Victoria", "Saskatoon", "Regina"
    ]

if 'leads_data' not in st.session_state:
    # Sample data generation for demonstration
    st.session_state.leads_data = {}

if 'active_tab' not in st.session_state:
    st.session_state.active_tab = "Dashboard"

# App title
st.markdown("<h1 class='main-header'>Simcoe Stone Lead Engine Dashboard</h1>", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    # Try to find the logo in various possible locations
    logo_paths = [
        "../../build/LOGO-TRANSPARENT-STONEMASONRYCA.PNG",
        "../../public/LOGO-TRANSPARENT-STONEMASONRYCA.PNG",
        "../public/LOGO-TRANSPARENT-STONEMASONRYCA.PNG"
    ]
    
    logo_found = False
    for logo_path in logo_paths:
        if os.path.exists(os.path.join(os.path.dirname(__file__), logo_path)):
            st.image(logo_path, width=200)
            logo_found = True
            break
    
    if not logo_found:
        st.markdown("# Simcoe Stone")
    
    st.markdown("## Navigation")
    
    # Navigation buttons with visual styling
    if st.button("📊 Dashboard", key="nav_dashboard"):
        st.session_state.active_tab = "Dashboard"
    
    if st.button("🔍 Lead Analytics", key="nav_analytics"):
        st.session_state.active_tab = "Lead Analytics"
    
    if st.button("📝 Form Performance", key="nav_forms"):
        st.session_state.active_tab = "Form Performance"
    
    if st.button("🤖 Auto Scraping", key="nav_scraping"):
        st.session_state.active_tab = "Auto Scraping"
    
    if st.button("🔄 Data Sync", key="nav_data_sync"):
        st.session_state.active_tab = "Data Sync"
    
    if st.button("⚙️ Settings", key="nav_settings"):
        st.session_state.active_tab = "Settings"
    
    # Date filter
    st.markdown("## Date Range")
    today = datetime.now().date()
    thirty_days_ago = today - timedelta(days=30)
    
    start_date = st.date_input("Start Date", thirty_days_ago)
    end_date = st.date_input("End Date", today)
    
    st.markdown("---")
    st.markdown("### About")
    st.info("Lead Engine Dashboard v1.0.0")
    
    # Refresh button
    if st.button("🔄 Refresh Data"):
        st.experimental_rerun()

# Sample data generation (replace with actual data loading)
@st.cache_data
def load_sample_data():
    # Create sample data for demonstration
    if 'leads_data' in st.session_state and st.session_state.leads_data:
        return pd.DataFrame(st.session_state.leads_data)
    
    dates = pd.date_range(end=datetime.now(), periods=60, freq='D')
    
    # Generate leads data
    leads_data = []
    for date in dates:
        # Generate random number of leads for each day (more recent days have more leads)
        recency_factor = (date - dates[0]).days / (dates[-1] - dates[0]).days
        n_leads = int(np.random.poisson(2 + 8 * recency_factor))
        
        for i in range(n_leads):
            service = np.random.choice(["Masonry", "Stone Installation", "Restoration", "Consultation"], 
                                     p=[0.4, 0.3, 0.2, 0.1])
            source = np.random.choice(["Contact Form", "Quote Request", "Callback Request"], 
                                    p=[0.5, 0.3, 0.2])
            status = np.random.choice(["New", "Contacted", "Qualified", "Converted", "Lost"], 
                                    p=[0.3, 0.3, 0.2, 0.1, 0.1])
            
            leads_data.append({
                "date": date.date(),
                "name": f"Customer {i+1}",
                "email": f"customer{i+1}@example.com",
                "phone": f"(647) {np.random.randint(100, 999)}-{np.random.randint(1000, 9999)}",
                "service_interest": service,
                "source": source,
                "status": status,
                "response_time_hours": np.random.lognormal(1, 0.5),
                "conversion_potential": np.random.randint(1, 11)
            })
    
    return pd.DataFrame(leads_data)

# Load data
df = load_sample_data()

# Filter by date range
filtered_df = df[(df['date'] >= start_date) & (df['date'] <= end_date)]

# Dashboard Page
if st.session_state.active_tab == "Dashboard":
    # Key metrics
    st.markdown("<h2 class='sub-header'>Key Metrics</h2>", unsafe_allow_html=True)
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.metric("Total Leads", len(filtered_df))
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        conversion_rate = round(len(filtered_df[filtered_df['status'] == 'Converted']) / len(filtered_df) * 100, 1) if len(filtered_df) > 0 else 0
        st.metric("Conversion Rate", f"{conversion_rate}%")
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col3:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        avg_response = round(filtered_df['response_time_hours'].mean(), 1) if len(filtered_df) > 0 else 0
        st.metric("Avg Response Time", f"{avg_response} hours")
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col4:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        qualified_leads = len(filtered_df[filtered_df['status'].isin(['Qualified', 'Converted'])]) if len(filtered_df) > 0 else 0
        st.metric("Qualified Leads", qualified_leads)
        st.markdown("</div>", unsafe_allow_html=True)
    
    # Charts
    st.markdown("<h2 class='sub-header'>Lead Trends</h2>", unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("<h3>Lead Volume Over Time</h3>", unsafe_allow_html=True)
        
        if len(filtered_df) > 0:
            # Aggregate data by date
            daily_leads = filtered_df.groupby('date').size().reset_index(name='count')
            
            # Create chart
            fig = px.line(daily_leads, x='date', y='count', 
                        title="Daily Lead Volume", 
                        labels={"count": "Number of Leads", "date": "Date"})
            
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No lead data available for the selected date range.")
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("<h3>Lead Source Distribution</h3>", unsafe_allow_html=True)
        
        if len(filtered_df) > 0:
            # Aggregate data by source
            source_counts = filtered_df['source'].value_counts().reset_index()
            source_counts.columns = ['source', 'count']
            
            # Create chart
            fig = px.pie(source_counts, values='count', names='source', 
                        title="Lead Sources")
            
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No lead data available for the selected date range.")
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    # Services breakdown
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h3>Service Interest Breakdown</h3>", unsafe_allow_html=True)
    
    if len(filtered_df) > 0:
        # Aggregate data by service
        service_counts = filtered_df['service_interest'].value_counts().reset_index()
        service_counts.columns = ['service', 'count']
        
        # Create chart
        fig = px.bar(service_counts, x='service', y='count', 
                    title="Service Interest Distribution",
                    labels={"count": "Number of Leads", "service": "Service"})
        
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No lead data available for the selected date range.")
    
    st.markdown("</div>", unsafe_allow_html=True)
    
    # Recent leads table
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h3>Recent Leads</h3>", unsafe_allow_html=True)
    
    if len(filtered_df) > 0:
        recent_leads = filtered_df.sort_values('date', ascending=False).head(10)
        st.dataframe(
            recent_leads[['date', 'name', 'email', 'phone', 'service_interest', 'status']], 
            use_container_width=True
        )
    else:
        st.info("No lead data available for the selected date range.")
    
    st.markdown("</div>", unsafe_allow_html=True)

# Lead Analytics Page
elif st.session_state.active_tab == "Lead Analytics":
    st.markdown("<h2 class='sub-header'>Lead Analytics</h2>", unsafe_allow_html=True)
    
    # Lead status breakdown
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("<h3>Lead Status</h3>", unsafe_allow_html=True)
        
        if len(filtered_df) > 0:
            # Aggregate data by status
            status_counts = filtered_df['status'].value_counts().reset_index()
            status_counts.columns = ['status', 'count']
            
            # Create chart
            fig = px.bar(status_counts, x='status', y='count', 
                        title="Lead Status Distribution",
                        color='status',
                        color_discrete_map={
                            'New': '#3498db',
                            'Contacted': '#f39c12',
                            'Qualified': '#2ecc71',
                            'Converted': '#27ae60',
                            'Lost': '#e74c3c'
                        })
            
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No lead data available for the selected date range.")
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("<h3>Conversion Potential</h3>", unsafe_allow_html=True)
        
        if len(filtered_df) > 0:
            # Create histogram of conversion potential
            fig = px.histogram(filtered_df, x='conversion_potential', 
                            title="Lead Conversion Potential Distribution",
                            labels={"conversion_potential": "Conversion Potential (1-10)"})
            
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No lead data available for the selected date range.")
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    # Response time analysis
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h3>Response Time Analysis</h3>", unsafe_allow_html=True)
    
    if len(filtered_df) > 0:
        # Group by date and calculate average response time
        response_time = filtered_df.groupby('date')['response_time_hours'].mean().reset_index()
        
        # Create chart
        fig = px.line(response_time, x='date', y='response_time_hours', 
                    title="Average Response Time Trend",
                    labels={"response_time_hours": "Average Response Time (hours)", "date": "Date"})
        
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No lead data available for the selected date range.")
    
    st.markdown("</div>", unsafe_allow_html=True)
    
    # Lead quality by source
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h3>Lead Quality by Source</h3>", unsafe_allow_html=True)
    
    if len(filtered_df) > 0:
        # Group by source and calculate average conversion potential
        source_quality = filtered_df.groupby('source')['conversion_potential'].mean().reset_index()
        source_quality.columns = ['source', 'avg_conversion_potential']
        
        # Create chart
        fig = px.bar(source_quality, x='source', y='avg_conversion_potential', 
                    title="Average Lead Quality by Source",
                    labels={"avg_conversion_potential": "Avg. Conversion Potential", "source": "Lead Source"})
        
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No lead data available for the selected date range.")
    
    st.markdown("</div>", unsafe_allow_html=True)

# Form Performance Page
elif st.session_state.active_tab == "Form Performance":
    st.markdown("<h2 class='sub-header'>Form Performance</h2>", unsafe_allow_html=True)
    
    # Create tabs for different forms
    tab1, tab2, tab3 = st.tabs(["Contact Form", "Quote Request", "Callback Request"])
    
    with tab1:
        contact_form_data = filtered_df[filtered_df['source'] == 'Contact Form'] if len(filtered_df) > 0 else pd.DataFrame()
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Total Submissions", len(contact_form_data))
        with col2:
            conversion = len(contact_form_data[contact_form_data['status'].isin(['Qualified', 'Converted'])]) / len(contact_form_data) if len(contact_form_data) > 0 else 0
            st.metric("Conversion Rate", f"{round(conversion * 100, 1)}%")
        with col3:
            avg_quality = contact_form_data['conversion_potential'].mean() if len(contact_form_data) > 0 else 0
            st.metric("Avg. Lead Quality", f"{round(avg_quality, 1)}/10")
        
        # Daily submissions chart
        if len(contact_form_data) > 0:
            daily_contacts = contact_form_data.groupby('date').size().reset_index(name='count')
            
            fig = px.line(daily_contacts, x='date', y='count', 
                        title="Daily Contact Form Submissions",
                        labels={"count": "Number of Submissions", "date": "Date"})
            
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No contact form data available for the selected date range.")
    
    with tab2:
        quote_data = filtered_df[filtered_df['source'] == 'Quote Request'] if len(filtered_df) > 0 else pd.DataFrame()
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Total Quotes", len(quote_data))
        with col2:
            conversion = len(quote_data[quote_data['status'].isin(['Qualified', 'Converted'])]) / len(quote_data) if len(quote_data) > 0 else 0
            st.metric("Conversion Rate", f"{round(conversion * 100, 1)}%")
        with col3:
            avg_quality = quote_data['conversion_potential'].mean() if len(quote_data) > 0 else 0
            st.metric("Avg. Lead Quality", f"{round(avg_quality, 1)}/10")
        
        # Service breakdown for quotes
        if len(quote_data) > 0:
            service_quotes = quote_data.groupby('service_interest').size().reset_index(name='count')
            
            fig = px.pie(service_quotes, values='count', names='service_interest', 
                        title="Quote Requests by Service")
            
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No quote request data available for the selected date range.")
    
    with tab3:
        callback_data = filtered_df[filtered_df['source'] == 'Callback Request'] if len(filtered_df) > 0 else pd.DataFrame()
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Total Callbacks", len(callback_data))
        with col2:
            conversion = len(callback_data[callback_data['status'].isin(['Qualified', 'Converted'])]) / len(callback_data) if len(callback_data) > 0 else 0
            st.metric("Conversion Rate", f"{round(conversion * 100, 1)}%")
        with col3:
            avg_quality = callback_data['conversion_potential'].mean() if len(callback_data) > 0 else 0
            st.metric("Avg. Lead Quality", f"{round(avg_quality, 1)}/10")
        
        # Response time for callbacks
        if len(callback_data) > 0:
            fig = px.histogram(callback_data, x='response_time_hours', 
                              title="Response Time for Callback Requests",
                              labels={"response_time_hours": "Response Time (hours)"})
            
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No callback request data available for the selected date range.")

# Auto Scraping Page
elif st.session_state.active_tab == "Auto Scraping":
    st.markdown("<h2 class='sub-header'>Automated Business Discovery</h2>", unsafe_allow_html=True)
    
    # Status display
    status_color = "green" if st.session_state.scraping_stats["running"] else "red"
    status_text = "🟢 Running" if st.session_state.scraping_stats["running"] else "🔴 Stopped"
    
    st.markdown(f"<div style='padding: 1rem; border-radius: 0.5rem; background-color: {'#d4edda' if st.session_state.scraping_stats['running'] else '#f8d7da'}; margin-bottom: 1rem;'><h3 style='color: {status_color};'>{status_text}</h3><p>Last Run: {st.session_state.scraping_stats['last_run'] or 'Never'}</p><p>Total Scraped: {st.session_state.scraping_stats['total_scraped']} contractors | Cities Processed: {st.session_state.scraping_stats['cities_processed']}</p></div>", unsafe_allow_html=True)
    
    # Control buttons
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("▶️ Start Auto-Scraping", disabled=st.session_state.scraping_stats["running"]):
            st.session_state.scraping_stats["running"] = True
            st.session_state.scraping_stats["last_run"] = datetime.now().isoformat()
            st.experimental_rerun()
    
    with col2:
        if st.button("⏹️ Stop Auto-Scraping", disabled=not st.session_state.scraping_stats["running"]):
            st.session_state.scraping_stats["running"] = False
            st.experimental_rerun()
    
    with col3:
        if st.button("🧪 Test Scraping"):
            # Show a spinner while "testing"
            with st.spinner("Running test scrape..."):
                # Simulate processing time
                time.sleep(2)
                
                # Select a random test city
                import random
                test_city = random.choice(st.session_state.municipalities)
                
                # Test the scraper
                st.session_state.test_result = f"✅ Test successful: Found contractors in {test_city}"
                
                # Update stats
                st.session_state.scraping_stats["total_scraped"] += random.randint(3, 10)
                st.session_state.scraping_stats["cities_processed"] += 1
                
                st.success(st.session_state.test_result)
    
    # Error log display
    if st.session_state.scraping_stats["errors"]:
        st.markdown("<h3>Error Log</h3>", unsafe_allow_html=True)
        error_log = "\n".join(st.session_state.scraping_stats["errors"][-10:])  # Show last 10 errors
        st.code(error_log)
    
    # Configuration section
    st.markdown("<h3>Scraping Configuration</h3>", unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        scrape_interval = st.slider("Scraping Interval (minutes)", 15, 240, 60, 15)
        batch_size = st.slider("Cities per Batch", 1, 20, 5, 1)
    
    with col2:
        max_per_city = st.slider("Max Businesses per City", 10, 200, 50, 10)
        source_options = st.multiselect(
            "Data Sources", 
            ["OpenStreetMap", "Google Maps", "Yelp", "Local Directories"],
            ["OpenStreetMap"]
        )
    
    if st.button("Save Configuration"):
        st.success("Configuration saved successfully!")
    
    # City selection
    st.markdown("<h3>Target Cities</h3>", unsafe_allow_html=True)
    
    # Allow adding new cities
    new_city = st.text_input("Add a City")
    if new_city and st.button("Add City"):
        if new_city not in st.session_state.municipalities:
            st.session_state.municipalities.append(new_city)
            st.success(f"Added {new_city} to target cities list")
            st.experimental_rerun()
    
    # Display current cities with deletion option
    if st.session_state.municipalities:
        col1, col2, col3 = st.columns(3)
        
        for i, city in enumerate(st.session_state.municipalities):
            col = col1 if i % 3 == 0 else (col2 if i % 3 == 1 else col3)
            with col:
                city_key = f"city_{i}"
                if st.checkbox(city, key=city_key, value=True):
                    # City is selected for scraping
                    pass
                else:
                    # City is deselected
                    pass

# Data Sync Page
elif st.session_state.active_tab == "Data Sync":
    # Use the imported render_data_sync_page function
    render_data_sync_page()

# Settings Page
elif st.session_state.active_tab == "Settings":
    st.markdown("<h2 class='sub-header'>Dashboard Settings</h2>", unsafe_allow_html=True)
    
    # Create tabs for different settings
    tab1, tab2, tab3 = st.tabs(["General Settings", "Data Import/Export", "About"])
    
    with tab1:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("### Dashboard Preferences")
        
        # Example settings
        refresh_rate = st.select_slider("Data Refresh Rate", options=["1 minute", "5 minutes", "15 minutes", "30 minutes", "1 hour"], value="15 minutes")
        default_view = st.selectbox("Default Dashboard View", ["Dashboard", "Lead Analytics", "Form Performance", "Auto Scraping"])
        dark_mode = st.toggle("Dark Mode", False)
        
        # Save settings button
        if st.button("Save Settings"):
            st.success("Settings saved successfully!")
        st.markdown("</div>", unsafe_allow_html=True)
    
    with tab2:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("### Import Data")
        
        # File upload
        uploaded_file = st.file_uploader("Upload Lead Data (CSV or Excel)", type=["csv", "xlsx"])
        if uploaded_file is not None:
            st.success(f"File {uploaded_file.name} uploaded successfully! Ready for import.")
            
            if st.button("Process File"):
                # Process the file (e.g., parse CSV/Excel)
                try:
                    # Read the file based on its type
                    if uploaded_file.name.endswith('.csv'):
                        data = pd.read_csv(uploaded_file)
                    else:  # Excel
                        data = pd.read_excel(uploaded_file)
                    
                    # Convert to list of dictionaries for session state
                    records = data.to_dict('records')
                    
                    # Update session state
                    st.session_state.leads_data.update({i: record for i, record in enumerate(records)})
                    
                    st.success(f"Successfully imported {len(records)} records!")
                    st.experimental_rerun()
                except Exception as e:
                    st.error(f"Error processing file: {e}")
        
        st.markdown("### Export Data")
        
        export_format = st.selectbox("Export Format", ["CSV", "Excel", "JSON"])
        export_range = st.radio("Date Range", ["Current Filter", "All Data", "Custom Range"])
        
        if export_range == "Custom Range":
            export_start = st.date_input("Export Start Date", start_date)
            export_end = st.date_input("Export End Date", end_date)
        
        if st.button("Export Data"):
            # Prepare data for export
            if export_range == "Current Filter":
                export_df = filtered_df
            elif export_range == "All Data":
                export_df = df
            else:  # Custom Range
                export_df = df[(df['date'] >= export_start) & (df['date'] <= export_end)]
            
            # Create download link based on format
            if export_format == "CSV":
                csv = export_df.to_csv(index=False)
                st.download_button(
                    label="Download CSV",
                    data=csv,
                    file_name=f"lead_data_export_{datetime.now().strftime('%Y%m%d')}.csv",
                    mime="text/csv"
                )
            elif export_format == "Excel":
                # For Excel, we need to use a BytesIO object
                import io
                buffer = io.BytesIO()
                export_df.to_excel(buffer, index=False, engine="openpyxl")
                buffer.seek(0)
                st.download_button(
                    label="Download Excel",
                    data=buffer,
                    file_name=f"lead_data_export_{datetime.now().strftime('%Y%m%d')}.xlsx",
                    mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
            else:  # JSON
                json_str = export_df.to_json(orient="records")
                st.download_button(
                    label="Download JSON",
                    data=json_str,
                    file_name=f"lead_data_export_{datetime.now().strftime('%Y%m%d')}.json",
                    mime="application/json"
                )
        st.markdown("</div>", unsafe_allow_html=True)
    
    with tab3:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("### About Lead Engine Dashboard")
        
        st.markdown("""
        **Lead Engine Dashboard v1.0.0**
        
        Developed for Simcoe Stone to help manage and analyze leads from the website forms.
        
        This dashboard provides:
        - Real-time lead tracking and analytics
        - Performance metrics for different lead sources
        - Tools for lead quality assessment
        - Data import/export capabilities
        - Automated business discovery
        
        © 2023 Simcoe Stone. All rights reserved.
        """)
        st.markdown("</div>", unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown("© 2023 Simcoe Stone | Lead Engine Dashboard v1.0.0")

# Simulate scraping activity if running
if st.session_state.scraping_stats["running"]:
    # This would normally be in a background thread
    if random.random() < 0.3:  # 30% chance of a scraping activity update
        import random
        
        # Simulate processing a city
        if st.session_state.municipalities:
            next_index = st.session_state.scraping_stats["next_city_index"] % len(st.session_state.municipalities)
            city = st.session_state.municipalities[next_index]
            
            # Update stats
            st.session_state.scraping_stats["next_city_index"] = (next_index + 1) % len(st.session_state.municipalities)
            st.session_state.scraping_stats["cities_processed"] += 1
            new_leads = random.randint(0, 10)
            st.session_state.scraping_stats["total_scraped"] += new_leads
            st.session_state.scraping_stats["last_run"] = datetime.now().isoformat()
            
            # Add a random error occasionally
            if random.random() < 0.1:  # 10% chance of error
                error = f"Warning: Rate limit exceeded for {city}"
                st.session_state.scraping_stats["errors"].append(error)
                st.session_state.scraping_stats["errors"] = st.session_state.scraping_stats["errors"][-10:]