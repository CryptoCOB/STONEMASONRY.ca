@echo off
REM Lead Engine Dashboard Launcher
REM This script ensures the virtual environment is properly set up before running

echo ===== Simcoe Stone Lead Engine Dashboard =====

REM Check if virtual environment exists
if not exist .venv (
    echo Creating virtual environment...
    
    REM Check if uv is available
    where uv >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo Using uv to create virtual environment...
        uv venv .venv
    ) else (
        echo uv not found. Using standard venv module...
        python -m venv .venv
    )
    
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to create virtual environment.
        echo Please make sure either uv or Python venv module is available.
        pause
        exit /b 1
    )
)

REM Activate virtual environment and run
echo Activating virtual environment...
call .venv\Scripts\activate.bat

REM Run the Python launcher script
echo Starting dashboard...
python scripts\lead_engine\run.py

REM Keep the window open if there was an error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo An error occurred while running the dashboard.
    pause
)

REM Deactivate the virtual environment
call deactivate

echo Dashboard closed.