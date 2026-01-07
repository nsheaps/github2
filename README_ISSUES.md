# GitHub Issues Sync Guide

This repository contains automated tooling to sync GitHub issues from TODOs and future work items documented in the codebase.

## What's Included

### 1. ISSUES_TO_CREATE.md

A comprehensive markdown document containing all 85 issues with:

- Detailed descriptions of what needs to be done
- Permalinks to exact line numbers in source documentation (commit 5e98118)
- Suggested labels for categorization
- Organized by source file/category

### 2. sync-issues.py

A Python script that syncs issues from ISSUES_TO_CREATE.md to GitHub:

- Uses hash-based deduplication to prevent duplicates
- Creates missing issues
- Closes duplicate issues (keeps one open per TODO)
- Each issue contains an HTML comment with a unique sync hash

### 3. .github/workflows/sync-issues.yml

A GitHub Actions workflow that automatically syncs issues when:

- Changes are pushed to `main` branch affecting ISSUES_TO_CREATE.md
- The workflow can be manually triggered via `workflow_dispatch`

**Important**: This script requires GitHub CLI authentication and appropriate repository permissions.

## How Issues Are Synced

### Automatic Sync via GitHub Actions (Recommended)

When changes to `ISSUES_TO_CREATE.md` are pushed to the `main` branch, the workflow automatically:

1. Parses all TODO items from ISSUES_TO_CREATE.md
2. Generates a unique hash for each item based on title + source
3. Checks for existing issues with matching hashes (in HTML comments)
4. Creates missing issues with the sync hash in an HTML comment
5. Closes duplicate issues (keeps one open per TODO)

Alternatively, you can trigger the workflow manually:

1. Go to the [Actions tab](https://github.com/nsheaps/github2/actions)
2. Select "Sync Issues from TODOs" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

The workflow uses the built-in `GITHUB_TOKEN` with `issues: write` permission.

### Manual Sync with Python Script

If you have the GitHub CLI installed and authenticated:

```bash
# Ensure you're authenticated
gh auth login

# Run the sync script from the repository root
python3 sync-issues.py
```

### Manual Creation via GitHub UI

1. Open [ISSUES_TO_CREATE.md](ISSUES_TO_CREATE.md)
2. For each issue, navigate to <https://github.com/nsheaps/github2/issues/new>
3. Copy the title, description, and apply labels from the document
4. **Important**: Add the sync hash HTML comment to prevent duplicates:
   `<!-- sync-hash: [hash-from-title-and-source] -->`

## Deduplication System

Each TODO item has a unique hash generated from its title and source URL. This hash is:

- Stored in an HTML comment in the issue body: `<!-- sync-hash: abc123... -->`
- Used to identify and prevent duplicate issues
- Allows the sync script to maintain exactly one issue per TODO

When duplicates are detected:

- One issue is kept open
- Other duplicates are automatically closed with a comment

## Issue Categories

| Category | Count | Examples |
|----------|-------|----------|
| Core Application | 4 | React setup, Vite config, routing |
| Authentication | 5 | OAuth, login, token management |
| Rate Limit Viewer | 5 | API service, UI components, charting |
| Linting & Code Quality | 6 | ESLint, Prettier, markdownlint |
| Testing | 12 | Vitest, React Testing Library, various test types |
| Documentation | 6 | README, setup guides, API docs |
| CI/CD | 14 | Workflows, deployment, GitHub Pages |
| URL Mapping/Redirects | 14 | URLMapper, hooks, browser extension |
| Future Enhancements | 19 | E2E testing, performance, security, AI tools |
| **TOTAL** | **85** | |

## Labels Used

The following labels are used across the issues:

- **Type**: feature, enhancement, decision
- **Area**: ui, api, extension, documentation, testing
- **Technology**: react, oauth, css, git
- **Priority**: future, optional
- **Specific**: rate-limit, url-mapping, authentication, ci-cd, linting, performance, security, accessibility, e2e, visual, ai-tools

## Source Documentation

All issues reference documentation from the merged PR #2 (commit 5e98118):

- `TODO.md` - Main TODO checklist
- `docs/specs/url-redirects/SPEC.md` - URL redirection specification
- `docs/principles/testing.md` - Testing principles and future enhancements
- `docs/principles/linting-and-formatting.md` - Linting future enhancements
- `docs/principles/ci-design.md` - CI/CD future enhancements
- `docs/guides/ai-tool-config-and-usage.md` - AI tools future enhancements

## Notes

- Each issue describes **what** needs to be done, not **how** to implement it
- Issues are designed to be actionable and clear
- Labels are suggestions and can be adjusted based on repository label conventions
- Some issues may be dependent on others (documented in descriptions where relevant)
- Issues marked as "future" or "enhancement" are lower priority
- The sync system ensures no duplicate issues are created

## Questions?

If you need to modify the issue descriptions or have questions about specific issues, refer to the source documentation linked in each issue.
