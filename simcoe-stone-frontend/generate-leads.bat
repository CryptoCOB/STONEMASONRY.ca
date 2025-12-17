@echo off
echo Starting Simcoe Stone Lead Generation...
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
if exist scripts\lead_engine\.venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call scripts\lead_engine\.venv\Scripts\activate.bat
) else if exist .venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call .venv\Scripts\activate.bat
) else (
    echo Warning: Virtual environment not found. Using system Python.
)

REM Run the lead generation script
echo.
echo Starting lead generation process...
echo This may take some time depending on the number of cities.
echo.

python scripts\lead_engine\generate_leads.py

echo.
echo Lead generation complete.
echo.

REM Start the dashboard to view results
set /p start_dashboard="Would you like to start the dashboard to view results? (Y/N): "
if /i "%start_dashboard%"=="Y" (
    echo Starting dashboard...
    start cmd /c "streamlit run scripts\lead_engine\streamlit_dashboard.py"
)

pause