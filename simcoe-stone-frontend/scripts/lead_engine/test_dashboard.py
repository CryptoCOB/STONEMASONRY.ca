"""
Test script for the Streamlit dashboard
"""

import os
import sys
import subprocess
import time
import webbrowser
import requests
from datetime import datetime

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def get_dashboard_files():
    """Get all dashboard files"""
    dashboard_files = []
    
    # Main dashboard file
    if os.path.exists("streamlit_dashboard.py"):
        dashboard_files.append("streamlit_dashboard.py")
    else:
        print("❌ Main dashboard file not found: streamlit_dashboard.py")
    
    # Pages
    pages_dir = "pages"
    if os.path.exists(pages_dir):
        print(f"Found pages directory: {pages_dir}")
        for file in os.listdir(pages_dir):
            if file.endswith(".py"):
                dashboard_files.append(os.path.join(pages_dir, file))
                print(f"  - Found page: {file}")
    else:
        print("❌ Pages directory not found")
    
    return dashboard_files

def test_dashboard_port(port=8501, timeout=3):
    """Test if dashboard is running on the given port"""
    url = f"http://localhost:{port}"
    try:
        response = requests.get(url, timeout=timeout)
        if response.status_code == 200:
            return True
        return False
    except:
        return False

def run_dashboard():
    """Start the dashboard and check if it's running"""
    print("\n===== Testing Dashboard =====")
    
    # Check for dashboard files
    dashboard_files = get_dashboard_files()
    if not dashboard_files:
        print("❌ No dashboard files found")
        return False
    
    # Check if streamlit is installed
    try:
        subprocess.run(["streamlit", "--version"], capture_output=True, text=True, check=True)
        print("✅ Streamlit is installed")
    except:
        print("❌ Streamlit is not installed")
        return False
    
    # Check if dashboard is already running
    if test_dashboard_port():
        print("✅ Dashboard is already running on port 8501")
        webbrowser.open("http://localhost:8501")
        return True
    
    # Try to start the dashboard
    try:
        print(f"Starting dashboard with: {dashboard_files[0]}")
        proc = subprocess.Popen(
            ["streamlit", "run", dashboard_files[0]], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait for dashboard to start (max 10 seconds)
        for i in range(10):
            time.sleep(1)
            print(f"Waiting for dashboard to start... ({i+1}s)")
            if test_dashboard_port():
                print(f"✅ Dashboard started successfully after {i+1}s")
                # Open in browser
                webbrowser.open("http://localhost:8501")
                return True
        
        # Check if process is still running
        if proc.poll() is None:
            print("⚠️ Dashboard process is running but not responding on port 8501")
            proc.terminate()
        else:
            print("❌ Dashboard process exited unexpectedly")
            stdout, stderr = proc.communicate()
            print("STDOUT:", stdout)
            print("STDERR:", stderr)
        
        return False
    
    except Exception as e:
        print(f"❌ Error starting dashboard: {e}")
        return False

def check_bat_files():
    """Check for batch files to start the dashboard"""
    print("\n===== Checking BAT Files =====")
    bat_files = []
    
    for file in os.listdir():
        if file.endswith(".bat") and ("dashboard" in file.lower() or "lead" in file.lower()):
            bat_files.append(file)
            print(f"Found BAT file: {file}")
    
    if not bat_files:
        print("No dashboard BAT files found")
    
    return bat_files

def main():
    """Main test function"""
    print("===== Dashboard Tests =====")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Working directory: {os.getcwd()}")
    
    # Check for bat files
    bat_files = check_bat_files()
    
    # Test running the dashboard
    dashboard_success = run_dashboard()
    
    # Print summary
    print("\n===== Test Results =====")
    print(f"Dashboard: {'✅ PASSED' if dashboard_success else '❌ FAILED'}")
    
    if not dashboard_success and bat_files:
        print("\nTry running one of these batch files instead:")
        for file in bat_files:
            print(f"  - {file}")

if __name__ == "__main__":
    main()