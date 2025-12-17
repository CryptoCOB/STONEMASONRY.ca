"""
UI components for Lead Engine Dashboard

This package contains UI components for both Dash and Streamlit interfaces
"""

from .streamlit_components import (
    render_page_header,
    render_metric_row,
    render_card,
    render_status_card,
    render_lead_table,
    render_form_section,
    add_custom_css,
    setup_page_config
)

__all__ = [
    'render_page_header',
    'render_metric_row',
    'render_card',
    'render_status_card',
    'render_lead_table',
    'render_form_section',
    'add_custom_css',
    'setup_page_config'
]