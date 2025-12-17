"""
Ollama Enricher for Lead Records

Uses a local Ollama server to enrich lead dictionaries.
Default host: http://localhost:11434, model configurable (e.g., llama3.1, mistral, qwen2.5).
"""

import os
import json
from typing import Dict, Any, Optional
import requests


def _default_host() -> str:
    return os.getenv("OLLAMA_HOST", "http://localhost:11434")


def _prompt_for_lead(lead: Dict[str, Any]) -> str:
    return (
        "You are a data enricher. Given a contractor lead JSON, respond ONLY with JSON containing: "
        "category(one of: stone_masonry, construction, general_contractor, tile, roofer, carpenter), "
        "quality_score(1-10), normalized_phone, short_profile(<=160 chars).\n\nLead: "
        + json.dumps(lead)
    )


def enrich_lead_ollama(lead: Dict[str, Any], model: str = "llama3.1", host: Optional[str] = None, timeout: int = 60) -> Dict[str, Any]:
    host = host or _default_host()
    url = f"{host}/api/generate"
    payload = {
        "model": model,
        "prompt": _prompt_for_lead(lead),
        "stream": False,
        "options": {"temperature": 0.2}
    }
    try:
        resp = requests.post(url, json=payload, timeout=timeout)
        resp.raise_for_status()
        data = resp.json()
        content = (data or {}).get("response", "").strip()
        parsed = {}
        try:
            parsed = json.loads(content)
        except Exception:
            # naive JSON extraction
            import re
            m = re.search(r"\{[\s\S]*\}", content)
            if m:
                parsed = json.loads(m.group(0))
        enriched = dict(lead)
        # basic phone normalization
        def _norm(phone: str) -> str:
            import re as _re
            if not phone:
                return ""
            d = _re.sub(r"\D", "", phone)
            if len(d) == 10:
                return f"({d[:3]}) {d[3:6]}-{d[6:]}"
            if len(d) == 11 and d.startswith("1"):
                return f"+1 ({d[1:4]}) {d[4:7]}-{d[7:]}"
            return phone
        enriched.update({
            "phone": parsed.get("normalized_phone") or _norm(lead.get("phone", "")),
            "category": parsed.get("category"),
            "quality_score": int(parsed.get("quality_score", lead.get("score", 5)) or 5),
            "profile": parsed.get("short_profile"),
            "enriched_by": f"ollama:{model}",
        })
        return enriched
    except Exception:
        # On any error, just return original lead (caller may fallback)
        enriched = dict(lead)
        enriched.setdefault("enriched_by", "ollama_error")
        return enriched
