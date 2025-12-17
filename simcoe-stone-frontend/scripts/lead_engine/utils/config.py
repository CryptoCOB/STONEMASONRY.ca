"""
Configuration and Environment Utilities for Lead Engine

This module provides utilities for:
1. Loading environment variables
2. Configuration management
3. Database connection helpers
"""

import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger("Config")

# Load environment variables from .env file
load_dotenv()

def get_project_root() -> Path:
    """Get the absolute path to the project root directory"""
    # This utility assumes the current structure
    return Path(__file__).parent.parent.parent.parent

def get_env_var(name: str, default: Optional[str] = None) -> Optional[str]:
    """Get environment variable with fallback to default"""
    return os.environ.get(name, default)

def load_json_config(file_path: str) -> Dict[str, Any]:
    """Load configuration from a JSON file
    
    Args:
        file_path: Path to the JSON configuration file
        
    Returns:
        Dictionary containing configuration values
    """
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading config file {file_path}: {e}")
        return {}

def get_supabase_credentials() -> Dict[str, str]:
    """Get Supabase connection credentials from environment variables
    
    Returns:
        Dictionary with Supabase URL and key
    """
    return {
        "url": get_env_var("SUPABASE_URL", ""),
        "key": get_env_var("SUPABASE_KEY", "")
    }

def init_supabase_client():
    """Initialize and return a Supabase client if credentials are available"""
    try:
        from supabase import create_client
        
        credentials = get_supabase_credentials()
        if credentials["url"] and credentials["key"]:
            return create_client(credentials["url"], credentials["key"])
        else:
            logger.warning("Supabase credentials not found in environment variables")
            return None
    except ImportError:
        logger.warning("Supabase package not installed. Please install with: uv pip install supabase")
        return None
    except Exception as e:
        logger.error(f"Error initializing Supabase client: {e}")
        return None

def init_chroma_collection(collection_name: str = "contractors"):
    """Initialize and return a Chroma collection if available
    
    Args:
        collection_name: Name of the collection to use
        
    Returns:
        Chroma collection object or None if not available
    """
    try:
        import chromadb
        from chromadb.config import Settings
        
        # Get persistent path
        persist_dir = os.path.join(get_project_root(), "data", "chroma_db")
        os.makedirs(persist_dir, exist_ok=True)
        
        # Initialize client
        client = chromadb.PersistentClient(path=persist_dir)
        
        # Get or create collection
        try:
            collection = client.get_collection(name=collection_name)
            logger.info(f"Loaded existing Chroma collection: {collection_name}")
        except:
            collection = client.create_collection(name=collection_name)
            logger.info(f"Created new Chroma collection: {collection_name}")
        
        return collection
    except ImportError:
        logger.warning("ChromaDB package not installed. Please install with: uv pip install chromadb")
        return None
    except Exception as e:
        logger.error(f"Error initializing Chroma collection: {e}")
        return None

def get_api_keys() -> Dict[str, str]:
    """Get API keys from environment variables
    
    Returns:
        Dictionary with various API keys
    """
    return {
        "openai": get_env_var("OPENAI_API_KEY", ""),
        "google_maps": get_env_var("GOOGLE_MAPS_API_KEY", ""),
        "yelp": get_env_var("YELP_API_KEY", "")
    }