"""
Database module for Chroma and Supabase integration
"""
import os
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
from dotenv import load_dotenv

import chromadb
from chromadb.config import Settings
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL", "")
supabase_key = os.getenv("SUPABASE_KEY", "")
supabase: Client = create_client(supabase_url, supabase_key)

# Initialize Chroma client
chroma_client = chromadb.Client(Settings(
    persist_directory=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "chroma_db"),
    anonymized_telemetry=False
))

# Create collections
try:
    collection = chroma_client.get_or_create_collection(
        name="contractor_leads",
        metadata={"hnsw:space": "cosine"}
    )
except Exception as e:
    print(f"[Error] Failed to initialize Chroma: {e}")
    # Fallback to empty collection
    collection = None

def save_to_chroma(item: Dict[str, Any], doc_id: str = None, document: str = None) -> bool:
    """Save item to Chroma vector database"""
    if not collection:
        return False
    
    try:
        doc_id = doc_id or f"{item.get('type', 'unknown')}:{item.get('name', datetime.now().isoformat())}"
        document = document or item.get('name', 'Unknown')
        
        # Clean metadata for Chroma (only string, int, float, bool)
        metadata = {k: v for k, v in item.items() if isinstance(v, (str, int, float, bool))}
        
        collection.add(
            documents=[document],
            metadatas=[metadata],
            ids=[doc_id]
        )
        return True
    except Exception as e:
        print(f"[Error] Failed to save to Chroma: {e}")
        return False

def save_to_supabase(table: str, item: Dict[str, Any]) -> bool:
    """Save item to Supabase"""
    try:
        supabase.table(table).insert(item).execute()
        return True
    except Exception as e:
        print(f"[Error] Failed to save to Supabase: {e}")
        return False

def load_contractor_leads() -> List[Dict[str, Any]]:
    """Load contractor leads from Supabase"""
    try:
        result = supabase.table("contractors_prospects").select("*").execute()
        return result.data
    except Exception as e:
        print(f"[Error] Failed to load from Supabase: {e}")
        return []

def check_duplicate(table: str, key_field: str, value: str) -> bool:
    """Check if an item already exists in Supabase"""
    try:
        result = supabase.table(table).select("id").eq(key_field, value).execute()
        return bool(result.data)
    except Exception:
        return False