# Entry point for Dash UI
import dash
from dash import html, dcc
import dash_bootstrap_components as dbc
from dash_cytoscape import Cytoscape

# Import callbacks
from .callbacks import register_callbacks

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

app.layout = dbc.Container([
    dbc.NavbarSimple(
        brand="Contractor Lead Engine",
        color="primary",
        dark=True,
        fluid=True,
        className="mb-4"
    ),

    # Automated Scraping Section
    dbc.Card([
        dbc.CardHeader(html.H3("🤖 Automated Business Discovery", className="mb-0")),
        dbc.CardBody([
            html.Div(id="scrape-status", children="Status: Ready", className="mb-3 alert alert-info"),
            dbc.Row([
                dbc.Col(dbc.Button("▶️ Start Auto-Scraping", id="start-scrape-btn", color="success", className="me-2")),
                dbc.Col(dbc.Button("⏹️ Stop Auto-Scraping", id="stop-scrape-btn", color="danger", className="me-2")),
                dbc.Col(dbc.Button("📊 Refresh Stats", id="refresh-scrape-btn", color="info")),
            ], className="mb-3"),
            dbc.Row([
                dbc.Col([
                    html.P("🔄 Interval: Every hour | 🏘️ Batch Size: 5 cities | 🏢 Max per city: 50 businesses", className="text-muted mb-1"),
                    html.P("📍 Sources: OpenStreetMap (stonemasons, carpenters, builders, contractors)", className="text-muted mb-0")
                ])
            ])
        ])
    ], className="mb-4"),

    # QA Section
    dbc.Card([
        dbc.CardHeader(html.H3("Ask the RAG (Natural Language QA)", className="mb-0")),
        dbc.CardBody([
            dbc.Input(id="qa-input", type="text", placeholder="Ask anything about contractors, municipalities, or census...", className="mb-2"),
            dbc.Row([
                dbc.Col(dbc.Button("Ask", id="qa-btn", color="primary", className="me-2")),
                dbc.Col(dbc.Button("Export Results to CSV", id="export-csv-btn", color="secondary")),
            ], className="mb-3"),
            dcc.Loading(id="qa-loading", type="default", children=html.Div(id="qa-answer")),
            html.Div(id="qa-status", className="mt-2 alert alert-secondary"),
            html.H4("Matching Leads & Census Data", className="mt-3"),
            html.Div(id="qa-leads-table"),
            dcc.Download(id="download-csv"),
        ])
    ], className="mb-4"),

    # Graph Section
    dbc.Card([
        dbc.CardHeader(html.H3("RAG Graph", className="mb-0")),
        dbc.CardBody([
            html.P("Visualize how provinces, municipalities, and contractors connect.", className="text-muted mb-3"),
            dbc.Button("Refresh Graph", id="refresh-graph-btn", color="primary", className="mb-3"),
            dcc.Loading(id="graph-loading", type="default", children=[
                Cytoscape(
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
                    ],
                )
            ]),
            Cytoscape(
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
                ],
            )
        ])
    ])
], fluid=True)

# Register callbacks
register_callbacks(app)

if __name__ == "__main__":
    app.run_server(debug=True, host="127.0.0.1", port=8050)
