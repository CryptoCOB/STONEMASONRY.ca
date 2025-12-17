"""
Central enrichment selector

Chooses between OpenAI, Ollama, or heuristic enrichment based on config and env.
"""

import os
import json
from typing import Dict, Any

try:
    from .llm_enricher import enrich_lead as openai_enrich
except Exception:
    openai_enrich = None

try:
    from .ollama_enricher import enrich_lead_ollama
except Exception:
    enrich_lead_ollama = None


def _load_config(config_path: str) -> Dict[str, Any]:
    try:
        if os.path.exists(config_path):
            with open(config_path, "r") as f:
                return json.load(f)
    except Exception:
        pass
    return {}


def enrich_lead_with_selector(lead: Dict[str, Any], config_path: str) -> Dict[str, Any]:
    cfg = _load_config(config_path)
    provider = (cfg.get("enrichment_provider") or "heuristic").lower()

    if provider == "openai" and openai_enrich and os.getenv("OPENAI_API_KEY"):
        return openai_enrich(lead)

    if provider == "ollama" and enrich_lead_ollama:
        model = cfg.get("ollama_model", "llama3.1")
        host = os.getenv("OLLAMA_HOST") or cfg.get("ollama_host")
        return enrich_lead_ollama(lead, model=model, host=host)

    # fallback heuristic via llm_enricher (it contains heuristic internally)
    if openai_enrich:
        return openai_enrich(lead)
    return lead
