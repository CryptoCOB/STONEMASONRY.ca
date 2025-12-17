@echo off
echo Starting Simcoe Stone website server...
echo.
echo Opening website at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
python serve-build.py
