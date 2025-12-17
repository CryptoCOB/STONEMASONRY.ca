"""
Callback module for the Contractor Lead Engine UI
"""
import json
import hashlib
import os
from typing import Dict, List, Any, Tuple, Optional
from datetime import datetime

from dash import Input, Output, State, callback_context, html, dcc
import dash_bootstrap_components as dbc

from ..data.census import (
    census_map, census_columns, pop_map, business_count_map,
    get_province_for_municipality, cluster_municipalities, municipalities
)
from ..data.database import collection, supabase, load_contractor_leads
from ..scraping.auto_scraper import (
    start_automated_scraping, stop_automated_scraping, simple_test_scraping,
    scraping_stats
)
from ..api.qa import (
    process_qa_query, enrich_contractor_with_llm, validate_social_media,
    parse_llm_response
)

def register_callbacks(app):
    """Register all callbacks with the Dash app"""
    
    # Search callback
    @app.callback(
        Output("results", "children"),
        Input("search-btn", "n_clicks"),
        State("search-box", "value"),
        State("lead-type-dropdown", "value"),
        State("batch-start", "value"),
        State("census-var-dropdown", "value"),
        State("census-var-threshold", "value"),
        State("census-province-dropdown", "value")
    )
    def search_leads(n_clicks, query, lead_type, batch_start, census_vars_selected, census_var_threshold, selected_province):
        if not n_clicks or not query:
            return "Enter a search term and click Search."
            
        batch_start = batch_start or 0
        items = []
        
        # Municipality search
        if lead_type == "municipality":
            batch_munis = cluster_municipalities[batch_start:batch_start+50]
            filtered_munis = []
            
            for m in batch_munis:
                census_vars = census_map.get(selected_province, {}) if selected_province else {}
                passed = True
                
                for var in census_vars_selected or []:
                    val = census_vars.get(var, "")
                    if census_var_threshold:
                        try:
                            if census_var_threshold.startswith('>'):
                                if float(val or 0) <= float(census_var_threshold[1:]):
                                    passed = False
                            elif census_var_threshold.startswith('<'):
                                if float(val or 0) >= float(census_var_threshold[1:]):
                                    passed = False
                        except Exception:
                            passed = False
                            
                if passed:
                    filtered_munis.append(m)
                    
            if not filtered_munis:
                filtered_munis = batch_munis
                
            # Chroma expects $in to be an operator dict, not a raw list
            if filtered_munis and isinstance(filtered_munis, list):
                where_filter = {"$and": [
                    {"name": {"$in": filtered_munis}},
                    {"type": {"$eq": "municipality"}}
                ]}
            else:
                where_filter = {"type": {"$eq": "municipality"}}
                
            query_kwargs = {"query_texts": [query], "n_results": 50, "where": where_filter}
            
            try:
                results = collection.query(**query_kwargs)
            except Exception as e:
                return dbc.Alert(f"[Error] Chroma query failed: {e}", color="danger")
                
            docs = results.get("documents", [])
            metas = results.get("metadatas", [])
            
            if docs and isinstance(docs[0], list):
                docs = docs[0]
            if metas and isinstance(metas[0], list):
                metas = metas[0]
                
            for doc, meta in zip(docs, metas):
                name = meta.get("name", "Unknown")
                pop = pop_map.get(name, "N/A")
                business_count = business_count_map.get(name, "N/A")
                province = selected_province or "(select in dropdown)"
                census_vars = census_map.get(selected_province, {}) if selected_province else {}
                
                try:
                    # Unified scoring: blend census, OSM, and business signals
                    prompt = (
                        f"Lead scoring for contractor acquisition in {name} (Canada):\n"
                        f"Population: {pop}\n"
                        f"Business count: {business_count}\n"
                        f"Province: {province}\n"
                        f"Key census: {str(census_vars)[:300]}\n"
                        f"OSM density: {business_count}\n"
                        f"Consider economic activity, construction signals, and local business density.\n"
                        f"Return a score 1-10 and a short rationale."
                    )
                    
                    response = ollama.generate(model=OLLAMA_MODEL, prompt=prompt)
                    score, rationale = parse_llm_response(response["response"])
                    
                    census_display = html.Details([
                        html.Summary("Census Variables"),
                        html.Ul([html.Li(f"{col}: {census_vars.get(col, '')}") for col in census_columns[:20]])
                    ]) if census_vars else html.P("No census data.")
                    
                    muni_option_value = json.dumps({
                        "type": "municipality",
                        "name": name,
                        "province": province,
                        "score": score,
                        "rationale": rationale
                    })
                    
                    items.append(dbc.Card([
                        dbc.CardHeader(name, className="fw-bold"),
                        dbc.CardBody([
                            dbc.Row([
                                dbc.Col([
                                    html.P(f"Population: {pop}"),
                                    html.P(f"Business count: {business_count}"),
                                    html.P(f"Province: {province}"),
                                ], width=6),
                                dbc.Col([
                                    html.P([
                                        html.Span("Score: ", className="fw-bold"),
                                        html.Span(f"{score}/10", className=f"badge bg-{'success' if score >= 7 else 'warning' if score >= 5 else 'danger'}")
                                    ]),
                                    html.P(f"Rationale: {rationale}"),
                                    dcc.Checklist(
                                        options=[{"label": "Approve", "value": muni_option_value}],
                                        id={"type": "approve", "index": name},
                                        className="mt-2"
                                    )
                                ], width=6)
                            ]),
                            html.Hr(),
                            census_display
                        ])
                    ], className="mb-3"))
                    
                except Exception as e:
                    items.append(dbc.Card([
                        dbc.CardHeader(name, className="fw-bold"),
                        dbc.CardBody([
                            html.P(f"Population: {pop}"),
                            html.P(f"Business count: {business_count}"),
                            html.P(f"Province: {province}"),
                            dbc.Alert(f"LLM enrichment failed: {e}", color="danger")
                        ])
                    ], className="mb-3"))
                    
        # Contractor/business search
        elif lead_type == "contractor":
            # Query Chroma for contractor/business leads
            where_filter = {"type": {"$eq": "contractor"}}
            query_kwargs = {"query_texts": [query], "n_results": 50, "where": where_filter}
            
            try:
                results = collection.query(**query_kwargs)
            except Exception as e:
                return dbc.Alert(f"[Error] Chroma query failed: {e}", color="danger")
                
            docs = results.get("documents", [])
            metas = results.get("metadatas", [])
            
            if docs and isinstance(docs[0], list):
                docs = docs[0]
            if metas and isinstance(metas[0], list):
                metas = metas[0]
                
            for doc, meta in zip(docs, metas):
                name = meta.get("name", "Unknown")
                phone = meta.get("phone", "")
                email = meta.get("email", "")
                website = meta.get("website", "")
                socials = meta.get("socials", "")
                address = meta.get("address", "N/A")
                service_area = meta.get("service_area", "N/A")
                score = meta.get("score", 0)
                
                # Only show actionable leads
                if not (phone or email or website or socials):
                    continue
                    
                try:
                    # Enrich with LLM
                    enrich = enrich_contractor_with_llm({
                        "name": name,
                        "phone": phone,
                        "email": email,
                        "website": website,
                        "address": address,
                        "service_area": service_area,
                    })
                    
                    contractor_option_value = json.dumps({
                        "type": "contractor",
                        "name": name,
                        "service_area": service_area,
                        "phone": phone,
                        "email": email,
                        "website": website,
                        "address": address,
                        "score": enrich.get("score", score),
                        "rationale": enrich.get("rationale", ""),
                        "job_types": enrich.get("job_types", []),
                        "est_revenue_low": enrich.get("est_revenue_low", 0),
                        "est_revenue_high": enrich.get("est_revenue_high", 0),
                        "pitch": enrich.get("pitch", "")
                    })
                    
                    items.append(dbc.Card([
                        dbc.CardHeader(name, className="fw-bold"),
                        dbc.CardBody([
                            dbc.Row([
                                dbc.Col([
                                    html.P([html.Span("Phone: ", className="fw-bold"), phone]),
                                    html.P([html.Span("Email: ", className="fw-bold"), email]),
                                    html.P([html.Span("Website: ", className="fw-bold"), 
                                            html.A(website, href=website, target="_blank") if website else ""]),
                                    html.P([html.Span("Address: ", className="fw-bold"), address]),
                                    html.P([html.Span("Service Area: ", className="fw-bold"), service_area])
                                ], width=6),
                                dbc.Col([
                                    html.P([
                                        html.Span("Score: ", className="fw-bold"),
                                        html.Span(f"{enrich.get('score', score)}/10", 
                                                className=f"badge bg-{'success' if enrich.get('score', score) >= 7 else 'warning' if enrich.get('score', score) >= 5 else 'danger'}")
                                    ]),
                                    html.P([html.Span("Job Types: ", className="fw-bold"), ", ".join(enrich.get("job_types", []))]),
                                    html.P([html.Span("Est. Revenue (CAD): ", className="fw-bold"), 
                                            f"${enrich.get('est_revenue_low', 0):,} - ${enrich.get('est_revenue_high', 0):,}"]),
                                    dcc.Checklist(
                                        options=[{"label": "Approve", "value": contractor_option_value}],
                                        id={"type": "approve", "index": name},
                                        className="mt-2"
                                    )
                                ], width=6)
                            ]),
                            html.Hr(),
                            html.P([html.Span("Pitch: ", className="fw-bold"), enrich.get("pitch", "")])
                        ])
                    ], className="mb-3"))
                    
                except Exception as e:
                    items.append(dbc.Card([
                        dbc.CardHeader(name, className="fw-bold"),
                        dbc.CardBody([
                            html.P(f"Phone: {phone}"),
                            html.P(f"Email: {email}"),
                            html.P(f"Website: {website}"),
                            html.P(f"Address: {address}"),
                            html.P(f"Service Area: {service_area}"),
                            dbc.Alert(f"LLM enrichment failed: {e}", color="danger")
                        ])
                    ], className="mb-3"))
                    
        if not items:
            return dbc.Alert("No results found for query.", color="warning")
            
        return items

    # Push to Supabase callback
    @app.callback(
        Output("push-status", "children"),
        Input("push-btn", "n_clicks"),
        State("results", "children")
    )
    def push_to_supabase(n_clicks, results):
        if not n_clicks or not results:
            return ""
            
        # Collect approved selections (JSON)
        approved = []
        for item in results:
            try:
                checklist = item["props"]["children"][1]["props"]["children"][1]["props"]["children"][1]["props"]["children"][3]
                if checklist["props"]["value"]:
                    approved.extend(checklist["props"]["value"])
            except Exception:
                continue
                
        # Push to Supabase
        # Hash/save mechanism: mark municipalities as added to RAG
        rag_hash_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "rag_added.txt")
        
        try:
            with open(rag_hash_file, "r", encoding="utf-8") as f:
                already_added = set(line.strip() for line in f if line.strip())
        except Exception:
            already_added = set()
            
        new_added = []
        
        for token in approved:
            try:
                data = json.loads(token)
            except Exception:
                data = {"type": "municipality", "name": token}
                
            key = f"{data.get('type')}|{data.get('name')}"
            name_hash = hashlib.sha256(key.encode()).hexdigest()
            
            if name_hash in already_added:
                continue  # Skip duplicates
                
            if data.get("type") == "contractor":
                record = {
                    "name": data.get("name"),
                    "phone": data.get("phone"),
                    "email": data.get("email"),
                    "website": data.get("website"),
                    "address": data.get("address"),
                    "service_area": data.get("service_area"),
                    "source": "dash_enriched",
                    "status": "prospect",
                    "score": data.get("score", 0),
                    "service_keywords": ", ".join(data.get("job_types", [])) or None,
                    "recent_activity": data.get("pitch", None),
                }
                supabase.table("contractors_prospects").insert(record).execute()
            else:
                name = data.get("name")
                record = {
                    "name": name,
                    "phone": None,
                    "email": None,
                    "website": None,
                    "socials": None,
                    "logo": None,
                    "service_keywords": None,
                    "recent_activity": data.get("rationale"),
                    "address": None,
                    "service_area": name,
                    "source": "dash_geo",
                    "status": "prospect",
                    "score": data.get("score", 0),
                    "confidence": 0
                }
                supabase.table("contractors_prospects").insert(record).execute()
                
            new_added.append(name_hash)
            
        # Save new hashes
        if new_added:
            with open(rag_hash_file, "a", encoding="utf-8") as f:
                for h in new_added:
                    f.write(h + "\n")
                    
        return dbc.Alert(
            f"Pushed {len(new_added)} new leads to Supabase. (Duplicates skipped)",
            color="success" if new_added else "warning",
            className="mt-3"
        )

    # Census table callback
    @app.callback(
        Output("census-table", "children"),
        [Input("census-table-province", "value"), Input("census-table-var", "value")]
    )
    def census_table_callback(selected_province, selected_var):
        if not selected_province:
            return "Select a province/territory."
            
        try:
            # Filter municipalities by province
            rows = []
            for m in municipalities:
                prov = get_province_for_municipality(m)
                if prov != selected_province:
                    continue
                    
                census_vars = census_map.get(prov, {})
                pop = pop_map.get(m, "N/A")
                val = census_vars.get(selected_var, "N/A") if selected_var else "N/A"
                
                rows.append({"Municipality": m, "Province": prov, "Population": pop, selected_var or "Census": val})
                
            # Sort by population descending
            rows = sorted(rows, key=lambda r: int(r["Population"]) if str(r["Population"]).isdigit() else 0, reverse=True)
            
            # Show top 20
            rows = rows[:20]
            
            if not rows:
                return dbc.Alert("No municipalities found for selection.", color="warning")
                
            header = [html.Th(col) for col in rows[0].keys()]
            body = [html.Tr([html.Td(r[col]) for col in rows[0].keys()]) for r in rows]
            
            return dbc.Table([
                html.Thead(html.Tr(header)),
                html.Tbody(body)
            ], striped=True, bordered=True, hover=True, responsive=True, className="small")
            
        except Exception as e:
            return dbc.Alert(f"Census table failed: {e}", color="danger")

    # QA callback
    @app.callback(
        [Output("qa-answer", "children"), Output("qa-graph", "elements"), Output("qa-status", "children"), Output("qa-leads-table", "children")],
        Input("qa-btn", "n_clicks"),
        State("qa-input", "value")
    )
    def qa_callback(n_clicks, question):
        if not n_clicks or not question:
            return "Enter a question and click Ask.", [], "", ""
            
        try:
            # Query Chroma for top relevant entities
            results = collection.query(query_texts=[question], n_results=10)
            docs = results.get("documents", [])
            metas = results.get("metadatas", [])
            
            if docs and isinstance(docs[0], list):
                docs = docs[0]
            if metas and isinstance(metas[0], list):
                metas = metas[0]
                
            # Build enhanced context
            enriched_context = []
            
            for meta in metas:
                t = meta.get("type", "unknown")
                name = meta.get("name", "Unknown")
                
                if t == "municipality":
                    prov = get_province_for_municipality(name)
                    census_vars = census_map.get(prov, {})
                    pop = pop_map.get(name, "N/A")
                    business_count = business_count_map.get(name, "N/A")
                    enriched_context.append(f"Municipality: {name}, Province: {prov}, Population: {pop}, Business Count: {business_count}, Census: {str(census_vars)[:200]}")
                    
                elif t == "contractor":
                    social_score, social_details = validate_social_media(meta.get("website", ""), meta.get("socials", ""))
                    enriched_context.append(f"Contractor: {name}, Service Area: {meta.get('service_area', '')}, Phone: {meta.get('phone', '')}, Email: {meta.get('email', '')}, Website: {meta.get('website', '')}, Social Score: {social_score}")
            
            context = "\n".join(enriched_context)
            answer = process_qa_query(question, context)
            
            # Build graph
            elements = []
            province_nodes_added = set()
            actionable_to_push = []
            
            for meta in metas:
                t = meta.get("type", "unknown")
                name = meta.get("name", "Unknown")
                
                if t == "municipality":
                    prov = get_province_for_municipality(name)
                    if prov and prov not in province_nodes_added:
                        elements.append({"data": {"id": f"prov:{prov}", "label": prov, "type": "province", "tooltip": f"Province: {prov}"}})
                        province_nodes_added.add(prov)
                        
                    pop = pop_map.get(name, "N/A")
                    elements.append({"data": {"id": f"muni:{name}", "label": f"{name}\n({pop})", "type": "municipality", "tooltip": f"Municipality: {name}\nPopulation: {pop}\nProvince: {prov}"}})
                    
                    if prov:
                        elements.append({"data": {"id": f"edge:prov:{prov}->muni:{name}", "source": f"prov:{prov}", "target": f"muni:{name}"}})
                        
                    actionable_to_push.append({
                        "name": name, "type": "municipality", "province": prov,
                        "score": meta.get("score", 0), "rationale": meta.get("rationale", "")
                    })
                    
                elif t == "contractor":
                    social_score, social_details = validate_social_media(meta.get("website", ""), meta.get("socials", ""))
                    tooltip = f"Contractor: {name}\nPhone: {meta.get('phone', '')}\nEmail: {meta.get('email', '')}\nSocial Score: {social_score}"
                    elements.append({"data": {"id": f"contractor:{name}", "label": name, "type": "contractor", "tooltip": tooltip}})
                    
                    sa = (meta.get("service_area") or "").strip()
                    if sa:
                        elements.append({"data": {"id": f"edge:contractor:{name}->muni:{sa}", "source": f"contractor:{name}", "target": f"muni:{sa}"}})
                        
                    actionable_to_push.append({
                        "name": name, "type": "contractor", "service_area": sa,
                        "phone": meta.get("phone", ""), "email": meta.get("email", ""),
                        "website": meta.get("website", ""), "score": meta.get("score", 0),
                        "social_score": social_score, "social_details": str(social_details)
                    })
            
            # Auto-push with deduplication
            unique = {}
            for item in actionable_to_push:
                key = f"{item.get('type','')}-{item.get('name','')}"
                if key not in unique and (item.get("phone") or item.get("email") or item.get("website") or item.get("type") == "municipality"):
                    clean = {k: v for k, v in item.items() if k in ["name","type","province","service_area","phone","email","website","score","rationale","social_score"]}
                    unique[key] = clean
            
            batch = list(unique.values())
            pushed = 0
            audit_log = []
            
            # Batch insert with audit trail
            for item in batch:
                try:
                    supabase.table("contractors_prospects").insert(item).execute()
                    pushed += 1
                    audit_log.append(f"✓ Pushed: {item['type']} - {item['name']}")
                except Exception as e:
                    audit_log.append(f"✗ Skipped: {item.get('type','')} - {item.get('name','')} ({str(e)[:50]})")
            
            # Build leads table
            table_rows = []
            for meta in metas:
                name = meta.get("name", "Unknown")
                t = meta.get("type", "unknown")
                
                if t == "municipality":
                    prov = get_province_for_municipality(name)
                    census_vars = census_map.get(prov, {})
                    pop = pop_map.get(name, "N/A")
                    business_count = business_count_map.get(name, "N/A")
                    
                    table_rows.append({
                        "Name": name, "Type": "Municipality", "Province": prov, 
                        "Population": pop, "Business Count": business_count,
                        "Income": str(census_vars.get("Total - Household total income groups in 2020 for private households - 100% data", "N/A"))[:50],
                        "Score": meta.get("score", 0)
                    })
                    
                elif t == "contractor":
                    social_score, social_details = validate_social_media(meta.get("website", ""), meta.get("socials", ""))
                    
                    table_rows.append({
                        "Name": name, "Type": "Contractor", "Service Area": meta.get("service_area", "N/A"),
                        "Phone": meta.get("phone", ""), "Email": meta.get("email", ""),
                        "Website": meta.get("website", ""), "Social Score": social_score,
                        "Revenue Est": f"${meta.get('est_revenue_low', 0):,}-${meta.get('est_revenue_high', 0):,}"
                    })
            
            # Create enhanced table
            if table_rows:
                header = [html.Th(col, style={"backgroundColor": "#f2f2f2"}) for col in table_rows[0].keys()]
                body_rows = []
                
                for row in table_rows:
                    cells = [html.Td(str(row[col])[:100]) for col in row.keys()]
                    body_rows.append(html.Tr(cells))
                    
                leads_table = dbc.Table([
                    html.Thead(html.Tr(header)),
                    html.Tbody(body_rows)
                ], striped=True, bordered=True, hover=True, responsive=True, className="small")
                
            else:
                leads_table = dbc.Alert("No leads found.", color="warning")
            
            status_msg = f"🚀 Auto-pushed {pushed} actionable leads to Supabase and RAG. Found {len(table_rows)} total matches." if pushed else f"📊 Found {len(table_rows)} matches. No new leads to push."
            
            # Return answer, graph, status, and leads table
            return html.Div([
                html.H5("Answer:"),
                html.P(answer)
            ]), elements, status_msg, leads_table
            
        except Exception as e:
            return dbc.Alert(f"QA failed: {e}", color="danger"), [], f"❌ Error occurred: {e}", dbc.Alert("Error loading data.", color="danger")

    # Graph callback
    @app.callback(
        Output("rag-graph", "elements"),
        Input("refresh-graph-btn", "n_clicks"),
        State("lead-type-dropdown", "value"),
        State("batch-start", "value"),
        State("census-province-dropdown", "value"),
    )
    def build_graph(n_clicks, lead_type, batch_start, selected_province):
        if not n_clicks:
            return []
            
        try:
            elements = []
            batch_start = batch_start or 0

            # Limit graph size for performance
            max_munis = 50
            max_contractors = 150

            # Nodes: provinces, municipalities, contractors
            province_nodes_added = set()

            # Municipalities
            batch_munis = cluster_municipalities[batch_start:batch_start+max_munis]
            for m in batch_munis:
                prov = selected_province or get_province_for_municipality(m)
                if prov and prov not in province_nodes_added:
                    elements.append({"data": {"id": f"prov:{prov}", "label": prov, "type": "province"}})
                    province_nodes_added.add(prov)
                elements.append({"data": {"id": f"muni:{m}", "label": f"{m}\n(pop: {pop_map.get(m, 'N/A')})", "type": "municipality"}})
                if prov:
                    elements.append({"data": {"id": f"edge:prov:{prov}->muni:{m}", "source": f"prov:{prov}", "target": f"muni:{m}"}})

            # Contractors: get actionable ones and connect if service_area matches a municipality name
            actionable_contractors = load_contractor_leads()[:max_contractors]
            muni_set = set(batch_munis)
            for c in actionable_contractors:
                name = c.get("name") or "Unknown"
                cid = f"contractor:{name}"
                elements.append({
                    "data": {"id": cid, "label": name, "type": "contractor"}
                })
                sa = (c.get("service_area") or "").strip()
                if sa in muni_set:
                    elements.append({"data": {"id": f"edge:{cid}->muni:{sa}", "source": cid, "target": f"muni:{sa}"}})

            return elements
        except Exception as e:
            print(f"[Error] Graph build failed: {e}")
            # If anything fails, return empty graph
            return []

    # Automated scraping callbacks
    @app.callback(
        Output("scrape-status", "children"),
        [Input("start-scrape-btn", "n_clicks"), Input("stop-scrape-btn", "n_clicks"), Input("refresh-scrape-btn", "n_clicks")]
    )
    def handle_scraping_controls(start_clicks, stop_clicks, refresh_clicks):
        global scraping_stats
        
        try:
            # Determine which button was clicked
            ctx = callback_context
            if not ctx.triggered:
                # Initial load - show current status
                if scraping_stats["running"]:
                    return f"🟢 Running | Last: {scraping_stats.get('last_run', 'Never')} | Total: {scraping_stats['total_scraped']} contractors | Cities: {scraping_stats['cities_processed']}"
                else:
                    return "🔴 Stopped | Ready to start automated business discovery"
            
            button_id = ctx.triggered[0]["prop_id"].split(".")[0]
            
            if button_id == "start-scrape-btn" and start_clicks:
                result = start_automated_scraping()
                return f"🟢 {result} | Total: {scraping_stats['total_scraped']} contractors | Cities: {scraping_stats['cities_processed']}"
            
            elif button_id == "stop-scrape-btn" and stop_clicks:
                result = stop_automated_scraping()
                return f"🔴 {result} | Final Total: {scraping_stats['total_scraped']} contractors | Cities: {scraping_stats['cities_processed']}"
            
            elif button_id == "refresh-scrape-btn" and refresh_clicks:
                # Show detailed stats
                status = "🟢 Running" if scraping_stats["running"] else "🔴 Stopped"
                next_city = cluster_municipalities[scraping_stats["next_city_index"]] if scraping_stats["next_city_index"] < len(cluster_municipalities) else "Cycle complete"
                errors_info = f" | Errors: {len(scraping_stats['errors'])}" if scraping_stats["errors"] else ""
                return f"{status} | Next: {next_city} | Total: {scraping_stats['total_scraped']} contractors | Cities: {scraping_stats['cities_processed']}{errors_info}"
            
            # Default status
            return "🔴 Ready to start automated business discovery"
            
        except Exception as e:
            return f"❌ Error: {str(e)[:100]}"

    # Test scraping callback
    @app.callback(
        Output("test-scrape-status", "children"),
        Input("test-scrape-btn", "n_clicks")
    )
    def handle_test_scraping(n_clicks):
        if not n_clicks:
            return "Click to test scraping"
        return simple_test_scraping()

    # CSV export callback
    @app.callback(
        Output("download-csv", "data"),
        Input("export-csv-btn", "n_clicks"),
        State("qa-leads-table", "children")
    )
    def export_csv(n_clicks, table):
        if not n_clicks or not table:
            return None
            
        try:
            # Extract table data
            headers = [th["props"]["children"] for th in table["props"]["children"][0]["props"]["children"][0]["props"]["children"]]
            rows = []
            
            for tr in table["props"]["children"][1]["props"]["children"]:
                row = [td["props"]["children"] for td in tr["props"]["children"]]
                rows.append(dict(zip(headers, row)))
            
            # Create CSV
            import pandas as pd
            from io import StringIO
            
            df = pd.DataFrame(rows)
            csv_string = df.to_csv(index=False)
            
            return dict(
                content=csv_string,
                filename=f"leads_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                type="text/csv"
            )
            
        except Exception as e:
            print(f"[Error] CSV export failed: {e}")
            return None