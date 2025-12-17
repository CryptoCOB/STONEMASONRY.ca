#!/usr/bin/env python3
"""
UV and Ruff Configuration for MCP Server Python Development
Ensures modern Python tooling is always used
"""

import os
import subprocess
import sys
from pathlib import Path


def ensure_uv_installed():
    """Ensure UV package manager is installed"""
    try:
        subprocess.run(["uv", "--version"], check=True, capture_output=True)
        print("✅ UV is already installed")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ UV not found. Installing UV...")
        try:
            # Install UV using pip
            subprocess.run([sys.executable, "-m", "pip", "install", "uv"], check=True)
            print("✅ UV installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install UV: {e}")
            return False


def ensure_ruff_installed():
    """Ensure Ruff linter/formatter is installed"""
    try:
        subprocess.run(["ruff", "--version"], check=True, capture_output=True)
        print("✅ Ruff is already installed")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Ruff not found. Installing Ruff...")
        try:
            # Install Ruff using UV
            subprocess.run(["uv", "add", "ruff"], check=True)
            print("✅ Ruff installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install Ruff: {e}")
            return False


def setup_python_environment():
    """Setup Python environment with UV and Ruff"""
    print("🐍 Setting up Python development environment with UV and Ruff...")

    # Change to MCP server directory
    mcp_dir = Path(__file__).parent
    os.chdir(mcp_dir)

    # Ensure UV is installed
    if not ensure_uv_installed():
        return False

    # Initialize UV project if needed
    if not Path("pyproject.toml").exists():
        print("❌ pyproject.toml not found")
        return False

    # Install dependencies with UV
    try:
        print("📦 Installing dependencies with UV...")
        subprocess.run(["uv", "sync"], check=True)
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

    # Ensure Ruff is available
    if not ensure_ruff_installed():
        return False

    # Setup git hooks for Ruff
    setup_git_hooks()

    print("🎉 Python environment setup complete!")
    print("🔧 Use 'uv run <command>' to run Python scripts")
    print("🔍 Use 'ruff check .' to lint code")
    print("🎨 Use 'ruff format .' to format code")

    return True


def setup_git_hooks():
    """Setup git hooks for automatic Ruff checking"""
    git_hooks_dir = Path(".git/hooks")
    if not git_hooks_dir.exists():
        print("ℹ️  No git repository found, skipping git hooks setup")
        return

    pre_commit_hook = git_hooks_dir / "pre-commit"

    hook_content = """#!/usr/bin/env bash
# Auto-run Ruff on commit
echo "🔍 Running Ruff checks..."

# Run Ruff check
if ! ruff check .; then
    echo "❌ Ruff check failed. Please fix the issues and try again."
    exit 1
fi

# Run Ruff format check
if ! ruff format --check .; then
    echo "❌ Code formatting check failed. Run 'ruff format .' to fix."
    exit 1
fi

echo "✅ Ruff checks passed!"
"""

    try:
        with open(pre_commit_hook, "w") as f:
            f.write(hook_content)
        pre_commit_hook.chmod(0o755)
        print("✅ Git pre-commit hook installed")
    except Exception as e:
        print(f"⚠️  Failed to setup git hooks: {e}")


def run_ruff_check():
    """Run Ruff linting"""
    try:
        print("🔍 Running Ruff linting...")
        result = subprocess.run(["ruff", "check", "."], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Ruff linting passed!")
        else:
            print("❌ Ruff linting failed:")
            print(result.stdout)
            print(result.stderr)
        return result.returncode == 0
    except FileNotFoundError:
        print("❌ Ruff not found. Please install Ruff first.")
        return False


def run_ruff_format():
    """Run Ruff formatting"""
    try:
        print("🎨 Running Ruff formatting...")
        result = subprocess.run(["ruff", "format", "."], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Ruff formatting completed!")
        else:
            print("❌ Ruff formatting failed:")
            print(result.stdout)
            print(result.stderr)
        return result.returncode == 0
    except FileNotFoundError:
        print("❌ Ruff not found. Please install Ruff first.")
        return False


if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "check":
            run_ruff_check()
        elif command == "format":
            run_ruff_format()
        elif command == "setup":
            setup_python_environment()
        else:
            print(f"Unknown command: {command}")
            print("Available commands: setup, check, format")
    else:
        setup_python_environment()
