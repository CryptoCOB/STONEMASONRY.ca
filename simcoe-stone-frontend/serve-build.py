#!/usr/bin/env python3
import http.server
import os
import socketserver
import webbrowser
from pathlib import Path

# Change to build directory
build_dir = Path(__file__).parent / "build"
os.chdir(build_dir)

PORT = 3000


class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self):
        # Handle SPA routing - serve index.html for routes
        if self.path.startswith("/") and "." not in self.path and self.path != "/":
            self.path = "/index.html"
        return super().do_GET()


if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Serving Simcoe Stone website at http://localhost:{PORT}")
        print(f"Build directory: {build_dir}")
        print("Press Ctrl+C to stop the server")

        # Open browser automatically
        try:
            webbrowser.open(f"http://localhost:{PORT}")
        except  Exception as e:
            print(f"Error opening browser: {e}")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")
