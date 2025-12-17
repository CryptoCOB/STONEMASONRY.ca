@echo off
echo Starting Simcoe Stone Lead Engine Dashboard...
echo.

REM Check if Python is available
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Python not found in PATH
    echo Please install Python and try again.
    pause
    exit /b 1
)

REM Activate virtual environment if it exists
if exist .venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call .venv\Scripts\activate.bat
) else (
    echo Warning: Virtual environment not found. Using system Python.
)

REM Check if Streamlit is installed
python -c "import streamlit" >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Installing required packages...
    echo.
    uv pip install streamlit pandas plotly chromadb
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to install required packages.
        pause
        exit /b 1
    )
)

REM Run the Streamlit dashboard
echo.
echo Starting dashboard... Opening in your browser.
echo Press Ctrl+C to stop the server.
echo.
streamlit run scripts/lead_engine/streamlit_dashboard.py

pause