# Start ngrok tunnel for the website
Write-Host "Starting ngrok tunnel for Simcoe Stone website..."
Write-Host "Make sure the server is running on port 8000 first!"

# Check if ngrok is available
if (Get-Command ngrok -ErrorAction SilentlyContinue) {
    Write-Host "Starting ngrok tunnel..."
    ngrok http 8000
}
else {
    Write-Host "ngrok not found. Please install ngrok first."
    Write-Host "Download from: https://ngrok.com/download"
    Write-Host "Or run: choco install ngrok (if you have chocolatey)"
}
