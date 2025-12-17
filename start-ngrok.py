#!/usr/bin/env python3
"""
Python script to install and run ngrok for Simcoe Stone website
This script will automatically install ngrok via pip and start the tunnel
"""

import subprocess
import sys
import time

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


def check_server_running(port: int = 3000) -> bool:
    """Check if the local server is running on the specified port"""
    try:
        response = requests.get(f"http://localhost:{port}", timeout=5)
        return response.status_code == 200
    except Exception:
        return False


def start_ngrok_tunnel(port: int = 3000) -> bool:
    """Start ngrok tunnel using pyngrok"""
    try:
        from pyngrok import ngrok

        print(f"🚀 Starting ngrok tunnel for port {port}...")

        # Start the tunnel
        public_url = ngrok.connect(port)

        print("🌐 Tunnel created successfully!")
        print(f"📍 Local URL: http://localhost:{port}")
        print(f"🔗 Public URL: {public_url}")
        print(f"📱 Mobile-friendly: {public_url}")
        print("\n" + "=" * 50)
        print("🎉 SHARE THIS URL WITH MARC:")
        print(f"   {public_url}")
        print("=" * 50)
        print("\n💡 Press Ctrl+C to stop the tunnel")

        # Keep the tunnel alive
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping ngrok tunnel...")
            ngrok.disconnect(public_url)
            ngrok.kill()
            print("✅ Tunnel stopped")
            return True

    except Exception as e:
        print(f"❌ Error starting ngrok: {e}")
        return False


def main():
    print("🏗️  Simcoe Stone Website - ngrok Tunnel Setup")
    print("=" * 50)

    # Check if server is running
    if not check_server_running():
        print("⚠️  React dev server not detected on port 3000")
        print("📋 Please start the React server first:")
        print("   cd simcoe-stone-frontend")
        print("   npm start")
        print("   (Then run this script again)")
        return
    else:
        print("✅ React dev server detected on port 3000")

    # Install pyngrok if needed
    if not install_pyngrok():
        return

    # Start ngrok tunnel
    start_ngrok_tunnel()


if __name__ == "__main__":
    main()
