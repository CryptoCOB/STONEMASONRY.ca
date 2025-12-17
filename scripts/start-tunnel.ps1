Write-Host "🚀 Starting ngrok tunnel for React dev server..." -ForegroundColor Green
Write-Host "📋 Make sure React server is running on port 3000!" -ForegroundColor Yellow

Set-Location "C:\Users\16479\Desktop\Simcoe Stone"
python test-ngrok.py

Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
