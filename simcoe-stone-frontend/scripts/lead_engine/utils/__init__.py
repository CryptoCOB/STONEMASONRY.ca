"""
Utility modules for the Lead Engine Dashboard

This package contains utility modules for:
- Configuration and environment
- Data processing and transformation
- Visualization helpers
"""

from .config import (
    get_env_var,
    get_project_root,
    get_supabase_credentials,
    init_supabase_client,
    init_chroma_collection,
    get_api_keys
)

from .data_utils import (
    normalize_phone_number,
    calculate_lead_score,
    load_csv_data,
    save_csv_data,
    convert_to_dataframe,
    load_json_data,
    save_json_data,
    aggregate_by_date
)

__all__ = [
    # Config utilities
    'get_env_var',
    'get_project_root',
    'get_supabase_credentials',
    'init_supabase_client',
    'init_chroma_collection',
    'get_api_keys',
    
    # Data utilities
    'normalize_phone_number',
    'calculate_lead_score',
    'load_csv_data',
    'save_csv_data',
    'convert_to_dataframe',
    'load_json_data',
    'save_json_data',
    'aggregate_by_date'
]