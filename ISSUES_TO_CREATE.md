# GitHub Issues to Create

This document contains all TODO items and future work from the recently merged PR #2.
Each issue includes a description and permalink to the source documentation.

Repository: nsheaps/github2
Base commit: 5e98118

---

## TODO.md Items

### 1. Migrate to Bun Package Manager/Runtime

**Description:**
The original requirement was to use Bun as the package manager and runtime for this React SPA. However, during project initialization, `bun init -y` resulted in a panic/crash with "Assertion failure: Expected metadata to be set". The project currently uses npm + Vite instead. Once Bun stabilizes or the issue is resolved, we should consider migrating to Bun for better performance.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L5-L15

**Labels:** enhancement, future, dependencies

---

### 2. Setup React SPA with TypeScript

**Description:**
Complete the setup of React SPA with TypeScript as part of the core application foundation.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L21

**Labels:** core, setup

---

### 3. Configure Vite for Development and Production Builds

**Description:**
Finalize Vite configuration for both development and production builds.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L22

**Labels:** build, configuration

---

### 4. Setup Base Routing Structure

**Description:**
Implement the base routing structure for the application.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L23

**Labels:** routing, architecture

---

### 5. Implement GitHub OAuth Login Flow

**Description:**
Implement GitHub OAuth login flow using OAuth App (not GitHub App).

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L27

**Labels:** authentication, oauth

---

### 6. Create Login Component/Page

**Description:**
Build the login component/page for the authentication flow.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L28

**Labels:** ui, authentication

---

### 7. Implement Token Management with localStorage

**Description:**
Implement secure token management using localStorage for storing authentication tokens.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L29

**Labels:** authentication, storage

---

### 8. Add Auto-login on Revisit Functionality

**Description:**
Implement functionality to automatically log users in when they revisit the application if they have a valid stored token.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L30

**Labels:** authentication, ux

---

### 9. Implement Logout Functionality

**Description:**
Add logout functionality that properly clears tokens and session data.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L31

**Labels:** authentication

---

### 10. Create API Service for GitHub Rate Limit Endpoint

**Description:**
Build an API service to interact with GitHub's rate limit endpoint for monitoring API usage.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L35

**Labels:** api, rate-limit

---

### 11. Build Control Panel Component

**Description:**
Create a control panel component for managing rate limit viewer settings.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L36

**Labels:** ui, rate-limit

---

### 12. Implement Configurable Polling Interval

**Description:**
Add a dropdown selector that allows users to configure the polling interval for rate limit checks.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L37

**Labels:** ui, rate-limit, configuration

---

### 13. Add Real-time Chart/Graph for Rate Limit Visualization

**Description:**
Implement a real-time chart or graph to visualize rate limit data over time.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L38

**Labels:** ui, visualization, rate-limit

---

### 14. Display Current Rate Limit Status

**Description:**
Show the current rate limit status prominently in the UI.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L39

**Labels:** ui, rate-limit

---

### 15. Configure ESLint for TypeScript/JavaScript/TSX/JSX

**Description:**
Set up ESLint configuration for all TypeScript and JavaScript file types.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L43

**Labels:** linting, code-quality

---

### 16. Add Prettier for Code Formatting

**Description:**
Configure Prettier for consistent code formatting across the project.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L44

**Labels:** formatting, code-quality

---

### 17. Add Markdownlint for Markdown Files

**Description:**
Set up markdownlint for maintaining consistent Markdown file formatting.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L45

**Labels:** linting, documentation

---

### 18. Add YAML Linting

**Description:**
Add YAML linting (yamllint or similar) for configuration files.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L46

**Labels:** linting, code-quality

---

### 19. Add JSON Linting/Validation

**Description:**
Implement JSON linting and validation for JSON configuration files.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L47

**Labels:** linting, code-quality

---

### 20. Create Lint Scripts in package.json

**Description:**
Add comprehensive lint scripts to package.json for easy execution.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L48

**Labels:** tooling, scripts

---

### 21. Setup Vitest for Unit Testing

**Description:**
Configure Vitest as the unit testing framework.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L52

**Labels:** testing, setup

---

### 22. Setup React Testing Library

**Description:**
Set up React Testing Library for component testing.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L53

**Labels:** testing, setup

---

### 23. Write Tests for Authentication Flow

**Description:**
Create comprehensive tests for the authentication flow including login, logout, and token management.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L54

**Labels:** testing, authentication

---

### 24. Write Tests for Rate Limit Polling Logic

**Description:**
Implement tests for the rate limit polling logic to ensure it works correctly.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L55

**Labels:** testing, rate-limit

---

### 25. Write Tests for Chart Rendering

**Description:**
Add tests to verify chart rendering works correctly with various data inputs.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L56

**Labels:** testing, visualization

---

### 26. Add Test Scripts to package.json

**Description:**
Include test scripts in package.json for running the test suite.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L57

**Labels:** testing, scripts

---

### 27. Update README with Project Overview

**Description:**
Enhance README with a comprehensive project overview.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L61

**Labels:** documentation

---

### 28. Add Setup Instructions

**Description:**
Document detailed setup instructions for new developers.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L62

**Labels:** documentation, onboarding

---

### 29. Document OAuth App Configuration

**Description:**
Provide clear documentation on how to configure the GitHub OAuth App.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L63

**Labels:** documentation, authentication

---

### 30. Document CI/CD Setup Process

**Description:**
Document the CI/CD setup process and workflows.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L64

**Labels:** documentation, ci-cd

---

### 31. Add Usage Guide

**Description:**
Create a usage guide for end users of the application.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L65

**Labels:** documentation

---

### 32. Document Environment Variables Needed

**Description:**
List and document all required environment variables for the application.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L66

**Labels:** documentation, configuration

---

### 33. Create Validation Workflow (Lint All File Types)

**Description:**
Set up a GitHub Actions validation workflow that lints all file types.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L70

**Labels:** ci-cd, linting

---

### 34. Create Test Workflow

**Description:**
Implement a GitHub Actions workflow for running tests.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L71

**Labels:** ci-cd, testing

---

### 35. Create Build Workflow

**Description:**
Set up a GitHub Actions workflow for building the application.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L72

**Labels:** ci-cd, build

---

### 36. Create Deploy to GitHub Pages Workflow

**Description:**
Implement a GitHub Actions workflow to deploy the application to GitHub Pages.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L73

**Labels:** ci-cd, deployment

---

### 37. Configure GitHub Pages Settings

**Description:**
Set up and configure GitHub Pages settings for the repository.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L74

**Labels:** deployment, configuration

---

### 38. Setup Proper Base URL for GitHub Pages

**Description:**
Configure the correct base URL path for GitHub Pages deployment.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L75

**Labels:** deployment, configuration

---

### 39. Test Complete OAuth Flow

**Description:**
Perform end-to-end testing of the complete OAuth authentication flow.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L79

**Labels:** testing, authentication

---

### 40. Test Rate Limit Polling and Charting

**Description:**
Conduct comprehensive testing of rate limit polling and charting functionality.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L80

**Labels:** testing, rate-limit

---

### 41. Verify All Linters Run Successfully

**Description:**
Ensure all configured linters execute successfully without errors.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L81

**Labels:** testing, linting

---

### 42. Verify All Tests Pass

**Description:**
Confirm that all tests in the test suite pass successfully.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L82

**Labels:** testing

---

### 43. Verify Build Succeeds

**Description:**
Ensure the production build process completes successfully.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L83

**Labels:** testing, build

---

### 44. Verify Deployment to GitHub Pages Works

**Description:**
Test and confirm that deployment to GitHub Pages works correctly.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L84

**Labels:** testing, deployment

---

### 45. Final Documentation Review

**Description:**
Conduct a comprehensive review of all documentation before release.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L85

**Labels:** documentation, review

---

## URL Redirects Spec (docs/specs/url-redirects/SPEC.md)

### 46. Implement URLMapper Class

**Description:**
Complete the implementation of the URLMapper class for bidirectional URL conversion between GitHub and GitHub2.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L280

**Labels:** feature, url-mapping

---

### 47. Add URL Pattern Definitions

**Description:**
Define all URL patterns for supported GitHub page types (repos, issues, PRs, commits, etc.).

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L281

**Labels:** feature, url-mapping

---

### 48. Add Unit Tests for All URL Patterns

**Description:**
Create comprehensive unit tests covering all URL pattern conversions.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L282

**Labels:** testing, url-mapping

---

### 49. Document Supported URL Patterns

**Description:**
Document all supported URL patterns in the URL mapping service.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L283

**Labels:** documentation, url-mapping

---

### 50. Create useURLRedirect Hook

**Description:**
Develop a React hook for URL redirection functionality.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L287

**Labels:** feature, react, url-mapping

---

### 51. Add Redirect Button Component

**Description:**
Create a redirect button component for navigation between GitHub and GitHub2.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L288

**Labels:** ui, url-mapping

---

### 52. Integrate URL Redirection with Routing

**Description:**
Integrate the URL redirection system with the application's routing infrastructure.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L289

**Labels:** feature, routing, url-mapping

---

### 53. Add Tests for useURLRedirect Hook

**Description:**
Write tests for the useURLRedirect React hook.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L290

**Labels:** testing, react, url-mapping

---

### 54. Use URLMapper in Extension Content Script

**Description:**
Integrate URLMapper into the browser extension's content script for GitHub page detection.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L294

**Labels:** extension, url-mapping

---

### 55. Add "Open in GitHub2" Buttons to GitHub Pages

**Description:**
Inject "Open in GitHub2" buttons onto GitHub.com pages via the browser extension.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L295

**Labels:** extension, ui

---

### 56. Handle Click Events in Browser Extension

**Description:**
Implement click event handlers for the "Open in GitHub2" buttons in the extension.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L296

**Labels:** extension

---

### 57. Test Extension on Various GitHub Pages

**Description:**
Test the browser extension functionality across various GitHub page types to ensure compatibility.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L297

**Labels:** testing, extension

---

### 58. Decide on Gist Support

**Description:**
Determine whether to support gist.github.com URLs in the URL mapping service. Currently marked as TBD.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L388

**Labels:** decision, url-mapping

---

### 59. Decide on Auto-redirect vs User Action

**Description:**
Finalize the decision on whether to auto-redirect users or require explicit user action (extension button). Currently leaning toward user action.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L389

**Labels:** decision, ux

---

## Testing Principles (docs/principles/testing.md)

### 60. Add E2E Testing with Playwright

**Description:**
Implement end-to-end testing using Playwright for comprehensive application testing.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L215

**Labels:** enhancement, testing, e2e

---

### 61. Add Visual Regression Testing

**Description:**
Set up visual regression testing to catch unintended UI changes.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L216

**Labels:** enhancement, testing, visual

---

### 62. Add Performance Testing

**Description:**
Implement performance testing to monitor and optimize application speed.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L217

**Labels:** enhancement, testing, performance

---

### 63. Add Accessibility Testing Automation

**Description:**
Automate accessibility testing to ensure the application meets WCAG standards.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L218

**Labels:** enhancement, testing, accessibility

---

### 64. Add Mutation Testing

**Description:**
Implement mutation testing to verify the quality of the test suite.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L219

**Labels:** enhancement, testing

---

### 65. Add Code Coverage Reporting in CI

**Description:**
Set up code coverage reporting in the CI pipeline.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L220

**Labels:** enhancement, ci-cd, testing

---

### 66. Add Test Reports in PR Comments

**Description:**
Automatically post test reports as comments on pull requests.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L221

**Labels:** enhancement, ci-cd, testing

---

## Linting and Formatting (docs/principles/linting-and-formatting.md)

### 67. Add Stylelint for CSS

**Description:**
Add stylelint for CSS file linting if needed for the project.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L293

**Labels:** enhancement, linting, css

---

### 68. Add Commitlint for Commit Messages

**Description:**
Implement commitlint to enforce consistent commit message formatting.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L294

**Labels:** enhancement, linting, git

---

### 69. Add Pre-commit Hooks (Optional)

**Description:**
Consider adding pre-commit hooks for automated linting before commits.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L295

**Labels:** enhancement, tooling, optional

---

### 70. Add Import Sorting

**Description:**
Add eslint-plugin-import for automatic import statement sorting.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L296

**Labels:** enhancement, linting

---

### 71. Add Spell Checking in Comments/Docs

**Description:**
Implement spell checking for code comments and documentation.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L297

**Labels:** enhancement, documentation

---

### 72. Add License Header Checking

**Description:**
Add tooling to verify that all source files have proper license headers.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L298

**Labels:** enhancement, legal

---

### 73. Consider Migration to Biome

**Description:**
Evaluate and potentially migrate to Biome as a replacement for ESLint + Prettier.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L299

**Labels:** enhancement, tooling, evaluation

---

## CI Design (docs/principles/ci-design.md)

### 74. Add E2E Testing Job to CI

**Description:**
Add an end-to-end testing job to the CI/CD pipeline.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L99

**Labels:** enhancement, ci-cd, e2e

---

### 75. Add Visual Regression Testing to CI

**Description:**
Integrate visual regression testing into the CI pipeline.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L100

**Labels:** enhancement, ci-cd, visual

---

### 76. Add Performance Benchmarking to CI

**Description:**
Add performance benchmarking to the CI pipeline to track performance over time.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L101

**Labels:** enhancement, ci-cd, performance

---

### 77. Add Dependency Vulnerability Scanning

**Description:**
Implement automated dependency vulnerability scanning in CI.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L102

**Labels:** enhancement, ci-cd, security

---

### 78. Add Code Coverage Reporting to CI

**Description:**
Add code coverage reporting to the CI pipeline.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L103

**Labels:** enhancement, ci-cd, testing

---

### 79. Add Automatic PR Labeling Based on Changes

**Description:**
Implement automatic PR labeling based on the files and types of changes in the PR.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L104

**Labels:** enhancement, ci-cd, automation

---

### 80. Add Changeset/Release Automation

**Description:**
Implement automated changeset management and release workflows.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L105

**Labels:** enhancement, ci-cd, release

---

## AI Tool Configuration (docs/guides/ai-tool-config-and-usage.md)

### 81. Add Codeium Support

**Description:**
Add support for Codeium as an open-source alternative AI coding assistant.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/guides/ai-tool-config-and-usage.md#L302

**Labels:** enhancement, ai-tools

---

### 82. Configure Continue.dev for Local LLMs

**Description:**
Set up Continue.dev to work with local language models.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/guides/ai-tool-config-and-usage.md#L303

**Labels:** enhancement, ai-tools

---

### 83. Add Custom Copilot Instructions

**Description:**
Create custom instructions for GitHub Copilot to improve code suggestions.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/guides/ai-tool-config-and-usage.md#L304

**Labels:** enhancement, ai-tools

---

### 84. Create Project-Specific AI Prompts Library

**Description:**
Build a library of project-specific prompts for AI coding assistants.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/guides/ai-tool-config-and-usage.md#L305

**Labels:** enhancement, ai-tools

---

### 85. Add AI-Powered Code Review Automation

**Description:**
Implement AI-powered automated code review in the CI/CD pipeline.

**Source:**
https://github.com/nsheaps/github2/blob/5e98118/docs/guides/ai-tool-config-and-usage.md#L306

**Labels:** enhancement, ci-cd, ai-tools

---

## Summary

**Total Issues to Create:** 85

**Categories:**
- Core Application: 4 issues
- Authentication: 5 issues
- Rate Limit Viewer: 5 issues
- Linting & Code Quality: 6 issues
- Testing: 12 issues
- Documentation: 6 issues
- CI/CD: 14 issues
- URL Mapping/Redirects: 14 issues
- Future Enhancements: 19 issues

All issues have been documented with:
- Clear descriptions of what needs to be done
- Permalinks to exact line numbers in source documentation
- Suggested labels for categorization
