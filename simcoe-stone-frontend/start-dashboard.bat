@echo off
REM Streamlit Launcher for Lead Engine Dashboard

echo ===== Simcoe Stone Lead Engine Dashboard =====

REM Check if virtual environment exists
if exist .venv (
  REM Activate virtual environment and run
  echo Using virtual environment...
  call .venv\Scripts\activate.bat
  
  REM Ensure required packages are installed
  echo Checking packages...
  where uv >nul 2>nul
  if %ERRORLEVEL% equ 0 (
    echo Using UV for package management...
    uv pip install streamlit pandas plotly chromadb supabase
  ) else (
    echo Using pip for package management...
    pip install streamlit pandas plotly chromadb supabase
  )
  
  REM Run streamlit directly
  echo Starting dashboard...
  streamlit run scripts\lead_engine\dashboard.py
  
  REM Deactivate the virtual environment
  call deactivate
) else if exist scripts\lead_engine\.venv (
  REM Use the virtual environment in the lead_engine directory
  echo Using lead_engine virtual environment...
  call scripts\lead_engine\.venv\Scripts\activate.bat
  
  REM Ensure required packages are installed
  echo Checking packages...
  where uv >nul 2>nul
  if %ERRORLEVEL% equ 0 (
    echo Using UV for package management...
    uv pip install streamlit pandas plotly chromadb supabase
  ) else (
    echo Using pip for package management...
    pip install streamlit pandas plotly chromadb supabase
  )
  
  REM Run streamlit directly
  echo Starting dashboard...
  streamlit run scripts\lead_engine\dashboard.py
  
  REM Deactivate the virtual environment
  call deactivate
) else (
  REM Run setup process first
  echo No virtual environment found. Running setup...
  cd scripts\lead_engine
  python setup.py
  cd ..\..
  
  echo Starting dashboard...
  streamlit run scripts\lead_engine\dashboard.py
)

echo Dashboard closed.