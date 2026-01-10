# Project Requirements and Conventions

This document captures all project requirements, conventions, and technical decisions gathered throughout development. These requirements must be followed for all future development work.

## Package Management

### Yarn 4 with Corepack
- **Package Manager**: Yarn 4.6.0 (defined in `package.json` `packageManager` field)
- **Installation Method**: Corepack (Node.js built-in package manager manager)
- **Lockfile**: `yarn.lock` (NOT `package-lock.json` from npm)
- **Setup Sequence**: 
  1. `corepack enable`
  2. `corepack install`
  3. `yarn install`

**Rationale**: Yarn 4 provides modern workspace features, better performance, and built-in caching. Corepack ensures version consistency across environments.

## Monorepo Architecture

### Structure
- **Tool**: NX for task orchestration and build caching
- **Workspaces**: Yarn workspaces
  - Root workspace: Main application code
  - `.github/` workspace: GitHub Actions composite action code

### Workspace Configuration
```json
{
  "workspaces": [
    ".",
    ".github"
  ]
}
```

**Rationale**: Separates CI/automation code from application code while maintaining shared dependency management.

## GitHub Actions & CI/CD

### Composite Actions
- **Location**: `.github/actions/<action-name>/`
- **Language**: TypeScript
- **Self-Contained**: All source code must be within the action folder
- **Structure**:
  - `action.yml` - Action definition
  - `src/` - TypeScript source code
  - `tests/` - Test files
  - `package.json` - Dependencies (if needed)

### Workflow Best Practices
- **Yarn 4 Setup**: ALWAYS use corepack before setup-node caching
- **Concurrency**: Set appropriate concurrency groups to prevent race conditions
- **Parallelism**: 1 per context on main, cancel-in-progress on PRs
- **Path Filters**: Use path triggers to avoid unnecessary workflow runs
- **Documentation**: See `.github/instructions/github-actions-workflows.instructions.md`

**Reference**: `.github/instructions/github-actions-workflows.instructions.md` contains detailed workflow patterns and common pitfalls.

## TODO/Issue Synchronization System

### Purpose
Bidirectional sync between code TODOs, markdown documentation, and GitHub Issues.

### State Machine
The system manages 6 possible states:
1. Code YES, Doc NO, Issue NO → Create doc (PR) / Create issue + doc (main)
2. Code YES, Doc YES, Issue NO → Create issue
3. Code YES, Doc YES, Issue YES → Sync doc/issue
4. Code NO, Doc YES, Issue NO → Create issue
5. Code NO, Doc YES, Issue YES → Sync doc/issue
6. Code NO, Doc NO, Issue YES → Close issue

### Workflow Triggers
- **PR**: Scan code for TODOs, create/update docs
- **Main (push)**: Full state machine, create issues, rename docs with issue numbers
- **Issue opened/edited**: Update corresponding doc with `[skip ci]`

### File Conventions
- **Location**: `.github/issues/`
- **Naming**: 
  - Without issue: `todo-{id}-{slug}.md`
  - With issue: `{number}-{title-slug}.md`
- **Frontmatter**:
  ```yaml
  ---
  title: Issue Title
  labels: [label1, label2]
  assignees: []
  ---
  ```

**Rationale**: Keeps issue tracking in sync with codebase, enables offline issue management, provides Git history for issue changes.

## Testing Requirements

### Coverage
- **Target**: >90% code coverage for action code
- **Framework**: Vitest
- **Location**: `<action-folder>/tests/`
- **Structure**: Mirror source code structure

### Test Execution
- **Separate Workflow**: `test-actions.yml` dedicated to testing
- **Triggers**: Changes to action code, manual dispatch
- **Jobs**: Run tests with coverage reporting

**Rationale**: Ensures composite actions work correctly before use in sync workflows.

## Code Organization

### File Size Limits
- **Maximum**: 500 lines per file
- **Approach**: Separate concerns into modules/libraries
- **Structure**: Logical grouping by functionality

### Module Organization
```
.github/actions/<action-name>/
├── src/
│   ├── common/         # Shared utilities
│   ├── <feature>/      # Feature-specific code
│   └── index.ts        # Entry point
├── tests/
│   ├── common/
│   └── <feature>/
├── action.yml
└── package.json
```

**Rationale**: Maintainability, testability, and code reuse.

## TypeScript Configuration

### Monorepo tsconfig
- **Root**: `/tsconfig.json` - Base configuration
- **Workspace**: `.github/tsconfig.json` extends `../tsconfig.json`
- **Compiler Options**: NodeNext module resolution, ES2022 target

**Critical**: Workspace tsconfig must use relative path `../tsconfig.json` (one level up), NOT `../../tsconfig.json`.

## Documentation Standards

### Required Documentation
1. **Workflow Instructions**: `.github/instructions/*.instructions.md`
2. **Project Specs**: `docs/specs/*.md`
3. **README**: Action-specific READMEs in action folders
4. **Copilot Instructions**: Reference to specs in `.github/instructions/copilot-requirements.instructions.md`

### Content Requirements
- Only document what has been explicitly requested
- No architecture or design speculation
- Clear, concise, actionable information
- Examples where helpful

**Rationale**: Documentation prevents repeating mistakes and provides context for future development.

## Security & Quality

### Security Scanning
- **Tool**: CodeQL
- **Timing**: After code review, before task completion
- **Action**: Fix vulnerabilities in changed code, document others

### Code Review
- **Tool**: Automated code review before completion
- **Action**: Address relevant feedback, re-review after significant changes

### Linting & Formatting
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Markdownlint**: Documentation quality
- **YAML lint**: Workflow file validation

## Commit Conventions

### Commit Messages
- Clear, single-line summary
- Include context in body when needed
- Reference issue numbers when applicable

### Skip CI
- Use `[skip ci]` in commit messages to prevent workflow loops
- Used when syncing from GitHub issues to docs

## Development Workflow

### Making Changes
1. Make minimal, surgical changes
2. Test changes locally when possible
3. Commit frequently with `report_progress`
4. Verify CI passes after each meaningful change
5. Use incremental CI checks (10s, 20s, 30s intervals)

### CI Monitoring
- Check CI status using GitHub MCP tools
- Wait incrementally: 10s → 20s → 30s → 30s → 30s (max ~2min)
- Fix failures immediately
- Never proceed with failing CI

**Rationale**: Fast feedback loops, minimal context switching, high confidence in changes.

## Historical Context

### Evolution
1. Started with Python scripts for issue sync
2. Moved to TypeScript for better tooling and type safety
3. Created reusable composite action
4. Added comprehensive tests
5. Established monorepo structure with Yarn 4
6. Documented patterns to prevent CI failures

### Key Lessons
- Yarn 4 requires corepack before any cache operations
- Separate test workflows from operational workflows
- Self-contained actions are portable and reusable
- Bidirectional sync requires careful state management
- Documentation prevents repeated mistakes

## References

- **Workflow Best Practices**: `.github/instructions/github-actions-workflows.instructions.md`
- **Yarn 4 Documentation**: <https://yarnpkg.com/>
- **Corepack Documentation**: <https://nodejs.org/api/corepack.html>
- **GitHub Actions**: <https://docs.github.com/en/actions>
- **NX Documentation**: <https://nx.dev/>
