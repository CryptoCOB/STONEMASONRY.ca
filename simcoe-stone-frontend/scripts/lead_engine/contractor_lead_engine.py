"""
Contractor Lead Engine: Advanced Enrichment
- Discovers masonry contractors via Google Places API
- Enriches with Place Details (phone, website, rating, reviews, hours)
- Scrapes website for emails, social links, logo, keywords, recent activity
- Normalizes, deduplicates, validates, and inserts into Supabase
- Confidence scoring based on enrichment depth
- Logs all actions and errors
"""
import os
import re
import time
import logging
from typing import Dict, Any, List, Optional

import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
# NLP for keyword extraction
try:
    from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS, TfidfVectorizer
except ImportError:
    ENGLISH_STOP_WORDS = set()
    TfidfVectorizer = None

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "15"))
MAX_PLACES_PER_CITY = int(os.getenv("MAX_PLACES_PER_CITY", "50"))

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logging.basicConfig(filename="lead_engine.log", level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")

# Load all Canadian municipalities from file
CITIES_FILE = os.path.join(os.path.dirname(__file__), "canada_municipalities.txt")
def load_canada_cities() -> List[str]:
    if os.path.exists(CITIES_FILE):
        with open(CITIES_FILE, "r", encoding="utf-8") as f:
            cities = [line.strip() for line in f if line.strip() and not line.strip().startswith("#")]
        if cities:
            return cities
    # Fallback (minimal set)
    return ["Toronto", "Mississauga", "Scarborough", "Barrie", "Hamilton"]

CITIES = load_canada_cities()

EMAIL_REGEX = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
SOCIAL_DOMAINS = ["instagram.com", "facebook.com", "tiktok.com", "linkedin.com", "x.com", "twitter.com", "youtube.com"]
IMAGE_REGEX = re.compile(r'<img[^>]+src=["\']([^"\'>]+)["\']', re.IGNORECASE)
KEYWORD_SERVICE_HINTS = ["masonry", "stone", "chimney", "fireplace", "restoration", "repair", "construction", "facade", "foundation", "wall", "patio", "outdoor", "indoor", "limestone", "granite", "marble", "veneer", "custom"]


def normalize_phone(phone: Optional[str]) -> Optional[str]:
    if not phone:
        return None
    digits = ''.join(filter(str.isdigit, phone))
    return f"+1{digits[-10:]}" if len(digits) >= 10 else None


def deduplicate(existing: List[Dict[str, Any]], new: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    existing_names = {e.get("name", "").strip().lower() for e in existing}
    return [n for n in new if n.get("name", "").strip().lower() not in existing_names]


def google_text_search(city: str) -> List[Dict[str, Any]]:
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": f"masonry contractor near {city}",
        "key": GOOGLE_API_KEY,
    }
    out = []
    next_page_token = None
    pages = 0
    while True:
        if next_page_token:
            params["pagetoken"] = next_page_token
            # per docs, wait a bit before using page token
            time.sleep(2)
        resp = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        data = resp.json()
        out.extend(data.get("results", []))
        pages += 1
        if len(out) >= MAX_PLACES_PER_CITY:
            break
        next_page_token = data.get("next_page_token")
        if not next_page_token or pages >= 3:
            import os
            import re
            import time
            import logging
            from typing import Dict, Any, List, Optional

            import requests
            from bs4 import BeautifulSoup
            from supabase import create_client, Client
            from dotenv import load_dotenv

            # Optional: Advanced keyword extraction
            try:
                import importlib
                module = importlib.import_module("sklearn.feature_extraction.text")
                ENGLISH_STOP_WORDS = getattr(module, "ENGLISH_STOP_WORDS", set())
                TfidfVectorizer = getattr(module, "TfidfVectorizer", None)
            except Exception:
                ENGLISH_STOP_WORDS = set()
                TfidfVectorizer = None

            # Load environment variables
            load_dotenv()
            SUPABASE_URL = os.getenv("SUPABASE_URL")
            SUPABASE_KEY = os.getenv("SUPABASE_KEY")
            GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
            REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "15"))
            MAX_PLACES_PER_CITY = int(os.getenv("MAX_PLACES_PER_CITY", "50"))

            supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

            logging.basicConfig(filename="lead_engine.log", level=logging.INFO,
                                format="%(asctime)s %(levelname)s %(message)s")

            # Load full list of Ontario municipalities from a file (one city/town per line).
            # Create a file named "ontario_municipalities.txt" next to this script with all municipalities,
            # or keep the fallback list below for a minimal set.
            CITIES_FILE = os.path.join(os.path.dirname(__file__), "canada_municipalities.txt")

            def load_ontario_cities() -> List[str]:
                if os.path.exists(CITIES_FILE):
                    with open(CITIES_FILE, "r", encoding="utf-8") as f:
                        cities = [line.strip() for line in f if line.strip() and not line.strip().startswith("#")]
                    if cities:
                        return cities
                # Fallback (will be used if the file is missing or empty)
                return ["Toronto", "Mississauga", "Scarborough", "Barrie", "Hamilton"]

            CITIES = load_ontario_cities()

            EMAIL_REGEX = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
            SOCIAL_DOMAINS = ["instagram.com", "facebook.com", "tiktok.com", "linkedin.com", "x.com", "twitter.com", "youtube.com"]
            IMAGE_REGEX = re.compile(r'<img[^>]+src=["\']([^"\'>]+)["\']', re.IGNORECASE)
            KEYWORD_SERVICE_HINTS = [
                "masonry", "stone", "chimney", "fireplace", "restoration", "repair", "construction",
                "facade", "foundation", "wall", "patio", "outdoor", "indoor", "limestone", "granite",
                "marble", "veneer", "custom"
            ]

            def normalize_phone(phone: Optional[str]) -> Optional[str]:
                if not phone:
                    return None
                digits = ''.join(filter(str.isdigit, phone))
                return f"+1{digits[-10:]}" if len(digits) >= 10 else None

            def deduplicate(existing: List[Dict[str, Any]], new: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
                existing_names = {e.get("name", "").strip().lower() for e in existing}
                return [n for n in new if n.get("name", "").strip().lower() not in existing_names]

            def google_text_search(city: str) -> List[Dict[str, Any]]:
                url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
                params = {
                    "query": f"masonry contractor near {city}",
                    "key": GOOGLE_API_KEY,
                }
                out = []
                next_page_token = None
                pages = 0
                while True:
                    if next_page_token:
                        params["pagetoken"] = next_page_token
                        time.sleep(2)
                    resp = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
                    resp.raise_for_status()
                    data = resp.json()
                    out.extend(data.get("results", []))
                    pages += 1
                    if len(out) >= MAX_PLACES_PER_CITY:
                        break
                    next_page_token = data.get("next_page_token")
                    if not next_page_token or pages >= 3:
                        break
                return out[:MAX_PLACES_PER_CITY]

            def google_place_details(place_id: str) -> Dict[str, Any]:
                url = "https://maps.googleapis.com/maps/api/place/details/json"
                fields = (
                    "name,formatted_address,formatted_phone_number,international_phone_number,website,"\
                    "rating,user_ratings_total,url,types,opening_hours"
                )
                params = {"place_id": place_id, "key": GOOGLE_API_KEY, "fields": fields}
                resp = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
                resp.raise_for_status()
                return resp.json().get("result", {})

            def fetch_website_enrichment(website: str) -> Dict[str, Any]:
                enrichment: Dict[str, Any] = {"emails": [], "links": {}, "logo": None, "service_keywords": [], "recent_activity": None}
                try:
                    r = requests.get(website, timeout=REQUEST_TIMEOUT, headers={"User-Agent": "Mozilla/5.0"})
                    r.raise_for_status()
                    html = r.text
                    # Emails
                    emails = list(set(EMAIL_REGEX.findall(html)))
                    enrichment["emails"] = emails
                    # Social links
                    soup = BeautifulSoup(html, "html.parser")
                    links = {}
                    for a in soup.find_all("a", href=True):
                        href = a["href"].strip()
                        for domain in SOCIAL_DOMAINS:
                            if domain in href:
                                links[domain.split(".")[0]] = href
                    enrichment["links"] = links
                    # Logo/Image extraction
                    logo_url = None
                    for img in soup.find_all("img", src=True):
                        src = img["src"]
                        if "logo" in src.lower() or "header" in src.lower():
                            logo_url = src
                            break
                    if not logo_url:
                        imgs = IMAGE_REGEX.findall(html)
                        if imgs:
                            logo_url = imgs[0]
                    enrichment["logo"] = logo_url
                    # Service keywords extraction
                    text = soup.get_text(" ", strip=True)
                    found_keywords = set()
                    for kw in KEYWORD_SERVICE_HINTS:
                        if kw in text.lower():
                            found_keywords.add(kw)
                    if TfidfVectorizer:
                        try:
                            vectorizer = TfidfVectorizer(stop_words="english")
                            X = vectorizer.fit_transform([text])
                            features = vectorizer.get_feature_names_out()
                            scores = X.toarray()[0]
                            top_indices = scores.argsort()[-5:][::-1]
                            for idx in top_indices:
                                word = features[idx]
                                if word not in ENGLISH_STOP_WORDS and len(word) > 3:
                                    found_keywords.add(word)
                        except Exception:
                            pass
                    enrichment["service_keywords"] = list(found_keywords)
                    # Recent activity signal
                    recent = None
                    for a in soup.find_all("a", href=True):
                        href = a["href"].lower()
                        if any(x in href for x in ["blog", "news", "post", "update"]):
                            recent = href
                            break
                    enrichment["recent_activity"] = recent
                except Exception as e:
                    logging.warning(f"Website enrichment failed for {website}: {e}")
                return enrichment

            def normalize_hours(hours: Any) -> Optional[List[str]]:
                if not hours:
                    return None
                if isinstance(hours, dict) and "weekday_text" in hours:
                    return hours["weekday_text"]
                if isinstance(hours, list):
                    return [str(h) for h in hours]
                if isinstance(hours, str):
                    return [hours]
                return None

            def calc_confidence(record: Dict[str, Any]) -> int:
                score = 0
                if record.get("phone"): score += 1
                if record.get("email"): score += 2
                if record.get("website"): score += 1
                if record.get("socials", {}).get("logo"): score += 1
                if record.get("socials", {}).get("service_keywords"): score += 1
                if record.get("socials", {}).get("recent_activity"): score += 1
                if record.get("socials", {}).get("google", {}).get("rating"): score += 1
                if record.get("socials", {}).get("google", {}).get("reviews_count"): score += 1
                return score

            def build_contractor_record(city: str, basic: Dict[str, Any]) -> Dict[str, Any]:
                place_id = basic.get("place_id")
                details = google_place_details(place_id) if place_id else {}
                name = details.get("name") or basic.get("name")
                website = details.get("website")
                phone = details.get("formatted_phone_number") or details.get("international_phone_number")
                address = details.get("formatted_address") or basic.get("formatted_address")
                rating = details.get("rating")
                reviews = details.get("user_ratings_total")
                g_url = details.get("url")
                types = details.get("types")
                opening_hours = details.get("opening_hours", {})

                socials_payload: Dict[str, Any] = {
                    "google": {
                        "place_id": place_id,
                        "url": g_url,
                        "rating": rating,
                        "reviews_count": reviews,
                        "types": types,
                        "opening_hours": normalize_hours(opening_hours),
                    }
                }
                enrichment = None
                if website:
                    enrichment = fetch_website_enrichment(website)
                    socials_payload.update(enrichment)

                record = {
                    "name": name,
                    "phone": normalize_phone(phone),
                    "email": None,
                    "website": website,
                    "socials": socials_payload,
                    "logo": enrichment.get("logo") if enrichment else None,
                    "service_keywords": enrichment.get("service_keywords") if enrichment else [],
                    "recent_activity": enrichment.get("recent_activity") if enrichment else None,
                    "address": address,
                    "service_area": city,
                    "source": "google",
                    "status": "prospect",
                    "score": 0,
                    "confidence": 0,
                }
                try:
                    emails = socials_payload.get("emails", [])
                    if emails:
                        record["email"] = emails[0]
                except Exception:
                    pass
                record["confidence"] = calc_confidence(record)
                return record

            def fetch_contractors(city: str) -> List[Dict[str, Any]]:
                basics = google_text_search(city)
                contractors: List[Dict[str, Any]] = []
                for b in basics:
                    try:
                        contractors.append(build_contractor_record(city, b))
                        time.sleep(0.2)
                    except Exception as e:
                        logging.error(f"Error building record for {b.get('name')}: {e}")
                return contractors

            def insert_to_supabase(contractors: List[Dict[str, Any]]) -> int:
                inserted = 0
                for contractor in contractors:
                    try:
                        supabase.table("contractors_prospects").insert(contractor).execute()
                        inserted += 1
                        logging.info(f"Inserted: {contractor.get('name')}")
                    except Exception as e:
                        logging.error(f"Error inserting {contractor.get('name')}: {e}")
                return inserted

            if __name__ == "__main__":
                all_contractors: List[Dict[str, Any]] = []
                total_inserted = 0
                for city in CITIES:
                    contractors = fetch_contractors(city)
                    contractors = deduplicate(all_contractors, contractors)
                    all_contractors.extend(contractors)
                    total_inserted += insert_to_supabase(contractors)
                print(f"Inserted {total_inserted} enriched contractors into Supabase.")
    all_contractors: List[Dict[str, Any]] = []
    total_inserted = 0
    for city in CITIES:
        contractors = fetch_contractors(city)
        contractors = deduplicate(all_contractors, contractors)
        all_contractors.extend(contractors)
        total_inserted += insert_to_supabase(contractors)
    print(f"Inserted {total_inserted} enriched contractors into Supabase.")
