"""
Lead Engine Dashboard - Main Application

This dashboard provides analytics and management for leads
collected from the Simcoe Stone website.
"""
import os
import sys
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime, timedelta
import json

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
</style>
""", unsafe_allow_html=True)

# App title
st.markdown("<h1 class='main-header'>Simcoe Stone Lead Engine Dashboard</h1>", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.image("build/LOGO-TRANSPARENT-STONEMASONRYCA.PNG", width=200)
    st.markdown("## Navigation")
    page = st.radio("Select a Page:", ["Dashboard", "Lead Analytics", "Form Performance", "Settings"])
    
    # Date filter
    st.markdown("## Date Range")
    today = datetime.now().date()
    thirty_days_ago = today - timedelta(days=30)
    
    start_date = st.date_input("Start Date", thirty_days_ago)
    end_date = st.date_input("End Date", today)
    
    st.markdown("---")
    st.markdown("### About")
    st.info("Lead Engine Dashboard v1.0.0")

# Sample data generation (replace with actual data loading)
@st.cache_data
def load_sample_data():
    # Create sample data for demonstration
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
if page == "Dashboard":
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.metric("Total Leads", len(filtered_df))
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        conversion_rate = round(len(filtered_df[filtered_df['status'] == 'Converted']) / len(filtered_df) * 100, 1)
        st.metric("Conversion Rate", f"{conversion_rate}%")
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col3:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        avg_response = round(filtered_df['response_time_hours'].mean(), 1)
        st.metric("Avg Response Time", f"{avg_response} hours")
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col4:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        qualified_leads = len(filtered_df[filtered_df['status'].isin(['Qualified', 'Converted'])])
        st.metric("Qualified Leads", qualified_leads)
        st.markdown("</div>", unsafe_allow_html=True)
    
    # Charts
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("<h2 class='sub-header'>Lead Volume Over Time</h2>", unsafe_allow_html=True)
        
        # Aggregate data by date
        daily_leads = filtered_df.groupby('date').size().reset_index(name='count')
        
        # Create chart
        fig = px.line(daily_leads, x='date', y='count', 
                     title="Daily Lead Volume", 
                     labels={"count": "Number of Leads", "date": "Date"})
        
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("<h2 class='sub-header'>Lead Source Distribution</h2>", unsafe_allow_html=True)
        
        # Aggregate data by source
        source_counts = filtered_df['source'].value_counts().reset_index()
        source_counts.columns = ['source', 'count']
        
        # Create chart
        fig = px.pie(source_counts, values='count', names='source', 
                    title="Lead Sources")
        
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
    
    # Services breakdown
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h2 class='sub-header'>Service Interest Breakdown</h2>", unsafe_allow_html=True)
    
    # Aggregate data by service
    service_counts = filtered_df['service_interest'].value_counts().reset_index()
    service_counts.columns = ['service', 'count']
    
    # Create chart
    fig = px.bar(service_counts, x='service', y='count', 
                title="Service Interest Distribution",
                labels={"count": "Number of Leads", "service": "Service"})
    
    st.plotly_chart(fig, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)
    
    # Recent leads table
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h2 class='sub-header'>Recent Leads</h2>", unsafe_allow_html=True)
    
    recent_leads = filtered_df.sort_values('date', ascending=False).head(10)
    st.dataframe(
        recent_leads[['date', 'name', 'email', 'phone', 'service_interest', 'status']], 
        width='stretch'
    )
    st.markdown("</div>", unsafe_allow_html=True)

# Lead Analytics Page
elif page == "Lead Analytics":
    st.markdown("<h2 class='sub-header'>Lead Analytics</h2>", unsafe_allow_html=True)
    
    # Lead status breakdown
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("<h3>Lead Status</h3>", unsafe_allow_html=True)
        
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
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("<h3>Conversion Potential</h3>", unsafe_allow_html=True)
        
        # Create histogram of conversion potential
        fig = px.histogram(filtered_df, x='conversion_potential', 
                          title="Lead Conversion Potential Distribution",
                          labels={"conversion_potential": "Conversion Potential (1-10)"})
        
        st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
    
    # Response time analysis
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h3>Response Time Analysis</h3>", unsafe_allow_html=True)
    
    # Group by date and calculate average response time
    response_time = filtered_df.groupby('date')['response_time_hours'].mean().reset_index()
    
    # Create chart
    fig = px.line(response_time, x='date', y='response_time_hours', 
                 title="Average Response Time Trend",
                 labels={"response_time_hours": "Average Response Time (hours)", "date": "Date"})
    
    st.plotly_chart(fig, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)
    
    # Lead quality by source
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h3>Lead Quality by Source</h3>", unsafe_allow_html=True)
    
    # Group by source and calculate average conversion potential
    source_quality = filtered_df.groupby('source')['conversion_potential'].mean().reset_index()
    source_quality.columns = ['source', 'avg_conversion_potential']
    
    # Create chart
    fig = px.bar(source_quality, x='source', y='avg_conversion_potential', 
                title="Average Lead Quality by Source",
                labels={"avg_conversion_potential": "Avg. Conversion Potential", "source": "Lead Source"})
    
    st.plotly_chart(fig, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)

# Form Performance Page
elif page == "Form Performance":
    st.markdown("<h2 class='sub-header'>Form Performance</h2>", unsafe_allow_html=True)
    
    # Create tabs for different forms
    tab1, tab2, tab3 = st.tabs(["Contact Form", "Quote Request", "Callback Request"])
    
    with tab1:
        contact_form_data = filtered_df[filtered_df['source'] == 'Contact Form']
        
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
        daily_contacts = contact_form_data.groupby('date').size().reset_index(name='count')
        
        fig = px.line(daily_contacts, x='date', y='count', 
                     title="Daily Contact Form Submissions",
                     labels={"count": "Number of Submissions", "date": "Date"})
        
        st.plotly_chart(fig, use_container_width=True)
    
    with tab2:
        quote_data = filtered_df[filtered_df['source'] == 'Quote Request']
        
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
        service_quotes = quote_data.groupby('service_interest').size().reset_index(name='count')
        
        fig = px.pie(service_quotes, values='count', names='service_interest', 
                    title="Quote Requests by Service")
        
        st.plotly_chart(fig, use_container_width=True)
    
    with tab3:
        callback_data = filtered_df[filtered_df['source'] == 'Callback Request']
        
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

# Settings Page
elif page == "Settings":
    st.markdown("<h2 class='sub-header'>Dashboard Settings</h2>", unsafe_allow_html=True)
    
    # Create tabs for different settings
    tab1, tab2, tab3 = st.tabs(["General Settings", "Data Import/Export", "About"])
    
    with tab1:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.markdown("### Dashboard Preferences")
        
        # Example settings
        refresh_rate = st.select_slider("Data Refresh Rate", options=["1 minute", "5 minutes", "15 minutes", "30 minutes", "1 hour"], value="15 minutes")
        default_view = st.selectbox("Default Dashboard View", ["Dashboard", "Lead Analytics", "Form Performance"])
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
                st.info("Processing file... (This is a placeholder)")
        
        st.markdown("### Export Data")
        
        export_format = st.selectbox("Export Format", ["CSV", "Excel", "JSON"])
        export_range = st.radio("Date Range", ["Current Filter", "All Data", "Custom Range"])
        
        if export_range == "Custom Range":
            export_start = st.date_input("Export Start Date", start_date)
            export_end = st.date_input("Export End Date", end_date)
        
        if st.button("Export Data"):
            st.info(f"Exporting data in {export_format} format... (This is a placeholder)")
            st.download_button(
                label="Download Export",
                data="Sample export data",
                file_name=f"lead_data_export_{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv"
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
        
        © 2023 Simcoe Stone. All rights reserved.
        """)
        st.markdown("</div>", unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown("© 2023 Simcoe Stone | Lead Engine Dashboard v1.0.0")

# Add a refresh button in the sidebar
with st.sidebar:
    if st.button("Refresh Data"):
        st.rerun()
