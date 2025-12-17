#!/usr/bin/env python3
"""
Python script to run React dev server with ngrok for Simcoe Stone website
This gives us full React functionality with routing and live updates
"""

import os
import subprocess
import sys
import threading
import time
from pathlib import Path

import requests


def install_pyngrok():
    """Install pyngrok package if not already installed"""
    try:
        import importlib.util

        spec = importlib.util.find_spec("pyngrok")
        if spec is not None:
            print("✅ pyngrok already installed")
            return True
        else:
            raise ImportError("pyngrok not found")
    except ImportError:
        print("📦 Installing pyngrok...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "pyngrok"])
            print("✅ pyngrok installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install pyngrok")
            return False


def check_node_and_npm():
    """Check if Node.js and npm are available"""
    try:
        node_result = subprocess.run(
            ["node", "--version"], capture_output=True, text=True, check=True
        )
        npm_result = subprocess.run(
            ["npm", "--version"], capture_output=True, text=True, check=True
        )
        print(f"✅ Node.js {node_result.stdout.strip()}")
        print(f"✅ npm {npm_result.stdout.strip()}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Node.js or npm not found!")
        print("💡 Please install Node.js from https://nodejs.org/")
        return False


def check_react_app():
    """Check if React app exists and has dependencies"""
    frontend_path = Path("simcoe-stone-frontend")
    package_json = frontend_path / "package.json"
    node_modules = frontend_path / "node_modules"

    if not frontend_path.exists():
        print("❌ simcoe-stone-frontend directory not found!")
        return False

    if not package_json.exists():
        print("❌ package.json not found in React app!")
        return False

    if not node_modules.exists():
        print("📦 Installing npm dependencies...")
        try:
            subprocess.run(["npm", "install"], cwd=frontend_path, check=True)
            print("✅ Dependencies installed")
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            return False
    else:
        print("✅ npm dependencies found")

    return True


def start_react_server():
    """Start React development server in background"""
    frontend_path = Path("simcoe-stone-frontend")

    def run_react():
        try:
            # Set environment variable to disable browser opening
            env = os.environ.copy()
            env["BROWSER"] = "none"

            subprocess.run(["npm", "start"], cwd=frontend_path, env=env, check=True)
        except subprocess.CalledProcessError as e:
            print(f"❌ React server failed: {e}")

    print("🚀 Starting React development server...")
    react_thread = threading.Thread(target=run_react, daemon=True)
    react_thread.start()

    # Wait for server to start (React usually takes 10-15 seconds)
    print("⏳ Waiting for React server to start...")
    for i in range(30):  # Wait up to 30 seconds
        try:
            response = requests.get("http://localhost:3000", timeout=2)
            if response.status_code == 200:
                print("✅ React server is running on port 3000")
                return True
        except requests.exceptions.RequestException:
            pass

        time.sleep(1)
        if i % 5 == 0:
            print(f"   Still waiting... ({i + 1}/30 seconds)")

    print("❌ React server failed to start within 30 seconds")
    return False


def start_ngrok_tunnel(port: int = 3000) -> bool:
    """Start ngrok tunnel for React dev server"""
    try:
        from pyngrok import ngrok

        print(f"🌐 Starting ngrok tunnel for React dev server (port {port})...")

        # Start the tunnel
        public_url = ngrok.connect(port)

        print("\n" + "=" * 60)
        print("🎉 SIMCOE STONE REACT APP IS NOW LIVE!")
        print(f"📍 Local URL: http://localhost:{port}")
        print(f"🔗 Public URL: {public_url}")
        print("=" * 60)
        print("\n📱 SHARE THIS URL WITH MARC:")
        print(f"   {public_url}")
        print("\n✨ Features Available:")
        print("   • Full React Router (all pages work)")
        print("   • Live hot reloading")
        print("   • All images and assets")
        print("   • Enhanced stone textures")
        print("   • Simcoe Stone branding")
        print("\n💡 Press Ctrl+C to stop tunnel and server")
        print("=" * 60)

        # Keep the tunnel alive
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping ngrok tunnel and React server...")
            ngrok.disconnect(public_url)
            ngrok.kill()
            print("✅ Everything stopped successfully")
            return True

    except Exception as e:
        print(f"❌ Error starting ngrok: {e}")
        return False


def main():
    print("🏗️  Simcoe Stone Website - React Dev Server + ngrok")
    print("=" * 60)

    # Check prerequisites
    if not check_node_and_npm():
        return

    if not check_react_app():
        return

    if not install_pyngrok():
        return

    # Start React development server
    if not start_react_server():
        return

    # Start ngrok tunnel
    start_ngrok_tunnel(3000)


if __name__ == "__main__":
    main()
