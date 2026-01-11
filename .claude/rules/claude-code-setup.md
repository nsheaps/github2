# GitHub2 - Claude Code Configuration

## Overview

This repository is configured for Claude Code (CLI and Web). The configuration enables:

- SessionStart hooks for automatic environment setup
- MCP servers for enhanced capabilities
- Structured tool permissions
- Code review skill from the official plugins repository

## Quick Reference

### Build Commands

```bash
npm ci                 # Install dependencies (preferred)
npm run lint           # Run all linters
npm test               # Run tests
npm run build          # Build for production
npm run dev            # Start development server
```

### Full Validation (Before Pushing)

```bash
npm ci && npm run lint && npm test && npm run build
```

## Claude Code Configuration Files

| File | Purpose |
|------|---------|
| `.claude/settings.json` | Claude Code project settings, hooks, permissions |
| `.claude/rules/` | Directory containing rule symlinks |
| `.mcp.json` | MCP server configuration |
| `scripts/claude/sessionstart.sh` | SessionStart hook script |

## Hooks

### SessionStart Hook

The `scripts/claude/sessionstart.sh` script runs on:
- **startup** - Initial Claude Code launch
- **resume** - Resuming a session with `--resume` or `/resume`
- **clear** - After `/clear` command
- **compact** - After context compaction

The hook:
1. Installs npm dependencies
2. Persists environment variables (in web environment)
3. Verifies project setup

## MCP Servers

Configured in `.mcp.json`:

| Server | Purpose |
|--------|---------|
| `thinking` | Structured thinking and reasoning |
| `context7` | Context management and memory |
| `filesystem` | File system operations |
| `github` | GitHub API integration |
| `git` | Git repository operations |
| `sequential-thinking` | Step-by-step reasoning |
| `memory` | Persistent session memory |
| `fetch` | HTTP fetch operations |

## Tool Permissions

### Allowed (No Confirmation)
- **WebSearch** - Web searches
- **WebFetch** - Specific domains (GitHub, Anthropic, React, MDN, etc.)
- **File Tools** - Read, Write, Edit, Glob, Grep
- **Task Management** - TodoWrite, Task, Skill
- **Safe Bash** - npm, npx, git (read ops), ls, mkdir, etc.

### Ask (Requires Confirmation)
- **Git Write Ops** - git add, commit, push, reset
- **File Ops** - rm, mv, cp
- **Generic Bash** - Unspecified bash commands
- **Shell Control** - KillShell, TaskOutput

### Denied
- Sensitive files (.env, secrets, credentials)

## Plugins

The code-review plugin from the official Anthropic marketplace is enabled:
- Reference: `code-review@anthropics`
- Use `/code-review` command to run automated PR review

## Project Structure

```
github2/
├── .claude/
│   ├── settings.json                   # Claude Code settings
│   ├── user-home-claude                -> ~/.claude (symlink for access)
│   ├── rules/
│   │   ├── copilot-instructions        -> ../../.github/instructions/
│   │   ├── copilot-instructions.md     -> ../../.github/copilot-instructions.md
│   │   └── claude-code-setup.md        # This file
│   └── sessions/                       # Session-specific data
├── .github/
│   ├── copilot-instructions.md         # Main coding agent instructions
│   ├── instructions/                   # Additional instruction files
│   └── workflows/                      # CI/CD pipelines
├── .mcp.json                           # MCP server configuration
├── scripts/
│   └── claude/
│       └── sessionstart.sh             # SessionStart hook
├── src/                                # React application source
└── docs/                               # Documentation
```

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build:** Vite 7
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint 9 (flat config), Prettier, Markdownlint, YAML-lint
- **CI/CD:** GitHub Actions
- **Deployment:** GitHub Pages

## Important Notes

1. **Package Manager:** Always use `npm ci` (not yarn or bun)
2. **Node Version:** 20+ required
3. **Linting:** All linters must pass before committing
4. **Testing:** Run tests after code changes
5. **Documentation:** Update AI documentation after completing tasks

## Related Documentation

- `.github/copilot-instructions.md` - Detailed coding agent instructions
- `docs/principles/` - Development principles (testing, linting, CI)
- `docs/specs/` - Feature specifications
- `README.md` - Project overview and quick start
