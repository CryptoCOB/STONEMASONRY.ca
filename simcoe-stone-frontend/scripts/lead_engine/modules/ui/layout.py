"""
Main UI layout module for the Contractor Lead Engine
"""
import os
from dash import Dash, html, dcc
import dash_bootstrap_components as dbc
import dash_cytoscape as cyto

from ..data.census import census_columns, census_map

# Initialize the Dash app with Bootstrap
app = Dash(
    __name__,
    external_stylesheets=[dbc.themes.BOOTSTRAP],
    assets_folder=os.path.join(os.path.dirname(__file__), "assets")
)

# App layout with Bootstrap components
app.layout = dbc.Container([
    # Header
    dbc.Row([
        dbc.Col([
            html.Div([
                html.H1("Contractor Lead Engine", className="mb-0"),
                html.P("Municipalities & Business Discovery Dashboard", className="text-muted")
            ], className="app-header")
        ])
    ]),
    
    # Search Panel
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardHeader("Search & Filter", className="fw-bold"),
                dbc.CardBody([
                    dbc.Row([
                        dbc.Col([
                            html.Label("Lead Type:"),
                            dcc.Dropdown(
                                id="lead-type-dropdown",
                                options=[
                                    {"label": "Municipality", "value": "municipality"},
                                    {"label": "Contractor/Business", "value": "contractor"}
                                ],
                                value="municipality",
                                clearable=False,
                                className="mb-3"
                            ),
                            html.Label("Search Query:"),
                            dbc.Input(id="search-box", type="text", placeholder="Search...", className="mb-3"),
                            html.Label("Batch Start Index:"),
                            dbc.Input(id="batch-start", type="number", value=0, min=0, step=50, className="mb-3")
                        ], width=6),
                        dbc.Col([
                            html.Label("Filter by Census Variable (municipality only):"),
                            dcc.Dropdown(
                                id="census-var-dropdown",
                                options=[{"label": col, "value": col} for col in census_columns[:50]],
                                multi=True,
                                placeholder="Select census variables to filter...",
                                className="mb-3"
                            ),
                            html.Label("Threshold:"),
                            dbc.Input(id="census-var-threshold", type="text", placeholder="Threshold (e.g. >100000)", className="mb-3"),
                            html.Label("Province/Territory:"),
                            dcc.Dropdown(
                                id="census-province-dropdown",
                                options=[{"label": p, "value": p} for p in sorted(census_map.keys())],
                                placeholder="Select a province/territory",
                                className="mb-3"
                            )
                        ], width=6)
                    ]),
                    dbc.Button("Search", id="search-btn", color="primary", className="mt-2"),
                    dbc.Button("Push Approved to Supabase", id="push-btn", color="success", className="mt-2 ms-2"),
                    html.Div(id="push-status", className="mt-3 text-muted")
                ])
            ], className="mb-4")
        ])
    ]),
    
    # Results Panel
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardHeader("Search Results", className="fw-bold"),
                dbc.CardBody([
                    dcc.Loading(
                        id="loading-results",
                        type="default",
                        children=html.Div(id="results", className="results-container")
                    )
                ])
            ], className="mb-4")
        ])
    ]),
    
    # Graph Panel
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardHeader("RAG Graph Visualization", className="fw-bold"),
                dbc.CardBody([
                    html.P("Visualize how provinces, municipalities, and contractors connect."),
                    dbc.Button("Refresh Graph", id="refresh-graph-btn", color="info", className="mb-3"),
                    cyto.Cytoscape(
                        id="rag-graph",
                        layout={"name": "cose", "animate": False},
                        style={"width": "100%", "height": "600px", "border": "1px solid #ddd"},
                        elements=[],
                        stylesheet=[
                            {"selector": "node", "style": {"label": "data(label)", "font-size": 10, "text-valign": "center", "text-halign": "center"}},
                            {"selector": "node[type='province']", "style": {"background-color": "#1f77b4", "shape": "round-rectangle"}},
                            {"selector": "node[type='municipality']", "style": {"background-color": "#2ca02c"}},
                            {"selector": "node[type='contractor']", "style": {"background-color": "#ff7f0e", "shape": "triangle"}},
                            {"selector": "edge", "style": {"line-color": "#bbb", "width": 2, "curve-style": "bezier", "target-arrow-shape": "triangle", "target-arrow-color": "#bbb"}},
                        ]
                    )
                ])
            ], className="mb-4")
        ])
    ]),
    
    # Census Data Panel
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardHeader("Census Data Summary", className="fw-bold"),
                dbc.CardBody([
                    dbc.Row([
                        dbc.Col([
                            html.Label("Province/Territory:"),
                            dcc.Dropdown(
                                id="census-table-province",
                                options=[{"label": p, "value": p} for p in sorted(census_map.keys())],
                                placeholder="Select province/territory",
                                className="mb-3"
                            )
                        ], width=6),
                        dbc.Col([
                            html.Label("Census Variable:"),
                            dcc.Dropdown(
                                id="census-table-var",
                                options=[{"label": col, "value": col} for col in census_columns],
                                placeholder="Select census variable",
                                className="mb-3"
                            )
                        ], width=6)
                    ]),
                    dcc.Loading(
                        id="census-table-loading",
                        type="default",
                        children=html.Div(id="census-table", className="table-responsive")
                    )
                ])
            ], className="mb-4")
        ])
    ]),
    
    # Automated Scraping Panel
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardHeader([
                    html.Span("🤖 Automated Business Discovery", className="fw-bold"),
                ], className="d-flex justify-content-between align-items-center"),
                dbc.CardBody([
                    html.Div(
                        id="scrape-status",
                        children="Status: Ready",
                        className="mb-3 p-2 bg-light rounded"
                    ),
                    dbc.Row([
                        dbc.Col([
                            dbc.Button("▶️ Start Auto-Scraping", id="start-scrape-btn", color="success", className="me-2 mb-2"),
                            dbc.Button("⏹️ Stop Auto-Scraping", id="stop-scrape-btn", color="danger", className="me-2 mb-2"),
                            dbc.Button("📊 Refresh Stats", id="refresh-scrape-btn", color="info", className="me-2 mb-2"),
                            dbc.Button("🧪 Test Scraping", id="test-scrape-btn", color="warning", className="mb-2")
                        ])
                    ]),
                    html.Div(
                        id="test-scrape-status",
                        children="Click to test scraping",
                        className="mt-3 p-2 bg-light rounded small"
                    ),
                    html.Div([
                        html.P("🔄 Interval: Every hour | 🏘️ Batch Size: 5 cities | 🏢 Max per city: 50 businesses", className="small text-muted mt-3 mb-0"),
                        html.P("📍 Sources: OpenStreetMap (stonemasons, carpenters, builders, contractors)", className="small text-muted mb-0")
                    ])
                ])
            ], className="mb-4")
        ])
    ]),
    
    # Natural Language QA Panel
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardHeader("Ask the RAG (Natural Language QA)", className="fw-bold"),
                dbc.CardBody([
                    dbc.Input(
                        id="qa-input",
                        type="text",
                        placeholder="Ask anything about contractors, municipalities, or census...",
                        className="mb-3"
                    ),
                    dbc.Button("Ask", id="qa-btn", color="primary", className="me-2"),
                    dbc.Button("Export Results to CSV", id="export-csv-btn", color="secondary"),
                    html.Div(id="qa-status", className="mt-3 small text-success"),
                    dcc.Loading(
                        id="qa-loading",
                        type="default",
                        children=html.Div(id="qa-answer", className="mt-3 p-3 border rounded bg-light")
                    ),
                    html.H5("Matching Leads & Census Data", className="mt-4"),
                    html.Div(id="qa-leads-table", className="table-responsive"),
                    dcc.Download(id="download-csv"),
                    cyto.Cytoscape(
                        id="qa-graph",
                        layout={"name": "cose", "animate": False},
                        style={"width": "100%", "height": "400px", "border": "1px solid #eee", "marginTop": "20px"},
                        elements=[],
                        stylesheet=[
                            {"selector": "node", "style": {"label": "data(label)", "font-size": 10, "text-valign": "center", "text-halign": "center"}},
                            {"selector": "node[type='province']", "style": {"background-color": "#1f77b4", "shape": "round-rectangle"}},
                            {"selector": "node[type='municipality']", "style": {"background-color": "#2ca02c"}},
                            {"selector": "node[type='contractor']", "style": {"background-color": "#ff7f0e", "shape": "triangle"}},
                            {"selector": "edge", "style": {"line-color": "#bbb", "width": 2, "curve-style": "bezier", "target-arrow-shape": "triangle", "target-arrow-color": "#bbb"}},
                        ]
                    )
                ])
            ], className="mb-4")
        ])
    ]),
    
    # Footer
    dbc.Row([
        dbc.Col([
            html.Hr(),
            html.P(
                "Simcoe Stone Lead Engine Dashboard - Last updated: September 9, 2025",
                className="text-muted text-center small"
            )
        ])
    ])
], fluid=True, className="p-4")