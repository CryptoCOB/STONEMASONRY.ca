import datetime
import http.server
import os
import socketserver

# Set up logging
log_file = r"C:\Users\16479\Desktop\Simcoe Stone\server-log.txt"
build_dir = r"C:\Users\16479\Desktop\Simcoe Stone\simcoe-stone-frontend\build"

# Change to the build directory
os.chdir(build_dir)

# Log start
with open(log_file, "a") as f:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    f.write(f"[{timestamp}] Starting Python HTTP server for Simcoe Stone Frontend...\n")
    f.write(f"[{timestamp}] Serving directory: {build_dir}\n")
    f.write(f"[{timestamp}] Server will be available at http://localhost:8000\n")

# Set up the server
PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

# Create the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server started at http://localhost:{PORT}")
    print(f"Serving from {build_dir}")
    print(f"Logs being saved to {log_file}")

    # Log server start
    with open(log_file, "a") as f:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"[{timestamp}] Server started at http://localhost:{PORT}\n")

    try:
        # Start the server
        httpd.serve_forever()
    except KeyboardInterrupt:
        # Log server stop
        with open(log_file, "a") as f:
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] Server stopped by user\n")
        print("\nServer stopped")
