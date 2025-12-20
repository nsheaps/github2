# TODO - GitHub Rate Limit Viewer

## Requirements Not Implemented

### Using Bun as Package Manager/Runtime

**Status**: ❌ Not Implemented  
**Original Requirement**: "React SPA + Bun"  
**Issue**: Bun installation encountered critical errors during project initialization:

- `bun init -y` resulted in a panic/crash: "Assertion failure: Expected metadata to be set"
- Unable to use Bun for package management or runtime
  **Workaround**: Using npm + Vite instead for project setup and package management
  **Impact**: Project functions identically with npm, but users wanting to use Bun will need to manually migrate
  **Future Action**: Once Bun stabilizes or the issue is resolved, consider migrating to Bun for better performance

## Implementation Checklist

### Core Application

- [ ] Setup React SPA with TypeScript
- [ ] Configure Vite for development and production builds
- [ ] Setup base routing structure

### GitHub OAuth Authentication

- [ ] Implement GitHub OAuth login flow (OAuth App, not GitHub App)
- [ ] Create login component/page
- [ ] Token management with localStorage
- [ ] Auto-login on revisit functionality
- [ ] Logout functionality

### Rate Limit Viewer

- [ ] Create API service for GitHub rate limit endpoint
- [ ] Build control panel component
- [ ] Implement configurable polling interval (dropdown selector)
- [ ] Real-time chart/graph for rate limit visualization over time
- [ ] Display current rate limit status

### Linting & Code Quality

- [ ] Configure ESLint for TypeScript/JavaScript/TSX/JSX
- [ ] Add Prettier for code formatting
- [ ] Add markdownlint for Markdown files
- [ ] Add YAML linting (yamllint or similar)
- [ ] Add JSON linting/validation
- [ ] Create lint scripts in package.json

### Testing

- [ ] Setup Vitest for unit testing
- [ ] Setup React Testing Library
- [ ] Write tests for authentication flow
- [ ] Write tests for rate limit polling logic
- [ ] Write tests for chart rendering
- [ ] Add test scripts to package.json

### Documentation

- [ ] Update README with project overview
- [ ] Add setup instructions
- [ ] Document OAuth app configuration
- [ ] Document CI/CD setup process
- [ ] Add usage guide
- [ ] Document environment variables needed

### CI/CD - GitHub Actions

- [ ] Create validation workflow (lint all file types)
- [ ] Create test workflow
- [ ] Create build workflow
- [ ] Create deploy to GitHub Pages workflow
- [ ] Configure GitHub Pages settings
- [ ] Setup proper base URL for GitHub Pages

### Final Steps

- [ ] Test complete OAuth flow
- [ ] Test rate limit polling and charting
- [ ] Verify all linters run successfully
- [ ] Verify all tests pass
- [ ] Verify build succeeds
- [ ] Verify deployment to GitHub Pages works
- [ ] Final documentation review
