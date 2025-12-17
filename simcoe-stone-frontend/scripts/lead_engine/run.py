"""
Run the Lead Engine Dashboard

This script will:
1. Check and install dependencies
2. Start the Lead Engine dashboard
"""
import os
import sys
import subprocess

def ensure_dependencies():
    """Make sure all dependencies are installed"""
    # Path to setup.py
    setup_path = os.path.join(os.path.dirname(__file__), "setup.py")
    
    if os.path.exists(setup_path):
        print("Checking dependencies...")
        subprocess.run([sys.executable, setup_path])
    else:
        print("Setup script not found. Dependencies may be missing.")
        return False
    return True

def run_dashboard():
    """Run the dashboard"""
    # Prefer app.py to avoid pathname collision with pages/dashboard.py
    app_path = os.path.join(os.path.dirname(__file__), "app.py")
    legacy_dashboard_path = os.path.join(os.path.dirname(__file__), "dashboard.py")

    entry = app_path if os.path.exists(app_path) else legacy_dashboard_path
    if not os.path.exists(entry):
        print("Error: app.py or dashboard.py not found!")
        return False

    print("\n🚀 Starting Lead Engine Dashboard...")
    # Use streamlit run command
    subprocess.run([sys.executable, "-m", "streamlit", "run", entry, "--server.port=8501"]) 
    return True

if __name__ == "__main__":
    # Check if we're in a virtual environment
    in_venv = sys.prefix != sys.base_prefix
    
    if not in_venv:
        venv_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".venv")
        if os.path.exists(os.path.join(venv_dir, "Scripts", "python.exe")):
            print("Virtual environment detected but not activated.")
            print("Attempting to run with the virtual environment Python...")
            
            # Run this same script with the venv Python
            venv_python = os.path.join(venv_dir, "Scripts", "python.exe")
            this_script = os.path.abspath(__file__)
            
            try:
                sys.exit(subprocess.run([venv_python, this_script]).returncode)
            except Exception as e:
                print(f"Error running with venv Python: {e}")
    
    # Continue with dependency check and run
    if ensure_dependencies():
        run_dashboard()