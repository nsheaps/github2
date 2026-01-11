---
title: Implement bidirectional sync between .github/issues/*.md and GitHub Issues
labels: [enhancement, automation, github-actions]
assignees: []
---

## Implement Bidirectional Sync Between Issue Docs and GitHub Issues

## Task
Create a system that keeps `.github/issues/*.md` files in sync with GitHub Issues bidirectionally. When docs are created/updated, corresponding issues are created/updated. When issues are created/updated on GitHub, corresponding docs are created/updated.

## Sub-tasks

### State Machine Implementation
1. Implement Code/Doc/Issue state machine with the following logic:
   - **Code NO, Doc NO, Issue YES**
     - PR: Do nothing
     - Push to main: Close orphaned issue
   - **Code NO, Doc YES, Issue YES**
     - PR: Do nothing
     - Push to main: Update doc => issue
   - **Code NO, Doc YES, Issue NO**
     - PR: Do nothing
     - Push to main: Create issue from doc and rename doc to prefix issue number
   - **Code YES, Doc NO, Issue NO**
     - PR: Create doc with hardlink to line of todo
     - Push to main: Create issue, then doc and prefix with issue number (format: `123-issue-name.md`)
   - **Code YES, Doc YES, Issue NO**
     - PR: Ensure doc has hardlink to line of todo, else make new doc with hardlink
     - Push to main: Create issue, then rename doc to prefix with issue number
   - **Code YES, Doc YES, Issue YES**
     - Sync doc to issue

### Issue Event Handling
2. When issue is created/updated on GitHub:
   - Search for `{number}-*.md` files in `.github/issues/`
   - If found: Sync issue => doc
   - If not found: Do nothing

3. When issue is closed on GitHub:
   - Delete corresponding `.github/issues/{number}-*.md` file

### Doc to Issue Sync
4. When new doc is pushed to main without issue number:
   - Create GitHub issue
   - Rename doc to prefix with issue number using `git mv`
   - Push rename commit with `[skip ci]`

5. When existing doc is updated:
   - Update corresponding GitHub issue with doc contents

### File Naming Convention
6. Implement file naming rules:
   - Issue docs (from TODOs in code): `{issue-name}.md` → `{number}-{issue-name}.md`
   - Issue name is kebab-case, derived from first 30 chars of todo line
   - If issue has number prefix, file renamed to match kebab-case of issue title
   - Use `git mv` in separate commits to preserve history when renaming

### Frontmatter Management
7. Parse and serialize YAML frontmatter in issue docs using established library (e.g., `gray-matter`)
8. Frontmatter fields: `title`, `number`, `labels`, `assignees`

### Workflow Integration
9. Create GitHub Actions workflow that triggers on:
   - Push to main (for doc => issue sync)
   - Pull request (for TODO scanning - see separate task)
   - Issue opened/edited/closed events (for issue => doc sync)

10. Implement workflow concurrency controls:
    - Parallelism of 1 per context to prevent race conditions
    - Cancel in-progress runs on PRs
    - Run on every SHA on main (no cancellation)

11. All automated commits must include `[skip ci]` to prevent infinite loops

### Additional Requirements
12. Follow lowercase workflow and job naming convention (e.g., `sync / issues`)
13. Use Yarn 4 + Corepack setup sequence in workflows
14. Keep all code files under 500 lines
15. Organize code in modular architecture (common/, sync/, etc.)
16. Use existing well-maintained libraries instead of custom implementations where possible
17. Implement comprehensive tests with >70% coverage

## Goal
Represent all GitHub Issues as markdown docs in repo:
- Update issue on GitHub → file gets updated in repo
- Update file in repo → issue gets updated (or created if not found)
- Push new doc to main without issue number → create issue + rename doc

## References
- State machine logic defined in is-this-a-requirement.md
- File naming conventions
- Frontmatter requirements
- Workflow concurrency requirements
