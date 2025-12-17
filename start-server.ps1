# Server start script for Simcoe Stone Frontend
# This script starts a simple HTTP server to serve the build folder and logs output

$logFile = "C:\Users\16479\Desktop\Simcoe Stone\server-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

"[$timestamp] Starting Simcoe Stone Frontend server..." | Out-File -FilePath $logFile -Append

try {
    # Change to the frontend directory
    Set-Location -Path "C:\Users\16479\Desktop\Simcoe Stone\simcoe-stone-frontend"
    
    # Log environment info
    "[$timestamp] Node version: $(node -v)" | Out-File -FilePath $logFile -Append
    "[$timestamp] NPM version: $(npm -v)" | Out-File -FilePath $logFile -Append
    
    # Check if we need to build the app first
    if (!(Test-Path -Path ".\build\index.html")) {
        "[$timestamp] Build folder not found. Running npm run build first..." | Out-File -FilePath $logFile -Append
        npm run build 2>&1 | Out-File -FilePath $logFile -Append
    }
    
    # Log serving information
    "[$timestamp] Serving build folder..." | Out-File -FilePath $logFile -Append
    "[$timestamp] Open http://localhost:8000 in your browser" | Out-File -FilePath $logFile -Append
    
    # Start a Python HTTP server to serve the build folder
    "[$timestamp] Starting Python HTTP server..." | Out-File -FilePath $logFile -Append
    
    # Use Python to start a simple HTTP server
    Set-Location -Path ".\build"
    python -m http.server 8000 2>&1 | Tee-Object -FilePath $logFile -Append
}
catch {
    "[$timestamp] ERROR: $_" | Out-File -FilePath $logFile -Append
}
