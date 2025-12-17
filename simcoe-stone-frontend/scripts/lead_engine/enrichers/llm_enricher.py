"""
LLM Enricher for Lead Records

Enriches lead dictionaries by:
- Normalizing/validating fields
- Inferring categories and quality score
- Summarizing a short profile

Uses OpenAI if `OPENAI_API_KEY` is set; otherwise, uses heuristic enrichment.
"""

import os
import re
from typing import Dict, Any


def _normalize_phone(phone: str) -> str:
    if not phone:
        return ""
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    if len(digits) == 11 and digits.startswith("1"):
        return f"+1 ({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
    return phone


def _heuristic_enrich(lead: Dict[str, Any]) -> Dict[str, Any]:
    enriched = dict(lead)
    name = (lead.get("name") or "").strip()
    website = (lead.get("website") or "").strip()
    phone = _normalize_phone(lead.get("phone", ""))

    craft_type = lead.get("craft_type") or ""
    category = "stone_masonry" if "stone" in name.lower() or "stone" in craft_type.lower() else (
        "construction" if "construction" in craft_type.lower() else "general_contractor"
    )

    score = lead.get("score", 5)
    if phone:
        score += 1
    if website:
        score += 1
    if any(k in (lead.get("email") or "") for k in ["@gmail.com", "@outlook.com", "@yahoo.com"]):
        score += 0  # neutral
    score = int(max(1, min(10, score)))

    enriched.update({
        "phone": phone,
        "category": category,
        "quality_score": score,
        "profile": f"{name} provides {category.replace('_',' ')} services in {lead.get('service_area','Unknown')}.",
        "enriched_by": "heuristic",
    })
    return enriched


def _openai_enrich(lead: Dict[str, Any]) -> Dict[str, Any]:
    # Lazy import to avoid hard dependency
    import json
    try:
        from openai import OpenAI
    except Exception:
        return _heuristic_enrich(lead)

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return _heuristic_enrich(lead)

    client = OpenAI(api_key=api_key)
    prompt = (
        "You are a data enricher. Given a contractor lead JSON, return a compact JSON with fields: "
        "category(one of: stone_masonry, construction, general_contractor, tile, roofer, carpenter), "
        "quality_score(1-10), normalized_phone, short_profile(<=160 chars).\n\nLead: "
        + json.dumps(lead)
    )

    try:
        resp = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        content = resp.choices[0].message.content.strip()
        data = {}
        try:
            data = json.loads(content)
        except Exception:
            # fallback if model returned prose; try to extract JSON
            import re as _re
            m = _re.search(r"\{[\s\S]*\}", content)
            if m:
                data = json.loads(m.group(0))
        enriched = dict(lead)
        enriched.update({
            "phone": data.get("normalized_phone") or _normalize_phone(lead.get("phone", "")),
            "category": data.get("category"),
            "quality_score": int(data.get("quality_score", lead.get("score", 5)) or 5),
            "profile": data.get("short_profile"),
            "enriched_by": "openai",
        })
        return enriched
    except Exception:
        return _heuristic_enrich(lead)


def enrich_lead(lead: Dict[str, Any]) -> Dict[str, Any]:
    """Enrich a single lead using OpenAI if available, else heuristic."""
    if os.getenv("OPENAI_API_KEY"):
        return _openai_enrich(lead)
    return _heuristic_enrich(lead)
