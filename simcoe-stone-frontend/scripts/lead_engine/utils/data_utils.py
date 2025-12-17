"""
Data Processing Utilities for Lead Engine

This module provides utilities for:
1. Data transformation and cleaning
2. Lead scoring and enrichment
3. CSV and JSON data handling
"""

import os
import json
import csv
import logging
import pandas as pd
from datetime import datetime
from typing import Dict, List, Any, Optional, Union

logger = logging.getLogger("DataUtils")

def normalize_phone_number(phone: str) -> str:
    """Normalize phone number to consistent format
    
    Args:
        phone: Raw phone number string
        
    Returns:
        Normalized phone number (e.g., (123) 456-7890)
    """
    # Remove all non-numeric characters
    digits = ''.join(filter(str.isdigit, phone))
    
    if not digits:
        return ""
    
    # Format based on length
    if len(digits) == 10:
        return f"({digits[0:3]}) {digits[3:6]}-{digits[6:10]}"
    elif len(digits) == 11 and digits[0] == '1':
        return f"({digits[1:4]}) {digits[4:7]}-{digits[7:11]}"
    else:
        # Return original if we can't normalize
        return phone

def calculate_lead_score(lead_data: Dict[str, Any]) -> int:
    """Calculate a score for a lead based on available data
    
    Args:
        lead_data: Dictionary with lead information
        
    Returns:
        Score from 1-10 indicating lead quality
    """
    score = 5  # Base score
    
    # Adjust based on available contact info
    if lead_data.get("phone"):
        score += 1
    if lead_data.get("email"):
        score += 1
    if lead_data.get("website"):
        score += 1
    
    # Adjust based on service interest if available
    service = lead_data.get("service_interest", "").lower()
    if service and ("masonry" in service or "stone" in service):
        score += 1
    
    # Adjust based on lead source
    source = lead_data.get("source", "").lower()
    if "quote" in source:
        score += 1
    
    # Cap at 10
    return min(score, 10)

def load_csv_data(file_path: str) -> List[Dict[str, Any]]:
    """Load data from a CSV file
    
    Args:
        file_path: Path to the CSV file
        
    Returns:
        List of dictionaries representing the CSV rows
    """
    try:
        data = []
        with open(file_path, 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                data.append(row)
        return data
    except Exception as e:
        logger.error(f"Error loading CSV file {file_path}: {e}")
        return []

def save_csv_data(data: List[Dict[str, Any]], file_path: str, headers: Optional[List[str]] = None) -> bool:
    """Save data to a CSV file
    
    Args:
        data: List of dictionaries to save
        file_path: Path to the CSV file
        headers: Optional list of column headers (uses keys from first dict if not provided)
        
    Returns:
        True if successful, False otherwise
    """
    try:
        if not data:
            logger.warning(f"No data to save to {file_path}")
            return False
        
        # Determine headers if not provided
        if not headers:
            headers = list(data[0].keys())
        
        with open(file_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(data)
        
        return True
    except Exception as e:
        logger.error(f"Error saving CSV file {file_path}: {e}")
        return False

def convert_to_dataframe(data: List[Dict[str, Any]]) -> pd.DataFrame:
    """Convert a list of dictionaries to a pandas DataFrame
    
    Args:
        data: List of dictionaries
        
    Returns:
        Pandas DataFrame
    """
    try:
        df = pd.DataFrame(data)
        
        # Convert date columns to datetime
        date_columns = [col for col in df.columns if 'date' in col.lower() or 'time' in col.lower()]
        for col in date_columns:
            try:
                df[col] = pd.to_datetime(df[col], errors='ignore')
            except:
                pass
        
        return df
    except Exception as e:
        logger.error(f"Error converting data to DataFrame: {e}")
        return pd.DataFrame()

def load_json_data(file_path: str) -> Union[Dict[str, Any], List[Dict[str, Any]]]:
    """Load data from a JSON file
    
    Args:
        file_path: Path to the JSON file
        
    Returns:
        Dictionary or list from JSON file
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading JSON file {file_path}: {e}")
        return {}

def save_json_data(data: Union[Dict[str, Any], List[Dict[str, Any]]], file_path: str) -> bool:
    """Save data to a JSON file
    
    Args:
        data: Dictionary or list to save
        file_path: Path to the JSON file
        
    Returns:
        True if successful, False otherwise
    """
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        logger.error(f"Error saving JSON file {file_path}: {e}")
        return False

def aggregate_by_date(df: pd.DataFrame, date_column: str = 'date') -> pd.DataFrame:
    """Aggregate data by date
    
    Args:
        df: DataFrame to aggregate
        date_column: Name of the date column
        
    Returns:
        Aggregated DataFrame with count by date
    """
    try:
        # Convert date column to datetime if needed
        if date_column in df.columns:
            df[date_column] = pd.to_datetime(df[date_column], errors='coerce')
            
            # Group by date and count
            return df.groupby(date_column).size().reset_index(name='count')
        else:
            logger.warning(f"Date column '{date_column}' not found in DataFrame")
            return pd.DataFrame()
    except Exception as e:
        logger.error(f"Error aggregating data by date: {e}")
        return pd.DataFrame()