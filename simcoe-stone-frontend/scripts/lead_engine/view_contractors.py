"""
Quick viewer: fetch and display contractors from Supabase contractors_prospects
Usage: run inside uv venv. Respects .env for credentials.
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def main():
    # Count total
    count_resp = supabase.table("contractors_prospects").select("id", count="exact").execute()
    total = count_resp.count or 0
    print(f"Total contractors: {total}")

    # Fetch first 10
    resp = supabase.table("contractors_prospects").select("name, phone, website, address, service_area, source, status, score, socials").limit(10).execute()
    rows = resp.data or []
    if not rows:
        print("No records found.")
        return

    for i, row in enumerate(rows, start=1):
        socials = row.get('socials') or {}
        g = (socials or {}).get('google') or {}
        rating = g.get('rating')
        reviews = g.get('reviews_count')
        print(f"{i}. {row.get('name')} | {row.get('phone')} | {row.get('website')} | {row.get('service_area')} | {row.get('status')} | score={row.get('score')} | rating={rating} reviews={reviews}")

if __name__ == "__main__":
    main()
