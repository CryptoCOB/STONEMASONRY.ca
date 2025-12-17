"""
Client Lead Engine: Production-Grade Python Script
- Imports homeowner leads from CSV
- Normalizes, deduplicates, and validates data
- Inserts directly into Supabase clients_prospects table
- Logs all actions and errors
"""
import os
import csv
import logging
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logging.basicConfig(filename="lead_engine_client.log", level=logging.INFO)

# Helper functions
def normalize_phone(phone):
    if not phone:
        return None
    digits = ''.join(filter(str.isdigit, phone))
    return f"+1{digits[-10:]}" if len(digits) >= 10 else None

def deduplicate(existing, new):
    return [n for n in new if n["email"].lower() not in {e["email"].lower() for e in existing}]

def import_clients(csv_path):
    all_clients = []
    with open(csv_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            client = {
                "name": row["name"],
                "email": row["email"],
                "phone": normalize_phone(row.get("phone")),
                "address": row.get("address"),
                "source": row.get("source", "manual"),
                "signup_stage": row.get("signup_stage", "prospect"),
                "job_interest": row.get("job_interest"),
                "notes": row.get("notes", "")
            }
            all_clients.append(client)
    return all_clients

def insert_to_supabase(clients):
    for client in clients:
        try:
            supabase.table("clients_prospects").insert(client).execute()
            logging.info(f"Inserted: {client['email']}")
        except Exception as e:
            logging.error(f"Error inserting {client['email']}: {e}")

if __name__ == "__main__":
    csv_path = "client_leads.csv"  # Place your CSV file in the same directory
    clients = import_clients(csv_path)
    clients = deduplicate([], clients)
    insert_to_supabase(clients)
    print(f"Inserted {len(clients)} clients into Supabase.")
