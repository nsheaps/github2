# GitHub Issues Creation Guide

This repository contains prepared materials for creating GitHub issues based on all TODOs and future work items from the recently merged PR #2.

## What's Included

### 1. ISSUES_TO_CREATE.md
A comprehensive markdown document containing all 85 issues with:
- Detailed descriptions of what needs to be done
- Permalinks to exact line numbers in source documentation (commit 5e98118)
- Suggested labels for categorization
- Organized by source file/category

### 2. create-issues.sh
A bash script that can be used to bulk-create all 85 issues using the GitHub CLI (`gh`).

**Important**: This script requires GitHub CLI authentication and appropriate repository permissions.

## How to Create the Issues

### Option 1: Manual Creation via GitHub UI
1. Open [ISSUES_TO_CREATE.md](ISSUES_TO_CREATE.md)
2. For each issue, navigate to https://github.com/nsheaps/github2/issues/new
3. Copy the title, description, and apply labels from the document

### Option 2: Bulk Creation with GitHub CLI
If you have the GitHub CLI installed and authenticated:

```bash
# Ensure you're authenticated
gh auth login

# Run the script from the repository root
./create-issues.sh
```

**Note**: The script will prompt for confirmation before creating issues.

### Option 3: Using GitHub API
You can also use the GitHub API directly with a personal access token. Here's an example:

```bash
curl -X POST \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/nsheaps/github2/issues \
  -d '{
    "title": "Issue Title",
    "body": "Issue Description",
    "labels": ["label1", "label2"]
  }'
```

## Issue Categories

The 85 issues are categorized as follows:

- **Core Application**: 4 issues (React setup, Vite config, routing)
- **Authentication**: 5 issues (OAuth, login, token management)
- **Rate Limit Viewer**: 5 issues (API service, UI components, charting)
- **Linting & Code Quality**: 6 issues (ESLint, Prettier, markdownlint, YAML, JSON)
- **Testing**: 12 issues (Vitest, React Testing Library, test suites)
- **Documentation**: 6 issues (README, setup guides, API docs)
- **CI/CD**: 14 issues (workflows, deployment, GitHub Pages)
- **URL Mapping/Redirects**: 14 issues (URLMapper, hooks, browser extension)
- **Future Enhancements**: 19 issues (E2E testing, performance, security, AI tools)

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
- All permalinks point to specific line numbers in the codebase
- Labels are suggestions and can be adjusted based on repository label conventions
- Some issues may be dependent on others (e.g., browser extension issues depend on URL mapping completion)
- Issues marked as "future" or "enhancement" are lower priority and can be addressed after core functionality

## Questions?

If you need to modify the issue descriptions or have questions about specific issues, refer to the source documentation linked in each issue.
