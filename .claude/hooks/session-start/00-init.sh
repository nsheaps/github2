#!/usr/bin/env bash
# Claude Code SessionStart Hook for github2
# This script runs when Claude Code starts, resumes, or clears a session

set -e

# Get the project directory
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(dirname "$(dirname "$(dirname "$0")")")}"

echo "[SessionStart] Starting session setup for github2..."
echo "[SessionStart] Project directory: $PROJECT_DIR"
echo "[SessionStart] Remote environment: ${CLAUDE_CODE_REMOTE:-false}"

# Install npm dependencies if package.json exists
if [ -f "$PROJECT_DIR/package.json" ]; then
    echo "[SessionStart] Installing npm dependencies..."
    cd "$PROJECT_DIR"

    # Use npm ci for clean install (faster, exact versions from lockfile)
    if [ -f "$PROJECT_DIR/package-lock.json" ]; then
        npm ci --silent 2>/dev/null || npm install --silent
    else
        npm install --silent
    fi

    echo "[SessionStart] npm dependencies installed."
fi

# Persist environment variables for subsequent commands (web environment only)
if [ -n "$CLAUDE_ENV_FILE" ]; then
    echo "[SessionStart] Persisting environment variables..."
    {
        echo "export NODE_ENV=development"
        echo "export PATH=\"\$PATH:$PROJECT_DIR/node_modules/.bin\""
    } >> "$CLAUDE_ENV_FILE"
fi

# Verify the setup by checking critical files
echo "[SessionStart] Verifying project setup..."
if [ -f "$PROJECT_DIR/vite.config.ts" ]; then
    echo "[SessionStart] Vite configuration found."
fi
if [ -f "$PROJECT_DIR/vitest.config.ts" ]; then
    echo "[SessionStart] Vitest configuration found."
fi
if [ -d "$PROJECT_DIR/node_modules" ]; then
    echo "[SessionStart] node_modules directory present."
fi

echo "[SessionStart] Session setup complete!"
exit 0
