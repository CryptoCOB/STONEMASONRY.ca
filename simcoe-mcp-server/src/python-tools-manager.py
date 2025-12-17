"""
Python Development Tools Manager for MCP Server
Automatically ensures UV and Ruff are configured and used
"""

import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional


class PythonToolsManager:
    """Manages UV and Ruff for Python development in MCP server"""

    def __init__(self, project_root: Optional[Path] = None):
        self.project_root = project_root or Path(__file__).parent
        self.pyproject_path = self.project_root / "pyproject.toml"

    def ensure_uv_available(self) -> bool:
        """Ensure UV package manager is available"""
        try:
            result = subprocess.run(
                ["uv", "--version"], capture_output=True, text=True, check=True
            )
            print(f"✅ UV is available: {result.stdout.strip()}")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("❌ UV not found. Please install with: pip install uv")
            return False

    def ensure_ruff_available(self) -> bool:
        """Ensure Ruff linter/formatter is available"""
        try:
            result = subprocess.run(
                ["ruff", "--version"], capture_output=True, text=True, check=True
            )
            print(f"✅ Ruff is available: {result.stdout.strip()}")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("❌ Ruff not found. Installing with UV...")
            try:
                subprocess.run(["uv", "add", "ruff"], check=True, cwd=self.project_root)
                print("✅ Ruff installed successfully")
                return True
            except subprocess.CalledProcessError as e:
                print(f"❌ Failed to install Ruff: {e}")
                return False

    def run_uv_command(
        self, args: List[str], **kwargs: Any
    ) -> subprocess.CompletedProcess[bytes]:
        """Run UV command with proper error handling"""
        try:
            return subprocess.run(
                ["uv"] + args, check=True, cwd=self.project_root, **kwargs
            )
        except subprocess.CalledProcessError as e:
            print(f"❌ UV command failed: uv {' '.join(args)}")
            print(f"Error: {e}")
            raise

    def run_ruff_command(
        self, args: List[str], **kwargs: Any
    ) -> subprocess.CompletedProcess[bytes]:
        """Run Ruff command with proper error handling"""
        try:
            return subprocess.run(
                ["ruff"] + args, check=True, cwd=self.project_root, **kwargs
            )
        except subprocess.CalledProcessError as e:
            print(f"❌ Ruff command failed: ruff {' '.join(args)}")
            print(f"Error: {e}")
            raise

    def install_dependencies(self) -> bool:
        """Install Python dependencies using UV"""
        if not self.ensure_uv_available():
            return False

        try:
            print("📦 Installing dependencies with UV...")
            self.run_uv_command(["sync"])
            print("✅ Dependencies installed successfully")
            return True
        except subprocess.CalledProcessError:
            return False

    def lint_code(self, fix: bool = False) -> bool:
        """Lint Python code with Ruff"""
        if not self.ensure_ruff_available():
            return False

        try:
            args = ["check", "."]
            if fix:
                args.append("--fix")

            print(f"🔍 Running Ruff linting{'(with fixes)' if fix else ''}...")
            self.run_ruff_command(args)
            print("✅ Ruff linting passed!")
            return True
        except subprocess.CalledProcessError:
            print("❌ Ruff linting failed")
            return False

    def format_code(self, check_only: bool = False) -> bool:
        """Format Python code with Ruff"""
        if not self.ensure_ruff_available():
            return False

        try:
            args = ["format"]
            if check_only:
                args.append("--check")
            args.append(".")

            print(
                f"🎨 Running Ruff formatting{'(check only)' if check_only else ''}..."
            )
            self.run_ruff_command(args)
            print("✅ Ruff formatting completed!")
            return True
        except subprocess.CalledProcessError:
            print("❌ Ruff formatting failed")
            return False

    def get_python_tools_info(self) -> Dict[str, str]:
        """Get information about available Python tools"""
        info = {}

        # UV info
        try:
            result = subprocess.run(["uv", "--version"], capture_output=True, text=True)
            info["uv"] = (
                result.stdout.strip() if result.returncode == 0 else "Not available"
            )
        except FileNotFoundError:
            info["uv"] = "Not installed"

        # Ruff info
        try:
            result = subprocess.run(
                ["ruff", "--version"], capture_output=True, text=True
            )
            info["ruff"] = (
                result.stdout.strip() if result.returncode == 0 else "Not available"
            )
        except FileNotFoundError:
            info["ruff"] = "Not installed"

        # Python info
        info["python"] = (
            f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
        )

        # Project config
        info["pyproject_exists"] = str(self.pyproject_path.exists())

        return info

    def setup_development_environment(self) -> bool:
        """Setup complete development environment with UV and Ruff"""
        print("🐍 Setting up Python development environment...")

        # Check if pyproject.toml exists
        if not self.pyproject_path.exists():
            print(f"❌ pyproject.toml not found at {self.pyproject_path}")
            return False

        # Ensure tools are available
        if not self.ensure_uv_available():
            return False

        # Install dependencies
        if not self.install_dependencies():
            return False

        # Ensure Ruff is available
        if not self.ensure_ruff_available():
            return False

        # Run initial formatting and linting
        self.format_code()
        self.lint_code(fix=True)

        print("🎉 Python development environment setup complete!")
        print("📝 Available commands:")
        print("  - uv sync: Install/update dependencies")
        print("  - ruff check .: Lint code")
        print("  - ruff format .: Format code")
        print("  - ruff check . --fix: Lint and auto-fix issues")

        return True


# CLI interface
if __name__ == "__main__":
    manager = PythonToolsManager()

    if len(sys.argv) < 2:
        manager.setup_development_environment()
    else:
        command = sys.argv[1]

        if command == "setup":
            manager.setup_development_environment()
        elif command == "install":
            manager.install_dependencies()
        elif command == "lint":
            fix = "--fix" in sys.argv
            manager.lint_code(fix=fix)
        elif command == "format":
            check_only = "--check" in sys.argv
            manager.format_code(check_only=check_only)
        elif command == "info":
            info = manager.get_python_tools_info()
            print("🔧 Python Tools Information:")
            for key, value in info.items():
                print(f"  {key}: {value}")
        else:
            print(f"Unknown command: {command}")
            print("Available commands: setup, install, lint, format, info")
