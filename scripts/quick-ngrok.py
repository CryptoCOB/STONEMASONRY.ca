#!/usr/bin/env python3
"""
Simple Python script to start ngrok tunnel for Simcoe Stone website
"""

import os
import subprocess
import sys
import time


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


def start_server_and_tunnel():
    """Start both the server and ngrok tunnel"""
    try:
        # Start the HTTP server in background
        print("🚀 Starting local server on port 8000...")
        server_process = subprocess.Popen(
            [sys.executable, "-m", "http.server", "8000", "--directory", "build"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        # Give server time to start
        time.sleep(3)

        # Start ngrok tunnel
        from pyngrok import ngrok

        print("🌐 Starting ngrok tunnel...")
        public_url = ngrok.connect(8000)

        print("\n" + "=" * 60)
        print("🎉 SIMCOE STONE WEBSITE IS NOW LIVE!")
        print("📍 Local URL: http://localhost:8000")
        print(f"🔗 Public URL: {public_url}")
        print("=" * 60)
        print("\n📱 SHARE THIS URL WITH MARC:")
        print(f"   {public_url}")
        print("\n💡 Press Ctrl+C to stop both server and tunnel")
        print("=" * 60)

        # Keep everything running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping server and tunnel...")
            ngrok.disconnect(public_url)
            ngrok.kill()
            server_process.terminate()
            print("✅ Everything stopped successfully")

    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    print("🏗️  Simcoe Stone Website - Quick Setup")
    print("=" * 50)

    # Check if build directory exists
    if not os.path.exists("build"):
        print("❌ Build directory not found!")
        print("💡 Copying from simcoe-stone-frontend...")
        try:
            import shutil

            shutil.copytree("simcoe-stone-frontend/build", "build")
            print("✅ Build directory copied")
        except Exception as e:
            print(f"❌ Could not copy build: {e}")
            return

    # Install pyngrok if needed
    if not install_pyngrok():
        return

    # Start everything
    start_server_and_tunnel()


if __name__ == "__main__":
    main()
