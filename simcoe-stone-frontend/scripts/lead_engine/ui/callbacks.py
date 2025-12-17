# Callback functions for Dash UI
from dash import Input, Output, State, callback_context
from dash.exceptions import PreventUpdate
import threading
import time
from datetime import datetime

# Import from modules
from scraping.auto_scraper import start_automated_scraping, stop_automated_scraping, scraping_stats
from api.qa import qa_callback
from data.indexer import build_graph

def register_callbacks(app):
    """Register all Dash callbacks"""

    @app.callback(
        Output("scrape-status", "children"),
        [Input("start-scrape-btn", "n_clicks"),
         Input("stop-scrape-btn", "n_clicks"),
         Input("refresh-scrape-btn", "n_clicks")]
    )
    def handle_scraping_controls(start_clicks, stop_clicks, refresh_clicks):
        """Handle automated scraping controls"""
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
            next_city = "Cycle complete"  # Will be updated with actual logic
            errors_info = f" | Errors: {len(scraping_stats['errors'])}" if scraping_stats["errors"] else ""
            return f"{status} | Next: {next_city} | Total: {scraping_stats['total_scraped']} contractors | Cities: {scraping_stats['cities_processed']}{errors_info}"

        # Default status
        return "🔴 Ready to start automated business discovery"

    @app.callback(
        [Output("qa-answer", "children"),
         Output("qa-graph", "elements"),
         Output("qa-status", "children"),
         Output("qa-leads-table", "children")],
        Input("qa-btn", "n_clicks"),
        State("qa-input", "value")
    )
    def handle_qa(n_clicks, question):
        """Handle QA queries"""
        if not n_clicks or not question:
            raise PreventUpdate

        return qa_callback(n_clicks, question)

    @app.callback(
        Output("rag-graph", "elements"),
        Input("refresh-graph-btn", "n_clicks")
    )
    def handle_graph_refresh(n_clicks):
        """Handle graph refresh"""
        if not n_clicks:
            raise PreventUpdate

        return build_graph(n_clicks, "contractor", 0, None)