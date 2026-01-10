---
title: Create CI workflow for linting, testing, and building
labels: [ci-cd, github-actions, infrastructure]
assignees: []
---

## Create CI Workflow for Linting, Testing, and Building

## Task
Create a unified CI workflow that runs linting, testing, and building jobs on pull requests and pushes to main.

## Sub-tasks

### Workflow Structure
1. Create `.github/workflows/ci.yml` with lowercase name: `ci`
2. Configure three jobs with lowercase names:
   - `check` - Linting and formatting validation
   - `test` - Run tests across all workspaces
   - `build` - Build application

### Triggers
3. Configure workflow to run on:
   - Pull requests to main branch
   - Push to main branch
   - Manual workflow_dispatch

### Concurrency Controls
4. Add concurrency configuration:
   - Group: `ci-${{ github.ref }}`
   - Cancel in-progress: `true` for PRs, `false` for main branch
   - Prevents race conditions and duplicate runs

### Check Job (ci / check)
5. Implement linting job:
   - Setup Node.js 20
   - Enable corepack (`corepack enable`)
   - Install corepack (`corepack install`)
   - Install dependencies (`yarn install`)
   - Run linting across all workspaces (`yarn lint:all` or NX equivalent)
   - Run formatting check (`yarn format:check` or prettier)
   - Run YAML linting if applicable

### Test Job (ci / test)
6. Implement test job:
   - Setup Node.js 20
   - Enable corepack
   - Install corepack
   - Install dependencies
   - Run tests across all workspaces (`yarn test:all` using NX)
   - Generate coverage report
   - Upload coverage artifacts (optional)
   - Fail if coverage below 70% threshold

### Build Job (ci / build)
7. Implement build job:
   - Setup Node.js 20
   - Enable corepack
   - Install corepack
   - Install dependencies
   - Run build across all workspaces (`yarn build:all` using NX)
   - Upload build artifacts if needed

### Job Dependencies
8. Configure job execution order:
   - `check` and `test` run in parallel
   - `build` depends on both `check` and `test` passing

### Workflow Naming Convention
9. Follow lowercase naming throughout:
   - Workflow name: `ci` (not "CI" or "Continuous Integration")
   - Job names: `check`, `test`, `build` (not "Check", "Test", "Build")
   - Display will show: `ci / check`, `ci / test`, `ci / build`

### Common Setup Pattern
10. Document the required setup sequence in workflow:
    ```yaml
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        # DO NOT use cache: 'yarn' here
    
    - name: Enable Corepack
      run: corepack enable
    
    - name: Install Corepack
      run: corepack install
    
    - name: Install dependencies
      run: yarn install
    ```

### Documentation
11. Update `.github/instructions/github-actions-workflows.instructions.md` with:
    - Correct Yarn 4 + Corepack setup pattern
    - Common mistakes to avoid (e.g., using `cache: 'yarn'` before corepack)
    - Workflow naming conventions
    - Concurrency control patterns

12. Update `docs/specs/project-requirements.md` with CI workflow requirements

## Goal
Reliable CI pipeline that:
- Validates code quality (linting, formatting)
- Runs comprehensive tests across all workspaces
- Builds the application successfully
- Uses correct Yarn 4 + Corepack setup
- Follows repository naming conventions
- Prevents race conditions with proper concurrency controls

## References
- Lowercase workflow naming requirements
- Yarn 4 + Corepack setup sequence
- Workflow concurrency controls
- GitHub Actions best practices documentation
