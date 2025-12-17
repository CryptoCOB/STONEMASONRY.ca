"""
API module for LLM enrichment and QA
"""
import re
import json
from typing import Dict, List, Any, Tuple, Union

# Try to import Ollama, but provide fallback if not available
try:
    from ollama import Client as OllamaClient
    from ..utils.config import OLLAMA_MODEL
    
    # Initialize Ollama client
    ollama = OllamaClient()
    OLLAMA_AVAILABLE = True
    print("[Info] Ollama client initialized successfully")
except (ImportError, Exception) as e:
    print(f"[Warning] Ollama not available: {e}")
    print("[Warning] Using simulated LLM responses")
    ollama = None
    OLLAMA_MODEL = "llama3"
    OLLAMA_AVAILABLE = False

def parse_llm_response(text: str) -> Tuple[int, str]:
    """Simple parser for LLM output"""
    match = re.search(r"score\s*[:=]\s*(\d+)", text, re.I)
    score = int(match.group(1)) if match else 5
    rationale = text
    return score, rationale

def validate_social_media(website: str, socials: str) -> Tuple[int, Dict[str, str]]:
    """Enhanced social media background check"""
    social_score = 0
    social_details = {}
    try:
        if website:
            social_score += 3
            social_details["website"] = "active"
        if socials:
            platforms = socials.lower()
            if "facebook" in platforms: 
                social_score += 2
                social_details["facebook"] = "present"
            if "instagram" in platforms: 
                social_score += 2
                social_details["instagram"] = "present"
            if "linkedin" in platforms: 
                social_score += 3
                social_details["linkedin"] = "present"
        return social_score, social_details
    except Exception:
        return 0, {}

def enrich_contractor_with_llm(meta: Dict[str, Any]) -> Dict[str, Any]:
    """Enrich contractor data with LLM analysis"""
    name = meta.get("name", "Unknown")
    service_area = meta.get("service_area", "Unknown")
    phone = meta.get("phone", "")
    email = meta.get("email", "")
    website = meta.get("website", "")
    address = meta.get("address", "")
    
    # Return simulated data if Ollama is not available
    if not OLLAMA_AVAILABLE:
        # Generate a score based on available contact info
        score = 5  # Base score
        if phone: score += 1
        if email: score += 1
        if website: score += 2
        if address and len(address) > 10: score += 1
        
        return {
            "job_types": ["masonry", "stonework", "facade"],
            "est_revenue_low": 50000,
            "est_revenue_high": 200000,
            "pitch": f"[Simulated] {name} in {service_area} could be a valuable partner for our stonework projects. They have established presence in the area and their services align with our offering.",
            "score": min(score, 10),
            "rationale": f"[Simulated] {name} appears to be an established contractor with good market presence."
        }
    
    prompt = (
        f"You are a lead analyst for a stonemasonry company.\n"
        f"Business: {name}\nService Area: {service_area}\nPhone: {phone}\nEmail: {email}\nWebsite: {website}\nAddress: {address}\n"
        f"Tasks: 1) Classify likely job types we could sell (e.g., fireplace, facade, patio, restoration).\n"
        f"2) Estimate potential deal size range in CAD (low-high).\n"
        f"3) Draft a one-paragraph personalized pitch for first contact.\n"
        f"Return JSON with keys: job_types (array of strings), est_revenue_low (number), est_revenue_high (number), pitch (string), score (1-10), rationale (string)."
    )
    try:
        resp = ollama.generate(model=OLLAMA_MODEL, prompt=prompt)
        text = resp.get("response", "{}")
        try:
            data = json.loads(text)
        except Exception:
            data = {
                "job_types": [],
                "est_revenue_low": 0,
                "est_revenue_high": 0,
                "pitch": text[:500],
                "score": 5,
                "rationale": text[:500]
            }
        return data
    except Exception as e:
        return {
            "job_types": [],
            "est_revenue_low": 0,
            "est_revenue_high": 0,
            "pitch": f"LLM enrichment failed: {e}",
            "score": 0,
            "rationale": ""
        }

def process_qa_query(question: str, context: str) -> str:
    """Process a natural language query with RAG context"""
    try:
        if not OLLAMA_AVAILABLE:
            # Provide a simulated response if Ollama is not available
            return (
                f"[Simulated Answer] Based on your query: '{question}'\n\n"
                f"The context provided contains information about {context.count('Municipality') + context.count('Contractor')} entities. "
                f"This would be analyzed to provide insights about lead quality, market opportunities, and demographics.\n\n"
                f"In a real scenario, the LLM would generate a comprehensive response with specific recommendations."
            )
            
        prompt = (
            f"You are an advanced RAG QA assistant for a Canadian contractor acquisition engine with census and business intelligence.\n"
            f"Context:\n{context}\n"
            f"Question: {question}\n"
            f"Provide a comprehensive answer with specific insights about lead quality, market opportunities, census demographics, and actionable recommendations."
        )
        resp = ollama.generate(model=OLLAMA_MODEL, prompt=prompt)
        return resp.get("response", "No answer found.")
    except Exception as e:
        return f"[Error] QA processing failed: {e}"