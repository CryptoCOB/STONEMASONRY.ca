"""
Setup script for Lead Engine Dashboard
This will install all required dependencies using uv
"""
import os
import sys
import subprocess
import platform

# Required packages
REQUIRED_PACKAGES = [
    "streamlit",
    "pandas",
    "numpy",
    "plotly",
    "openpyxl",
    "python-dotenv"
]

def is_venv():
    """Check if running in a virtual environment"""
    return hasattr(sys, 'real_prefix') or (
        hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix
    )

def check_uv():
    """Check if uv is installed"""
    try:
        result = subprocess.run(
            ["uv", "--version"], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE,
            text=True
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False

def ensure_uv():
    """Make sure uv is installed"""
    if not check_uv():
        print("Installing uv package manager...")
        subprocess.run([sys.executable, "-m", "pip", "install", "uv"])
        
        # Verify installation
        if not check_uv():
            print("Error: Failed to install uv. Please install manually: pip install uv")
            return False
    return True

def install_dependencies():
    """Install required packages using uv"""
    if not ensure_uv():
        return False
    
    print(f"Installing required packages: {', '.join(REQUIRED_PACKAGES)}")
    
    # Use uv to install required packages
    cmd = ["uv", "pip", "install"] + REQUIRED_PACKAGES
    
    try:
        result = subprocess.run(cmd, check=True)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"Error installing dependencies: {e}")
        return False

def main():
    """Main setup function"""
    if not is_venv():
        print("Warning: Not running in a virtual environment.")
        print("It's recommended to run this in a virtual environment.")
        
        # Check for venv directory
        venv_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".venv")
        if os.path.exists(venv_dir):
            print(f"Virtual environment found at {venv_dir}")
            print("Please activate it before running this script.")
            
            if platform.system() == "Windows":
                print("Run: .venv\\Scripts\\activate")
            else:
                print("Run: source .venv/bin/activate")
                
            return False
    
    # Install dependencies
    if install_dependencies():
        print("\n✅ All dependencies installed successfully!")
        return True
    else:
        print("\n❌ Failed to install some dependencies.")
        return False

if __name__ == "__main__":
    sys.exit(0 if main() else 1)