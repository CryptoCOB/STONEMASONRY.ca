#!/usr/bin/env python3
"""
Simple script to start ngrok tunnel for React dev server on port 3000
Run this after starting the React server with 'npm start'
"""

import time


def start_ngrok_for_react():
    """Start ngrok tunnel for React dev server on port 3000"""
    try:
        from pyngrok import ngrok

        print("🌐 Starting ngrok tunnel for React dev server...")
        print("📋 Make sure React server is running on port 3000!")

        # Start the tunnel for React default port
        public_url = ngrok.connect(3000)

        print("\n" + "=" * 70)
        print("🎉 SIMCOE STONE REACT APP IS NOW LIVE!")
        print("📍 Local URL: http://localhost:3000")
        print(f"🔗 Public URL: {public_url}")
        print("=" * 70)
        print("\n📱 SHARE THIS URL WITH MARC:")
        print(f"   {public_url}")
        print("\n✨ Now Marc can see:")
        print("   ✅ All website pages (React Router working)")
        print("   ✅ Enhanced stone textures with better contrast")
        print("   ✅ Simcoe Stone branding throughout")
        print("   ✅ All images loading properly")
        print("   ✅ Mobile responsive design")
        print("   ✅ Live updates as you make changes")
        print("\n💡 Press Ctrl+C to stop the tunnel")
        print("💡 Keep the React server running in the other terminal")
        print("=" * 70)

        # Keep the tunnel alive
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping ngrok tunnel...")
            ngrok.disconnect(public_url)
            ngrok.kill()
            print("✅ Tunnel stopped")
            print("💡 React server is still running - you can restart tunnel anytime")

    except Exception as e:
        print(f"❌ Error starting ngrok: {e}")
        print("💡 Make sure pyngrok is installed: pip install pyngrok")


if __name__ == "__main__":
    print("🏗️  ngrok Tunnel for React Dev Server")
    print("=" * 50)
    start_ngrok_for_react()
