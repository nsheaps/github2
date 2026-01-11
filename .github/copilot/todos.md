# Collected TODOs

All TODO items from the codebase, collected for synthesis into parallelizable tasks.

## Core Application
- Setup React SPA with TypeScript
- Configure Vite for development and production builds
- Setup base routing structure

## GitHub OAuth Authentication
- Implement GitHub OAuth login flow (OAuth App)
- Create login component/page
- Token management with localStorage
- Auto-login on revisit
- Logout functionality

## Rate Limit Viewer
- Create API service for GitHub rate limit endpoint
- Build control panel component
- Configurable polling interval (dropdown)
- Real-time chart/graph for visualization
- Display current rate limit status

## Linting & Code Quality
- Configure ESLint for TypeScript/JavaScript/TSX/JSX
- Add Prettier for code formatting
- Add markdownlint
- Add YAML linting
- Add JSON linting/validation
- Create lint scripts in package.json

## Testing
- Setup Vitest
- Setup React Testing Library
- Tests for authentication flow
- Tests for rate limit polling logic
- Tests for chart rendering
- Add test scripts to package.json

## Documentation
- Update README with project overview
- Add setup instructions
- Document OAuth app configuration
- Document CI/CD setup
- Add usage guide
- Document environment variables

## CI/CD
- Validation workflow (lint all types)
- Test workflow
- Build workflow
- Deploy to GitHub Pages workflow
- Configure GitHub Pages settings
- Setup base URL for GitHub Pages

## URL Mapping/Redirects
- Implement URLMapper class
- Create React hook for URL mapping
- Build browser extension
- Configuration UI
- Persistent storage
- Import/export functionality
- Pattern matching system
- Edge case handling

## Future Enhancements
- Migrate to Bun (when stable)
- E2E testing with Playwright
- Visual regression testing
- Performance monitoring
- Security hardening
- Accessibility improvements
- AI-assisted code review
