# Local Tooling Parity with CI

## Overview

This document ensures that everything CI does can be replicated locally. No "works on CI but not locally" scenarios.

## Core Principle

**If CI can run it, you can run it locally - with the same result.**

## Tool Management - mise

### Why mise?

`mise` (formerly rtx) is a polyglot runtime and tool version manager that:
- Manages Node.js, Python, Go, etc. versions
- Defines tasks similar to package.json scripts
- Works across the team (same versions everywhere)
- Faster than nvm/asdf
- Single source of truth for tool versions

### Installation

```bash
# macOS/Linux
curl https://mise.run | sh

# Or via package manager
brew install mise              # macOS
apt install mise               # Ubuntu (if available)

# Add to shell
echo 'eval "$(mise activate bash)"' >> ~/.bashrc  # bash
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc    # zsh
```

### Configuration

Create `.mise.toml` in project root:

```toml
[tools]
node = "20"                    # Node.js 20.x (matches CI)
# Future: Add other tools as needed
# python = "3.11"
# go = "1.21"

[tasks.install]
run = "npm ci"
description = "Install dependencies"

[tasks.dev]
run = "npm run dev"
description = "Start development server"

[tasks.lint]
run = "npm run lint"
description = "Run all linters"

[tasks.test]
run = "npm test"
description = "Run tests"

[tasks.build]
run = "npm run build"
description = "Build for production"

[tasks.ci]
run = ["mise run lint", "mise run test", "mise run build"]
description = "Run full CI validation locally"
```

### Usage

```bash
# Install tools (run once, or when .mise.toml changes)
mise install

# Run tasks
mise run install     # Install deps
mise run dev         # Start dev server
mise run lint        # Run linters
mise run test        # Run tests
mise run build       # Build
mise run ci          # Run complete CI locally

# Or use shortcuts
mise run dev         # Start dev server
```

### Benefits

1. **Version Consistency**: Same Node version locally and in CI
2. **Easy Onboarding**: New developers run `mise install` and have correct tools
3. **Task Consistency**: `mise run ci` runs exactly what CI runs
4. **Cross-Platform**: Works on macOS, Linux, Windows (WSL)
5. **Fast**: Faster than nvm or asdf

## CI Parity Checklist

### Lint

**CI Does**:
```yaml
- npm run lint:eslint
- npm run lint:prettier
- npm run lint:md
- npm run lint:yaml
```

**Local Equivalent**:
```bash
mise run lint
# or
npm run lint
```

**Result**: Same linting errors locally and in CI

### Test

**CI Does**:
```yaml
- npm test
```

**Local Equivalent**:
```bash
mise run test
# or
npm test
```

**Result**: Same test results locally and in CI

### Build

**CI Does**:
```yaml
- npm run build
```

**Local Equivalent**:
```bash
mise run build
# or
npm run build
```

**Result**: Same build output locally and in CI

### Full CI Validation

**CI Does**:
```yaml
jobs:
  lint: ...
  test: ...
  build: ...
```

**Local Equivalent**:
```bash
mise run ci
# Runs: lint → test → build
```

**Result**: Catch CI failures before pushing

## Package Manager Parity

### CI Uses npm ci

**Why**: Deterministic installs from package-lock.json

**Local Should Use**:
```bash
npm ci        # For clean install (deletes node_modules)
# or
npm install   # For adding new packages
```

**Don't**:
- Don't commit package-lock.json changes unless adding/updating deps
- Don't use `npm install --force` without good reason
- Don't delete package-lock.json

## Environment Parity

### Node Version

**CI**: Node.js 20 (defined in `.github/workflows/*.yml`)

**Local**: Node.js 20 (managed by mise or nvm)

**Verify**:
```bash
node --version   # Should be 20.x
```

### Environment Variables

**CI**: Uses GitHub Secrets and Environment Variables

**Local**: Uses `.env` file (not committed)

**Setup**:
1. Copy `.env.example` to `.env`
2. Fill in values (e.g., `VITE_GITHUB_CLIENT_ID`)
3. Never commit `.env`

**Example**:
```bash
cp .env.example .env
# Edit .env with your values
```

## Dependency Parity

### Install Dependencies

**CI Does**:
```bash
npm ci
```

**Local Should Do**:
```bash
mise run install
# or
npm ci
```

**After Pulling**:
Always run `npm ci` after pulling changes to package-lock.json

### Adding Dependencies

```bash
# Add production dependency
npm install package-name

# Add dev dependency
npm install -D package-name

# Commit both package.json and package-lock.json
git add package.json package-lock.json
git commit -m "Add package-name"
```

## Build Output Parity

### Vite Config

The `vite.config.ts` should produce identical builds locally and in CI.

**Current Config**:
- Base URL: `/github2/`
- Output: `dist/`
- Source maps: Yes

**Verify**:
```bash
npm run build
ls -la dist/
# Should match CI artifact structure
```

## Debugging CI Failures

### Step 1: Reproduce Locally

```bash
# Clean state
rm -rf node_modules dist
npm ci

# Run what CI runs
mise run ci
# or
npm run lint && npm test && npm run build
```

### Step 2: Check Versions

```bash
node --version    # Should be 20.x
npm --version     # Should be 10.x
```

### Step 3: Check Environment

```bash
# Are all env vars set?
cat .env

# Is package-lock.json up to date?
git status
```

### Step 4: Check Diffs

```bash
# What changed since last working state?
git diff main
```

## Future: Tilt for Local Development

### What is Tilt?

Tilt (tiltdev/tilt) is a toolkit for microservice development. For GitHub2, we'll use it to:
- Run a mock GitHub Pages backend locally
- Hot reload on file changes
- Emulate production environment

### Planned Setup (Future)

Create `Tiltfile`:

```python
# Tiltfile (Python-like syntax)

# Load Vite dev server
local_resource(
  'npm-install',
  'npm ci',
  deps=['package.json', 'package-lock.json']
)

local_resource(
  'vite-dev',
  serve_cmd='npm run dev',
  deps=['src'],
  labels=['frontend']
)

# Future: Mock GitHub API server
# local_resource(
#   'mock-api',
#   serve_cmd='npm run mock-api',
#   deps=['mocks'],
#   labels=['backend']
# )
```

**Usage** (future):
```bash
tilt up          # Start all services
tilt down        # Stop all services
tilt logs        # View logs
```

**Benefits**:
- One command starts everything
- Automatic rebuild on changes
- Better than manually running npm run dev

**Status**: Not implemented yet (see roadmap)

## Mise Tasks Reference

### Standard Tasks

```bash
mise run install    # Install dependencies
mise run dev        # Start dev server
mise run lint       # Run all linters
mise run test       # Run tests
mise run build      # Build for production
mise run ci         # Full CI validation
```

### Future Tasks

```bash
mise run e2e        # Run E2E tests (future)
mise run preview    # Preview production build
mise run deploy     # Deploy (if needed)
```

## Troubleshooting

### mise command not found

**Solution**:
1. Install mise: `curl https://mise.run | sh`
2. Activate in shell: `eval "$(mise activate bash)"`
3. Restart terminal

### Different Node version

**Solution**:
```bash
mise install       # Install correct version
mise use node@20   # Switch to Node 20
node --version     # Verify
```

### CI passes, local fails

**Solution**:
1. Clean install: `rm -rf node_modules && npm ci`
2. Check Node version: `node --version`
3. Check for local config overrides
4. Check .env file

### Local passes, CI fails

**Solution**:
1. Did you commit all files? `git status`
2. Is package-lock.json committed?
3. Are tests deterministic (no random data)?
4. Check CI logs for specific error

## Best Practices

### Before Committing

```bash
# Run full CI locally
mise run ci

# Or individual steps
npm run lint
npm test
npm run build
```

### After Pulling

```bash
# Update dependencies if package-lock.json changed
npm ci

# Update tools if .mise.toml changed
mise install
```

### When Adding Dependencies

```bash
# Add the package
npm install package-name

# Verify it works
npm run build
npm test

# Commit both files
git add package.json package-lock.json
git commit -m "Add package-name for X feature"
```

## Resources

- [mise Documentation](https://mise.jdx.dev/)
- [Tilt Documentation](https://docs.tilt.dev/)
- [npm ci Documentation](https://docs.npmjs.com/cli/v10/commands/npm-ci)
