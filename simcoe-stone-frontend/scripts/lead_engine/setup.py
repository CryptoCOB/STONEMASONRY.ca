"""
Setup script to install required packages for the modular Lead Engine
"""
import os
import subprocess
import sys

def main():
    print("Setting up Lead Engine environment...")
    
    # Path to requirements.txt
    req_path = os.path.join(os.path.dirname(__file__), "requirements.txt")
    
    # Check if requirements.txt exists
    if not os.path.exists(req_path):
        print("Creating requirements.txt...")
        with open(req_path, "w") as f:
            f.write("""streamlit>=1.24.0
pandas>=2.0.0
numpy>=1.24.0
plotly>=5.14.1
chromadb>=0.4.13
python-dotenv>=1.0.0
supabase>=1.0.3
requests>=2.29.0""")
    
    # Check if we have uv available
    try:
        subprocess.run(["uv", "--version"], check=True, capture_output=True)
        use_uv = True
    except (subprocess.CalledProcessError, FileNotFoundError):
        use_uv = False
    
    # Install requirements
    print("Installing required packages...")
    if use_uv:
        # Use uv if available
        cmd = ["uv", "pip", "install", "-r", req_path]
    else:
        # Fall back to pip
        cmd = [sys.executable, "-m", "pip", "install", "-r", req_path]
    
    result = subprocess.run(cmd)
    
    if result.returncode == 0:
        print("✅ Successfully installed required packages")
    else:
        print("❌ Failed to install packages")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("Setup complete! You can now run 'python run.py' to start the Lead Engine Dashboard.")
    else:
        print("Setup failed. Please try installing the packages manually:")
        print("uv pip install -r requirements.txt")
        # Or
        print("pip install -r requirements.txt")