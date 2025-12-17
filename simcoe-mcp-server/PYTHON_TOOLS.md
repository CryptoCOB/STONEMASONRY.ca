# MCP Server Python Development Configuration

This directory now includes modern Python development tooling with UV and Ruff integration.

## Tools Configured:

### 🚀 UV (Package Manager)
- **Ultra-fast Python package installer and resolver**
- Replaces pip/pip-tools for dependency management
- Configuration in `pyproject.toml`

### 🔍 Ruff (Linter & Formatter)
- **Extremely fast Python linter and code formatter**
- Replaces flake8, black, isort, and more
- Configuration in `pyproject.toml`

## Quick Start:

```bash
# Setup Python environment
npm run setup:python

# Install dependencies with UV
npm run uv:sync

# Lint code with Ruff
npm run ruff:check

# Format code with Ruff
npm run ruff:format

# Auto-fix linting issues
npm run ruff:fix
```

## Manual Commands:

```bash
# UV commands
uv sync                 # Install/update dependencies
uv add package_name     # Add new dependency
uv remove package_name  # Remove dependency

# Ruff commands
ruff check .           # Lint all Python files
ruff format .          # Format all Python files
ruff check . --fix     # Auto-fix linting issues
```

## Development Workflow:

1. **Setup**: `npm run setup:python` (one-time)
2. **Install deps**: `npm run uv:sync`
3. **Code**: Write Python code
4. **Format**: `npm run ruff:format`
5. **Lint**: `npm run ruff:check`
6. **Fix**: `npm run ruff:fix` (if needed)

## Files Added:

- `pyproject.toml` - Python project configuration
- `setup-python-tools.py` - Setup script for UV/Ruff
- `src/python-tools-manager.py` - Python tools management class

## Integration:

The MCP server now knows to always use UV and Ruff for Python development. The configuration is stored in the TypeScript code and the system will automatically prefer these tools when working with Python components.
