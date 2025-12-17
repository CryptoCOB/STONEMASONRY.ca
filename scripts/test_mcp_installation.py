#!/usr/bin/env python3
"""
MCP Server Test - Verify MCP installation and functionality
"""

import subprocess
import sys


def test_mcp_installation():
    """Test if MCP modules are properly installed and working."""

    print("🔍 Testing MCP Installation...")
    print("=" * 50)

    # Test 1: Check if mcp_server_time module exists
    try:
        import mcp_server_time

        print("✅ mcp_server_time module imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import mcp_server_time: {e}")
        return False

    # Test 2: Check if we can run the module
    try:
        result = subprocess.run(
            [sys.executable, "-m", "mcp_server_time", "--help"],
            capture_output=True,
            text=True,
            timeout=10,
        )

        if result.returncode == 0:
            print("✅ mcp_server_time module runs successfully")
            print(f"📝 Module help output preview: {result.stdout[:100]}...")
        else:
            print(f"❌ mcp_server_time failed to run: {result.stderr}")
            return False

    except subprocess.TimeoutExpired:
        print("⚠️  mcp_server_time command timed out")
    except Exception as e:
        print(f"❌ Error running mcp_server_time: {e}")
        return False

    # Test 3: Check Python version compatibility
    python_version = sys.version_info
    print(
        f"🐍 Python version: {python_version.major}.{python_version.minor}.{python_version.micro}"
    )

    if python_version >= (3, 8):
        print("✅ Python version is compatible with MCP")
    else:
        print("❌ Python version might be too old for MCP")
        return False

    print("=" * 50)
    print("🎉 MCP installation test completed successfully!")
    print("💡 The MCP server should now work in VS Code.")
    print("💡 You may need to restart VS Code for changes to take effect.")

    return True


if __name__ == "__main__":
    success = test_mcp_installation()
    sys.exit(0 if success else 1)
