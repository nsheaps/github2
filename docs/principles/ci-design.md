# CI Design Principles

## Overview

This document outlines the principles and design decisions for Continuous Integration (CI) in the GitHub2 project.

## Core Principles

### 1. Fast Feedback
- CI pipelines should complete as quickly as possible
- Parallel job execution where dependencies allow
- Fail fast on critical errors

### 2. Comprehensive Validation
- All code changes must pass linting
- All code changes must pass tests
- All code changes must build successfully

### 3. Consistency
- CI should use the same tools as local development
- CI should produce the same results as local runs
- No "works on my machine" scenarios

### 4. Visibility
- Clear job names and step descriptions
- Upload artifacts for debugging
- Provide meaningful error messages

## Pipeline Structure

### Validation Workflow (ci.yml)

Runs on: All pushes and pull requests

Jobs:
1. **Lint** - Code quality checks
   - ESLint for TypeScript/JavaScript
   - Prettier for formatting
   - Markdownlint for documentation
   - YAML lint for workflow files

2. **Test** - Unit and integration tests
   - Vitest for test execution
   - Coverage reporting (future)

3. **Build** - Production build
   - TypeScript compilation
   - Vite bundling
   - Artifact upload

### Deployment Workflow (deploy.yml)

Runs on: Pushes to main branch

Jobs:
1. **Build** - Production build with Pages config
2. **Deploy** - Deploy to GitHub Pages

## Design Decisions

### Node Version
- **Decision**: Use Node.js 20 LTS
- **Rationale**: Stable, long-term support, compatible with all tools
- **Review Date**: Check when Node 22 becomes LTS

### Package Manager
- **Decision**: npm (not bun, yarn, or pnpm)
- **Rationale**: Native to Node.js, most compatible, no additional installation
- **Review Date**: Revisit if/when bun stabilizes

### Caching Strategy
- **Decision**: Use setup-node's built-in npm cache
- **Rationale**: Simple, reliable, maintained by GitHub
- **Implementation**: `cache: 'npm'` in setup-node action

### Parallel vs Sequential
- **Decision**: Run lint, test, and build in parallel
- **Rationale**: Faster feedback, jobs are independent
- **Exception**: Deploy requires build to complete

### Artifact Retention
- **Decision**: 7 days for build artifacts
- **Rationale**: Sufficient for debugging, minimizes storage costs
- **Review Date**: Adjust based on actual needs

## Future Enhancements

- [ ] Add E2E testing job
- [ ] Add visual regression testing
- [ ] Add performance benchmarking
- [ ] Add dependency vulnerability scanning
- [ ] Add code coverage reporting
- [ ] Add automatic PR labeling based on changes
- [ ] Add changeset/release automation

## Appendix

### Example: Adding a New Lint Check

When adding a new linter to the project:

1. Add the tool to package.json devDependencies
2. Add a npm script (e.g., `lint:newlinter`)
3. Update the main `lint` script to include it
4. Add a step in ci.yml under the lint job
5. Test locally: `npm run lint`
6. Commit and verify CI passes

### Example: Debugging CI Failures

1. Check the Actions tab in GitHub
2. Click on the failed workflow run
3. Expand the failed job and step
4. Review the error output
5. Download artifacts if available
6. Reproduce locally: `npm ci && npm run lint && npm test && npm run build`
7. Fix the issue
8. Commit and push to re-trigger CI
