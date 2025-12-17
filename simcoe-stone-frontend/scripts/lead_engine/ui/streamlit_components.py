"""
Streamlit UI Components for Lead Engine Dashboard

This module provides reusable UI components for the Streamlit dashboard:
- Navigation components
- Card layouts
- Metric displays
- Form components
"""

import os
import streamlit as st
import pandas as pd
from datetime import datetime
import plotly.express as px
from typing import Dict, List, Any, Optional, Union, Callable

def render_page_header(title: str, subtitle: Optional[str] = None, icon: Optional[str] = None):
    """Render a styled page header
    
    Args:
        title: Page title
        subtitle: Optional subtitle
        icon: Optional icon (emoji)
    """
    icon_prefix = f"{icon} " if icon else ""
    st.markdown(f"<h2 class='sub-header'>{icon_prefix}{title}</h2>", unsafe_allow_html=True)
    
    if subtitle:
        st.markdown(f"<p>{subtitle}</p>", unsafe_allow_html=True)
    
    st.markdown("<hr>", unsafe_allow_html=True)

def render_metric_row(metrics: Dict[str, Dict[str, Any]], columns: int = 4):
    """Render a row of metric cards
    
    Args:
        metrics: Dictionary of metrics, where each value is a dict with 'value' and optionally 'delta'
        columns: Number of columns to display
    """
    cols = st.columns(columns)
    
    for i, (label, data) in enumerate(metrics.items()):
        col_index = i % columns
        with cols[col_index]:
            st.markdown("<div class='card'>", unsafe_allow_html=True)
            
            # Format delta if present
            delta = data.get('delta') if 'delta' in data else None
            delta_color = data.get('delta_color', 'normal') if delta is not None else 'normal'
            
            # Format value with prefix/suffix if provided
            value = data['value']
            prefix = data.get('prefix', '')
            suffix = data.get('suffix', '')
            
            if isinstance(value, (int, float)):
                formatted_value = f"{prefix}{value:,}{suffix}"
            else:
                formatted_value = f"{prefix}{value}{suffix}"
            
            st.metric(label, formatted_value, delta, delta_color=delta_color)
            st.markdown("</div>", unsafe_allow_html=True)

def render_card(title: str, content_fn: Callable, collapsed: bool = False):
    """Render a card with a title and content function
    
    Args:
        title: Card title
        content_fn: Function that renders the card content
        collapsed: Whether the card should be initially collapsed
    """
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    
    if collapsed:
        with st.expander(title):
            content_fn()
    else:
        st.markdown(f"<h3>{title}</h3>", unsafe_allow_html=True)
        content_fn()
    
    st.markdown("</div>", unsafe_allow_html=True)

def render_status_card(title: str, status: str, description: str, status_color: str):
    """Render a status card with colored indicator
    
    Args:
        title: Card title
        status: Status text
        description: Status description
        status_color: Color for status indicator (use Bootstrap colors)
    """
    st.markdown(f"""
    <div style='padding: 1rem; border-radius: 0.5rem; 
         background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
         margin-bottom: 1rem;'>
        <h3>{title}</h3>
        <div style='display: flex; align-items: center;'>
            <div style='width: 1rem; height: 1rem; border-radius: 50%; 
                  background-color: {status_color}; margin-right: 0.5rem;'></div>
            <strong>{status}</strong>
        </div>
        <p>{description}</p>
    </div>
    """, unsafe_allow_html=True)

def render_lead_table(df: pd.DataFrame, page_size: int = 10):
    """Render a paginated table of leads
    
    Args:
        df: DataFrame with lead data
        page_size: Number of rows per page
    """
    if len(df) == 0:
        st.info("No data available.")
        return
    
    # Set up pagination
    total_pages = (len(df) - 1) // page_size + 1
    
    col1, col2, col3 = st.columns([1, 3, 1])
    with col2:
        page = st.number_input("Page", min_value=1, max_value=total_pages, value=1)
    
    # Calculate slice indices
    start_idx = (page - 1) * page_size
    end_idx = min(start_idx + page_size, len(df))
    
    # Display page info
    st.markdown(f"Showing {start_idx + 1}-{end_idx} of {len(df)} records")
    
    # Display the current page
    st.dataframe(df.iloc[start_idx:end_idx], use_container_width=True)

def render_form_section(title: str, fields: List[Dict[str, Any]], submit_label: str = "Submit") -> Optional[Dict[str, Any]]:
    """Render a form section with fields
    
    Args:
        title: Form title
        fields: List of field definitions
        submit_label: Label for the submit button
        
    Returns:
        Dictionary of field values if submitted, None otherwise
    """
    st.markdown(f"<h3>{title}</h3>", unsafe_allow_html=True)
    
    with st.form(f"form_{title.lower().replace(' ', '_')}"):
        field_values = {}
        
        for field in fields:
            field_type = field.get('type', 'text')
            
            if field_type == 'text':
                field_values[field['key']] = st.text_input(
                    field['label'], 
                    value=field.get('default', ''),
                    placeholder=field.get('placeholder', '')
                )
            elif field_type == 'number':
                field_values[field['key']] = st.number_input(
                    field['label'],
                    min_value=field.get('min'),
                    max_value=field.get('max'),
                    value=field.get('default', 0),
                    step=field.get('step', 1)
                )
            elif field_type == 'select':
                field_values[field['key']] = st.selectbox(
                    field['label'],
                    options=field['options'],
                    index=field.get('default_index', 0)
                )
            elif field_type == 'multiselect':
                field_values[field['key']] = st.multiselect(
                    field['label'],
                    options=field['options'],
                    default=field.get('default', [])
                )
            elif field_type == 'date':
                field_values[field['key']] = st.date_input(
                    field['label'],
                    value=field.get('default', datetime.now().date())
                )
            elif field_type == 'checkbox':
                field_values[field['key']] = st.checkbox(
                    field['label'],
                    value=field.get('default', False)
                )
            elif field_type == 'textarea':
                field_values[field['key']] = st.text_area(
                    field['label'],
                    value=field.get('default', ''),
                    height=field.get('height', 100),
                    placeholder=field.get('placeholder', '')
                )
        
        submitted = st.form_submit_button(submit_label)
        
        if submitted:
            return field_values
        return None

def add_custom_css():
    """Add custom CSS styling to the Streamlit app"""
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

def setup_page_config():
    """Set up the Streamlit page configuration"""
    st.set_page_config(
        page_title="Simcoe Stone Lead Engine",
        page_icon="🏛️",
        layout="wide",
        initial_sidebar_state="expanded"
    )