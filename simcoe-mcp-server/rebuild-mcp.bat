@echo off
echo ===============================================
echo   VOXSIGIL MCP SERVER - REBUILD & RESTART
echo ===============================================
echo.

echo 🔨 Building TypeScript...
cd /d "c:\Users\16479\Desktop\Simcoe Stone\voxsigil-mcp-server"
call npx tsc
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.
echo 🔄 Restarting MCP server...
echo.
echo NOTE: The MCP server will restart automatically through VS Code.
echo      You should see the flow visualization in the VS Code logs.
echo.
pause
