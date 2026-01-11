---
title: Setup Yarn 4 monorepo with workspaces and NX
labels: [infrastructure, tooling]
assignees: []
---

## Setup Yarn 4 Monorepo with Workspaces and NX

## Task
Configure the repository as a Yarn 4 monorepo with workspace structure and NX for task orchestration and caching.

## Sub-tasks

### Yarn 4 + Corepack Setup
1. Ensure `package.json` has `"packageManager": "yarn@4.6.0"`
2. Create `.yarnrc.yml` with Yarn 4 configuration
3. Ensure `yarn.lock` is committed (not `package-lock.json`)
4. Document Corepack initialization: `corepack enable && corepack install`

### Workspace Structure
5. Configure root `package.json` with workspaces array
6. Create `.github/package.json` for actions workspace
   - Name: `@github2/actions`
   - Include dependencies: `@octokit/rest`, `js-yaml`, etc.
   - Include devDependencies: `vitest`, `typescript`, `tsx`, etc.
7. Create `.github/tsconfig.json` extending from root
8. Ensure proper path resolution in tsconfig (use `../tsconfig.json` not `../../`)

### NX Configuration
9. Install NX as dev dependency in root: `nx@^21.0.0`
10. Create `nx.json` with configuration for:
    - Task orchestration
    - Caching strategy
    - Parallel execution settings
11. Define NX targets for common tasks:
    - `build` - Build all workspaces
    - `test` - Run tests across all workspaces
    - `lint` - Lint all workspaces
12. Add npm scripts to root package.json:
    - `test:all` - Run tests in all workspaces using NX
    - `build:all` - Build all workspaces using NX
    - `lint:all` - Lint all workspaces using NX

### GitHub Actions Integration
13. Update all GitHub Actions workflows to use correct Yarn 4 setup:
    - Node.js setup (without `cache: 'yarn'`)
    - `corepack enable`
    - `corepack install`
    - `yarn install`
14. Never use `cache: 'yarn'` in `setup-node` before enabling corepack
15. Document this pattern in `.github/instructions/github-actions-workflows.instructions.md`

### Testing Infrastructure
16. Create `.github/vitest.config.ts` for test configuration
17. Set up test workspace in `.github` folder
18. Configure test coverage reporting (>70% target)

### Documentation
19. Update `docs/specs/project-requirements.md` with monorepo structure
20. Document workspace organization and NX usage
21. Add developer setup instructions

## Goal
Modern monorepo structure with:
- Yarn 4 for package management (not npm)
- Separate workspace for GitHub Actions code
- NX for efficient task orchestration
- Proper TypeScript configuration across workspaces
- CI/CD workflows that correctly use Yarn 4 + Corepack

## References
- Yarn 4 + Corepack requirements
- Monorepo workspace structure
- NX task orchestration discussions
- GitHub Actions Yarn setup patterns
