"""
Main app module for the Contractor Lead Engine
"""
from .layout import app
from .callbacks import register_callbacks

# Register callbacks
register_callbacks(app)

def run_server(debug=False, host="127.0.0.1", port=8050):
    """Run the Dash app server"""
    app.run_server(debug=debug, host=host, port=port, use_reloader=False)