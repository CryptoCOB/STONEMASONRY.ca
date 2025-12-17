# Server start script for Simcoe Stone Frontend
# This script serves the built React app using npx http-server

$logFile = "C:\Users\16479\Desktop\Simcoe Stone\server-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

"[$timestamp] Starting http-server for Simcoe Stone Frontend..." | Out-File -FilePath $logFile -Append

try {
    Set-Location -Path "C:\Users\16479\Desktop\Simcoe Stone\simcoe-stone-frontend"
    
    # Log environment info
    "[$timestamp] Node version: $(node -v)" | Out-File -FilePath $logFile -Append
    "[$timestamp] NPM version: $(npm -v)" | Out-File -FilePath $logFile -Append
    
    # First ensure http-server is available
    "[$timestamp] Installing http-server..." | Out-File -FilePath $logFile -Append
    npm install -g http-server 2>&1 | Tee-Object -FilePath $logFile -Append
    
    # Start the server
    "[$timestamp] Starting http-server on port 8080..." | Out-File -FilePath $logFile -Append
    "[$timestamp] Browse to http://localhost:8080" | Out-File -FilePath $logFile -Append
    
    http-server build -p 8080 -o 2>&1 | Tee-Object -FilePath $logFile -Append
}
catch {
    "[$timestamp] ERROR: $_" | Out-File -FilePath $logFile -Append
}
