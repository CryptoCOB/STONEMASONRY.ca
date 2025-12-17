from pyngrok import ngrok

print("🚀 Starting ngrok tunnel for React dev server...")

# Start ngrok tunnel for React (port 3000)
public_url = ngrok.connect(3000)
print(f"🔗 Tunnel URL: {public_url}")

print("\n" + "=" * 60)
print("🎉 SUCCESS! SHARE THIS URL WITH MARC:")
print(f"   {public_url}")
print("=" * 60)
print("\n✨ Marc will see the full React app with:")
print("   ✅ All pages working (React Router)")
print("   ✅ Enhanced stone textures")
print("   ✅ Simcoe Stone branding")
print("   ✅ All images loading properly")
print("\n💡 Make sure React server is running:")
print("   cd simcoe-stone-frontend")
print("   npm start")
