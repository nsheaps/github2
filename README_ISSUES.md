# GitHub Issues Sync Guide

This repository automatically syncs GitHub issues from TODOs documented in the codebase.

## What's Included

### 1. ISSUES_TO_CREATE.md

Documentation of all 85 issues with:

- Detailed descriptions
- Permalinks to source documentation (commit 5e98118)
- Suggested labels
- Organized by category

### 2. sync-issues.py

Simple Python script that syncs issues:

- Parses ISSUES_TO_CREATE.md
- Creates missing issues (using title as unique identifier)
- Skips issues that already exist

### 3. .github/workflows/sync-issues.yml

Automated workflow that syncs issues when ISSUES_TO_CREATE.md changes are pushed to main.

## How It Works

The sync is simple:

1. Script reads ISSUES_TO_CREATE.md
2. Fetches existing open issues from GitHub
3. For each TODO:
   - If an open issue with the same title exists → skip
   - If no matching issue exists → create it

**Key point**: Issue titles are unique identifiers. GitHub doesn't allow duplicate titles, so this naturally prevents duplicates.

## Running the Sync

### Automatic (Recommended)

Push changes to ISSUES_TO_CREATE.md on the `main` branch, and the workflow runs automatically.

Or manually trigger:

1. Go to [Actions tab](https://github.com/nsheaps/github2/actions)
2. Select "Sync Issues from TODOs"
3. Click "Run workflow"

### Manual

```bash
gh auth login
python3 sync-issues.py
```

## Issue Categories

| Category | Count |
|----------|-------|
| Core Application | 4 |
| Authentication | 5 |
| Rate Limit Viewer | 5 |
| Linting & Code Quality | 6 |
| Testing | 12 |
| Documentation | 6 |
| CI/CD | 14 |
| URL Mapping/Redirects | 14 |
| Future Enhancements | 19 |
| **TOTAL** | **85** |

## Source Documentation

All issues reference documentation from merged PR #2 (commit 5e98118):

- `TODO.md` - Main TODO checklist
- `docs/specs/url-redirects/SPEC.md` - URL redirection specification
- `docs/principles/testing.md` - Testing principles
- `docs/principles/linting-and-formatting.md` - Linting enhancements
- `docs/principles/ci-design.md` - CI/CD enhancements
- `docs/guides/ai-tool-config-and-usage.md` - AI tools enhancements
