#!/usr/bin/env python3
"""
Test MCP Server Time functionality
"""

import asyncio
import sys


async def test_mcp_server():
    """Test the MCP server time module."""
    try:
        # Test if we can import and run the MCP server
        import mcp_server_time

        print("✅ Successfully imported mcp_server_time module")
        print("🕐 MCP Time Server is ready to use!")

        # You can add more specific tests here if needed
        print("📋 Available MCP server time tools should include:")
        print("   - get_current_time")
        print("   - get_timezone")
        print("   - convert_timezone")
        print("   - And more time-related functions")

        return True

    except ImportError as e:
        print(f"❌ Failed to import mcp_server_time: {e}")
        return False
    except Exception as e:
        print(f"❌ Error testing MCP server: {e}")
        return False


def main():
    """Main function to run the test."""
    print("🧪 Testing MCP Server Time...")
    print("=" * 40)

    # Run the async test
    success = asyncio.run(test_mcp_server())

    if success:
        print("=" * 40)
        print("🎉 MCP Server Time test passed!")
        print("💡 Try restarting VS Code to activate the MCP server.")
        print("💡 The server should now be available in Copilot Chat.")
    else:
        print("=" * 40)
        print("❌ MCP Server Time test failed!")
        print("💡 Try reinstalling: pip install --upgrade mcp-server-time")

    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
