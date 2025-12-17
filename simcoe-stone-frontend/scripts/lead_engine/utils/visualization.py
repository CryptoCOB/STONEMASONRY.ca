"""
Visualization Utilities for Lead Engine Dashboard

This module provides utilities for:
1. Creating consistent charts and visualizations
2. Common color schemes and styling
3. Custom Streamlit components
"""

import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import streamlit as st
from typing import Dict, List, Any, Optional, Tuple, Union

# Define color schemes
COLOR_SCHEMES = {
    "primary": ["#3498db", "#2980b9", "#1f618d", "#154360", "#0b2133"],
    "success": ["#2ecc71", "#27ae60", "#1e8449", "#145a32", "#0a2c1b"],
    "warning": ["#f39c12", "#d35400", "#a04000", "#6e2c00", "#3c1a00"],
    "danger": ["#e74c3c", "#c0392b", "#922b21", "#641e16", "#37110d"],
    "neutral": ["#95a5a6", "#7f8c8d", "#616a6b", "#424949", "#212f3d"]
}

# Status color mapping
STATUS_COLORS = {
    "New": "#3498db",
    "Contacted": "#f39c12",
    "Qualified": "#2ecc71",
    "Converted": "#27ae60",
    "Lost": "#e74c3c"
}

def create_line_chart(df: pd.DataFrame, 
                      x_column: str, 
                      y_column: str, 
                      title: str = "",
                      x_label: Optional[str] = None,
                      y_label: Optional[str] = None,
                      color: str = "#3498db",
                      height: int = 400) -> go.Figure:
    """Create a line chart using Plotly
    
    Args:
        df: DataFrame with data
        x_column: Column to use for x-axis
        y_column: Column to use for y-axis
        title: Chart title
        x_label: Label for x-axis (uses x_column if None)
        y_label: Label for y-axis (uses y_column if None)
        color: Line color
        height: Chart height
        
    Returns:
        Plotly figure object
    """
    # Set default labels if not provided
    x_label = x_label or x_column
    y_label = y_label or y_column
    
    fig = px.line(
        df, 
        x=x_column, 
        y=y_column, 
        title=title,
        labels={x_column: x_label, y_column: y_label}
    )
    
    # Update line color
    fig.update_traces(line=dict(color=color))
    
    # Set height
    fig.update_layout(height=height)
    
    return fig

def create_bar_chart(df: pd.DataFrame,
                     x_column: str,
                     y_column: str,
                     title: str = "",
                     x_label: Optional[str] = None,
                     y_label: Optional[str] = None,
                     color_column: Optional[str] = None,
                     color_map: Optional[Dict[str, str]] = None,
                     height: int = 400) -> go.Figure:
    """Create a bar chart using Plotly
    
    Args:
        df: DataFrame with data
        x_column: Column to use for x-axis
        y_column: Column to use for y-axis
        title: Chart title
        x_label: Label for x-axis (uses x_column if None)
        y_label: Label for y-axis (uses y_column if None)
        color_column: Column to use for color differentiation
        color_map: Dictionary mapping values to colors
        height: Chart height
        
    Returns:
        Plotly figure object
    """
    # Set default labels if not provided
    x_label = x_label or x_column
    y_label = y_label or y_column
    
    # Create bar chart
    if color_column:
        fig = px.bar(
            df,
            x=x_column,
            y=y_column,
            color=color_column,
            title=title,
            labels={x_column: x_label, y_column: y_label},
            color_discrete_map=color_map
        )
    else:
        fig = px.bar(
            df,
            x=x_column,
            y=y_column,
            title=title,
            labels={x_column: x_label, y_column: y_label}
        )
    
    # Set height
    fig.update_layout(height=height)
    
    return fig

def create_pie_chart(df: pd.DataFrame,
                     values_column: str,
                     names_column: str,
                     title: str = "",
                     color_map: Optional[Dict[str, str]] = None,
                     height: int = 400) -> go.Figure:
    """Create a pie chart using Plotly
    
    Args:
        df: DataFrame with data
        values_column: Column to use for slice sizes
        names_column: Column to use for slice names
        title: Chart title
        color_map: Dictionary mapping names to colors
        height: Chart height
        
    Returns:
        Plotly figure object
    """
    fig = px.pie(
        df,
        values=values_column,
        names=names_column,
        title=title,
        color=names_column,
        color_discrete_map=color_map
    )
    
    # Set height
    fig.update_layout(height=height)
    
    return fig

def create_histogram(df: pd.DataFrame,
                     x_column: str,
                     title: str = "",
                     x_label: Optional[str] = None,
                     color: str = "#3498db",
                     height: int = 400) -> go.Figure:
    """Create a histogram using Plotly
    
    Args:
        df: DataFrame with data
        x_column: Column to use for histogram
        title: Chart title
        x_label: Label for x-axis (uses x_column if None)
        color: Bar color
        height: Chart height
        
    Returns:
        Plotly figure object
    """
    # Set default label if not provided
    x_label = x_label or x_column
    
    fig = px.histogram(
        df,
        x=x_column,
        title=title,
        labels={x_column: x_label}
    )
    
    # Update bar color
    fig.update_traces(marker_color=color)
    
    # Set height
    fig.update_layout(height=height)
    
    return fig

def create_scatter_plot(df: pd.DataFrame,
                        x_column: str,
                        y_column: str,
                        title: str = "",
                        x_label: Optional[str] = None,
                        y_label: Optional[str] = None,
                        color_column: Optional[str] = None,
                        size_column: Optional[str] = None,
                        height: int = 400) -> go.Figure:
    """Create a scatter plot using Plotly
    
    Args:
        df: DataFrame with data
        x_column: Column to use for x-axis
        y_column: Column to use for y-axis
        title: Chart title
        x_label: Label for x-axis (uses x_column if None)
        y_label: Label for y-axis (uses y_column if None)
        color_column: Column to use for point colors
        size_column: Column to use for point sizes
        height: Chart height
        
    Returns:
        Plotly figure object
    """
    # Set default labels if not provided
    x_label = x_label or x_column
    y_label = y_label or y_column
    
    fig = px.scatter(
        df,
        x=x_column,
        y=y_column,
        color=color_column,
        size=size_column,
        title=title,
        labels={x_column: x_label, y_column: y_label}
    )
    
    # Set height
    fig.update_layout(height=height)
    
    return fig

def create_metric_card(title: str, 
                       value: Union[int, float, str], 
                       delta: Optional[Union[int, float, str]] = None,
                       suffix: str = "",
                       prefix: str = "",
                       delta_color: str = "normal") -> None:
    """Create a styled metric card in Streamlit
    
    Args:
        title: Metric title
        value: Main value to display
        delta: Change value (will show with up/down arrow)
        suffix: Text to show after the value
        prefix: Text to show before the value
        delta_color: Color for delta ('normal', 'inverse', or 'off')
    """
    st.metric(
        label=title,
        value=f"{prefix}{value}{suffix}",
        delta=delta,
        delta_color=delta_color
    )

def create_card(title: str, content: str, icon: Optional[str] = None) -> None:
    """Create a styled info card with HTML
    
    Args:
        title: Card title
        content: Card content text
        icon: Optional icon emoji
    """
    icon_html = f"{icon} " if icon else ""
    
    st.markdown(f"""
    <div style="padding: 1rem; border-radius: 0.5rem; 
         background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
         margin-bottom: 1rem;">
        <h3>{icon_html}{title}</h3>
        <p>{content}</p>
    </div>
    """, unsafe_allow_html=True)

def create_status_badge(status: str) -> str:
    """Create an HTML status badge
    
    Args:
        status: Status text
        
    Returns:
        HTML string for the badge
    """
    color = STATUS_COLORS.get(status, "#95a5a6")
    
    return f"""
    <span style="background-color: {color}; 
                color: white; 
                padding: 0.25rem 0.5rem; 
                border-radius: 1rem; 
                font-size: 0.8rem;">
        {status}
    </span>
    """