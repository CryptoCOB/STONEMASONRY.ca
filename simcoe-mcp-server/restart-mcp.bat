@echo off
echo 🔄 Restarting Simcoe Stone MCP Server with Flow Visualization...
echo.

REM Kill any existing node processes for this project
echo ⚠️  Stopping any running MCP servers...
taskkill /f /im node.exe /t >nul 2>&1

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Change to server directory
cd /d "c:\Users\16479\Desktop\Simcoe Stone\voxsigil-mcp-server"

REM Clear npm cache if needed
echo 🧹 Clearing npm cache...
npm cache clean --force

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building TypeScript...
npm run build

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    echo.
    echo 🚀 Starting MCP server with flow visualization...
    echo 📊 You should see colored flow output below:
    echo.
    node build/index-with-flow.js
) else (
    echo ❌ Build failed!
    echo 🔧 Try running the commands manually in a new terminal:
    echo    1. cd "c:\Users\16479\Desktop\Simcoe Stone\voxsigil-mcp-server"
    echo    2. npm install --force
    echo    3. npm run build
    echo    4. node build/index-with-flow.js
    pause
)
