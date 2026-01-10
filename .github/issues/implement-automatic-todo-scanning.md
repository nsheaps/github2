---
title: Implement automatic TODO scanning on pull requests
labels: [enhancement, automation, github-actions]
assignees: []
---

## Implement Automatic TODO Scanning on Pull Requests

## Task
Create a system that automatically scans the codebase for TODO comments when a pull request is opened or updated, creates/updates documentation files for each TODO, and commits them to the PR branch for review before merge.

## Sub-tasks

### TODO Scanner Implementation
1. Create scanner that recursively searches codebase for TODO comments
2. Support multiple file types (JavaScript, TypeScript, Python, etc.)
3. Extract TODO text, file path, and line number for each TODO found
4. Skip binary files by checking for null bytes in first 8000 bytes
5. Skip ignored directories (node_modules, .git, dist, build, etc.)

### Documentation Generation
6. Generate unique identifier for each TODO (hash based on TODO text + file location)
7. Create issue doc file in `.github/issues/` with naming pattern: `{issue-name}.md`
   - Issue name is kebab-case, derived from first 30 chars of TODO line
8. Include YAML frontmatter with: `title`, `labels`, `assignees`
9. Include hardlink to exact line of code where TODO exists
10. If TODO text has changed, update existing doc

### PR Integration
11. Create GitHub Actions workflow that triggers on:
    - Pull request opened
    - Pull request synchronized (new commits pushed)
12. Run TODO scanner on all files in the PR
13. Create/update issue doc files for any TODOs found
14. Commit changes to the PR branch with clear commit message
15. If no TODOs found or no changes needed, skip commit

### Workflow Configuration
16. Use lowercase workflow and job naming (e.g., `scan / todos`)
17. Implement proper Yarn 4 + Corepack setup sequence
18. Add concurrency controls to cancel in-progress runs when new commits pushed

### Code Organization
19. Keep all code files under 500 lines
20. Organize in modular structure (scanner/, doc-generator/, etc.)
21. Use existing libraries where appropriate (e.g., for file operations)
22. Implement comprehensive tests with >70% coverage

## Goal
Ensure all TODOs in code have corresponding documentation before PR is merged:
- Developer adds TODO in code
- PR opened → workflow scans and creates doc
- Doc committed to PR for review
- When PR merged to main, doc exists and ready for issue creation (see bidirectional-sync task)

## References
- TODO scanning requirements
- File naming conventions
- Integration with bidirectional sync system
