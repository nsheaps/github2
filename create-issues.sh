#!/bin/bash
# Script to create GitHub issues from ISSUES_TO_CREATE.md
# This script requires gh CLI to be authenticated
#
# Usage: ./create-issues.sh
#
# Note: This script is provided as a convenience. It should be run by a user
# with appropriate GitHub permissions, NOT by the automated agent.

set -e

REPO="nsheaps/github2"

# Check if gh is authenticated
if ! gh auth status >/dev/null 2>&1; then
    echo "Error: gh CLI is not authenticated. Please run 'gh auth login' first."
    exit 1
fi

echo "This script will create 85 GitHub issues in the repository $REPO"

# Check if running in CI/non-interactive mode
if [ -t 0 ]; then
    # Interactive mode - prompt user
    echo "Press Ctrl+C to cancel, or Enter to continue..."
    read
else
    # Non-interactive mode (CI) - auto-continue
    echo "Running in non-interactive mode (CI detected)"
fi

# Issue 1: Migrate to Bun Package Manager/Runtime
gh issue create \
  --repo "$REPO" \
  --title "Migrate to Bun Package Manager/Runtime" \
  --body "The original requirement was to use Bun as the package manager and runtime for this React SPA. However, during project initialization, \`bun init -y\` resulted in a panic/crash with \"Assertion failure: Expected metadata to be set\". The project currently uses npm + Vite instead. Once Bun stabilizes or the issue is resolved, we should consider migrating to Bun for better performance.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L5-L15" \
  --label "enhancement,future,dependencies"

# Issue 2: Setup React SPA with TypeScript
gh issue create \
  --repo "$REPO" \
  --title "Setup React SPA with TypeScript" \
  --body "Complete the setup of React SPA with TypeScript as part of the core application foundation.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L21" \
  --label "core,setup"

# Issue 3: Configure Vite for Development and Production Builds
gh issue create \
  --repo "$REPO" \
  --title "Configure Vite for Development and Production Builds" \
  --body "Finalize Vite configuration for both development and production builds.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L22" \
  --label "build,configuration"

# Issue 4: Setup Base Routing Structure
gh issue create \
  --repo "$REPO" \
  --title "Setup Base Routing Structure" \
  --body "Implement the base routing structure for the application.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L23" \
  --label "routing,architecture"

# Issue 5: Implement GitHub OAuth Login Flow
gh issue create \
  --repo "$REPO" \
  --title "Implement GitHub OAuth Login Flow" \
  --body "Implement GitHub OAuth login flow using OAuth App (not GitHub App).

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L27" \
  --label "authentication,oauth"

# Issue 6: Create Login Component/Page
gh issue create \
  --repo "$REPO" \
  --title "Create Login Component/Page" \
  --body "Build the login component/page for the authentication flow.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L28" \
  --label "ui,authentication"

# Issue 7: Implement Token Management with localStorage
gh issue create \
  --repo "$REPO" \
  --title "Implement Token Management with localStorage" \
  --body "Implement secure token management using localStorage for storing authentication tokens.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L29" \
  --label "authentication,storage"

# Issue 8: Add Auto-login on Revisit Functionality
gh issue create \
  --repo "$REPO" \
  --title "Add Auto-login on Revisit Functionality" \
  --body "Implement functionality to automatically log users in when they revisit the application if they have a valid stored token.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L30" \
  --label "authentication,ux"

# Issue 9: Implement Logout Functionality
gh issue create \
  --repo "$REPO" \
  --title "Implement Logout Functionality" \
  --body "Add logout functionality that properly clears tokens and session data.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L31" \
  --label "authentication"

# Issue 10: Create API Service for GitHub Rate Limit Endpoint
gh issue create \
  --repo "$REPO" \
  --title "Create API Service for GitHub Rate Limit Endpoint" \
  --body "Build an API service to interact with GitHub's rate limit endpoint for monitoring API usage.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L35" \
  --label "api,rate-limit"

# Issue 11: Build Control Panel Component
gh issue create \
  --repo "$REPO" \
  --title "Build Control Panel Component" \
  --body "Create a control panel component for managing rate limit viewer settings.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L36" \
  --label "ui,rate-limit"

# Issue 12: Implement Configurable Polling Interval
gh issue create \
  --repo "$REPO" \
  --title "Implement Configurable Polling Interval" \
  --body "Add a dropdown selector that allows users to configure the polling interval for rate limit checks.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L37" \
  --label "ui,rate-limit,configuration"

# Issue 13: Add Real-time Chart/Graph for Rate Limit Visualization
gh issue create \
  --repo "$REPO" \
  --title "Add Real-time Chart/Graph for Rate Limit Visualization" \
  --body "Implement a real-time chart or graph to visualize rate limit data over time.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L38" \
  --label "ui,visualization,rate-limit"

# Issue 14: Display Current Rate Limit Status
gh issue create \
  --repo "$REPO" \
  --title "Display Current Rate Limit Status" \
  --body "Show the current rate limit status prominently in the UI.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L39" \
  --label "ui,rate-limit"

# Issue 15: Configure ESLint for TypeScript/JavaScript/TSX/JSX
gh issue create \
  --repo "$REPO" \
  --title "Configure ESLint for TypeScript/JavaScript/TSX/JSX" \
  --body "Set up ESLint configuration for all TypeScript and JavaScript file types.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L43" \
  --label "linting,code-quality"

# Issue 16: Add Prettier for Code Formatting
gh issue create \
  --repo "$REPO" \
  --title "Add Prettier for Code Formatting" \
  --body "Configure Prettier for consistent code formatting across the project.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L44" \
  --label "formatting,code-quality"

# Issue 17: Add Markdownlint for Markdown Files
gh issue create \
  --repo "$REPO" \
  --title "Add Markdownlint for Markdown Files" \
  --body "Set up markdownlint for maintaining consistent Markdown file formatting.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L45" \
  --label "linting,documentation"

# Issue 18: Add YAML Linting
gh issue create \
  --repo "$REPO" \
  --title "Add YAML Linting" \
  --body "Add YAML linting (yamllint or similar) for configuration files.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L46" \
  --label "linting,code-quality"

# Issue 19: Add JSON Linting/Validation
gh issue create \
  --repo "$REPO" \
  --title "Add JSON Linting/Validation" \
  --body "Implement JSON linting and validation for JSON configuration files.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L47" \
  --label "linting,code-quality"

# Issue 20: Create Lint Scripts in package.json
gh issue create \
  --repo "$REPO" \
  --title "Create Lint Scripts in package.json" \
  --body "Add comprehensive lint scripts to package.json for easy execution.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L48" \
  --label "tooling,scripts"

# Issue 21: Setup Vitest for Unit Testing
gh issue create \
  --repo "$REPO" \
  --title "Setup Vitest for Unit Testing" \
  --body "Configure Vitest as the unit testing framework.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L52" \
  --label "testing,setup"

# Issue 22: Setup React Testing Library
gh issue create \
  --repo "$REPO" \
  --title "Setup React Testing Library" \
  --body "Set up React Testing Library for component testing.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L53" \
  --label "testing,setup"

# Issue 23: Write Tests for Authentication Flow
gh issue create \
  --repo "$REPO" \
  --title "Write Tests for Authentication Flow" \
  --body "Create comprehensive tests for the authentication flow including login, logout, and token management.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L54" \
  --label "testing,authentication"

# Issue 24: Write Tests for Rate Limit Polling Logic
gh issue create \
  --repo "$REPO" \
  --title "Write Tests for Rate Limit Polling Logic" \
  --body "Implement tests for the rate limit polling logic to ensure it works correctly.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L55" \
  --label "testing,rate-limit"

# Issue 25: Write Tests for Chart Rendering
gh issue create \
  --repo "$REPO" \
  --title "Write Tests for Chart Rendering" \
  --body "Add tests to verify chart rendering works correctly with various data inputs.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L56" \
  --label "testing,visualization"

# Issue 26: Add Test Scripts to package.json
gh issue create \
  --repo "$REPO" \
  --title "Add Test Scripts to package.json" \
  --body "Include test scripts in package.json for running the test suite.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L57" \
  --label "testing,scripts"

# Issue 27: Update README with Project Overview
gh issue create \
  --repo "$REPO" \
  --title "Update README with Project Overview" \
  --body "Enhance README with a comprehensive project overview.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L61" \
  --label "documentation"

# Issue 28: Add Setup Instructions
gh issue create \
  --repo "$REPO" \
  --title "Add Setup Instructions" \
  --body "Document detailed setup instructions for new developers.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L62" \
  --label "documentation,onboarding"

# Issue 29: Document OAuth App Configuration
gh issue create \
  --repo "$REPO" \
  --title "Document OAuth App Configuration" \
  --body "Provide clear documentation on how to configure the GitHub OAuth App.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L63" \
  --label "documentation,authentication"

# Issue 30: Document CI/CD Setup Process
gh issue create \
  --repo "$REPO" \
  --title "Document CI/CD Setup Process" \
  --body "Document the CI/CD setup process and workflows.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L64" \
  --label "documentation,ci-cd"

# Issue 31: Add Usage Guide
gh issue create \
  --repo "$REPO" \
  --title "Add Usage Guide" \
  --body "Create a usage guide for end users of the application.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L65" \
  --label "documentation"

# Issue 32: Document Environment Variables Needed
gh issue create \
  --repo "$REPO" \
  --title "Document Environment Variables Needed" \
  --body "List and document all required environment variables for the application.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L66" \
  --label "documentation,configuration"

# Issue 33: Create Validation Workflow (Lint All File Types)
gh issue create \
  --repo "$REPO" \
  --title "Create Validation Workflow (Lint All File Types)" \
  --body "Set up a GitHub Actions validation workflow that lints all file types.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L70" \
  --label "ci-cd,linting"

# Issue 34: Create Test Workflow
gh issue create \
  --repo "$REPO" \
  --title "Create Test Workflow" \
  --body "Implement a GitHub Actions workflow for running tests.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L71" \
  --label "ci-cd,testing"

# Issue 35: Create Build Workflow
gh issue create \
  --repo "$REPO" \
  --title "Create Build Workflow" \
  --body "Set up a GitHub Actions workflow for building the application.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L72" \
  --label "ci-cd,build"

# Issue 36: Create Deploy to GitHub Pages Workflow
gh issue create \
  --repo "$REPO" \
  --title "Create Deploy to GitHub Pages Workflow" \
  --body "Implement a GitHub Actions workflow to deploy the application to GitHub Pages.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L73" \
  --label "ci-cd,deployment"

# Issue 37: Configure GitHub Pages Settings
gh issue create \
  --repo "$REPO" \
  --title "Configure GitHub Pages Settings" \
  --body "Set up and configure GitHub Pages settings for the repository.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L74" \
  --label "deployment,configuration"

# Issue 38: Setup Proper Base URL for GitHub Pages
gh issue create \
  --repo "$REPO" \
  --title "Setup Proper Base URL for GitHub Pages" \
  --body "Configure the correct base URL path for GitHub Pages deployment.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L75" \
  --label "deployment,configuration"

# Issue 39: Test Complete OAuth Flow
gh issue create \
  --repo "$REPO" \
  --title "Test Complete OAuth Flow" \
  --body "Perform end-to-end testing of the complete OAuth authentication flow.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L79" \
  --label "testing,authentication"

# Issue 40: Test Rate Limit Polling and Charting
gh issue create \
  --repo "$REPO" \
  --title "Test Rate Limit Polling and Charting" \
  --body "Conduct comprehensive testing of rate limit polling and charting functionality.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L80" \
  --label "testing,rate-limit"

# Issue 41: Verify All Linters Run Successfully
gh issue create \
  --repo "$REPO" \
  --title "Verify All Linters Run Successfully" \
  --body "Ensure all configured linters execute successfully without errors.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L81" \
  --label "testing,linting"

# Issue 42: Verify All Tests Pass
gh issue create \
  --repo "$REPO" \
  --title "Verify All Tests Pass" \
  --body "Confirm that all tests in the test suite pass successfully.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L82" \
  --label "testing"

# Issue 43: Verify Build Succeeds
gh issue create \
  --repo "$REPO" \
  --title "Verify Build Succeeds" \
  --body "Ensure the production build process completes successfully.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L83" \
  --label "testing,build"

# Issue 44: Verify Deployment to GitHub Pages Works
gh issue create \
  --repo "$REPO" \
  --title "Verify Deployment to GitHub Pages Works" \
  --body "Test and confirm that deployment to GitHub Pages works correctly.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L84" \
  --label "testing,deployment"

# Issue 45: Final Documentation Review
gh issue create \
  --repo "$REPO" \
  --title "Final Documentation Review" \
  --body "Conduct a comprehensive review of all documentation before release.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/TODO.md#L85" \
  --label "documentation,review"

# Issue 46: Implement URLMapper Class
gh issue create \
  --repo "$REPO" \
  --title "Implement URLMapper Class" \
  --body "Complete the implementation of the URLMapper class for bidirectional URL conversion between GitHub and GitHub2.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L280" \
  --label "feature,url-mapping"

# Issue 47: Add URL Pattern Definitions
gh issue create \
  --repo "$REPO" \
  --title "Add URL Pattern Definitions" \
  --body "Define all URL patterns for supported GitHub page types (repos, issues, PRs, commits, etc.).

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L281" \
  --label "feature,url-mapping"

# Issue 48: Add Unit Tests for All URL Patterns
gh issue create \
  --repo "$REPO" \
  --title "Add Unit Tests for All URL Patterns" \
  --body "Create comprehensive unit tests covering all URL pattern conversions.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L282" \
  --label "testing,url-mapping"

# Issue 49: Document Supported URL Patterns
gh issue create \
  --repo "$REPO" \
  --title "Document Supported URL Patterns" \
  --body "Document all supported URL patterns in the URL mapping service.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L283" \
  --label "documentation,url-mapping"

# Issue 50: Create useURLRedirect Hook
gh issue create \
  --repo "$REPO" \
  --title "Create useURLRedirect Hook" \
  --body "Develop a React hook for URL redirection functionality.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L287" \
  --label "feature,react,url-mapping"

# Issue 51: Add Redirect Button Component
gh issue create \
  --repo "$REPO" \
  --title "Add Redirect Button Component" \
  --body "Create a redirect button component for navigation between GitHub and GitHub2.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L288" \
  --label "ui,url-mapping"

# Issue 52: Integrate URL Redirection with Routing
gh issue create \
  --repo "$REPO" \
  --title "Integrate URL Redirection with Routing" \
  --body "Integrate the URL redirection system with the application's routing infrastructure.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L289" \
  --label "feature,routing,url-mapping"

# Issue 53: Add Tests for useURLRedirect Hook
gh issue create \
  --repo "$REPO" \
  --title "Add Tests for useURLRedirect Hook" \
  --body "Write tests for the useURLRedirect React hook.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L290" \
  --label "testing,react,url-mapping"

# Issue 54: Use URLMapper in Extension Content Script
gh issue create \
  --repo "$REPO" \
  --title "Use URLMapper in Extension Content Script" \
  --body "Integrate URLMapper into the browser extension's content script for GitHub page detection.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L294" \
  --label "extension,url-mapping"

# Issue 55: Add \"Open in GitHub2\" Buttons to GitHub Pages
gh issue create \
  --repo "$REPO" \
  --title "Add \"Open in GitHub2\" Buttons to GitHub Pages" \
  --body "Inject \"Open in GitHub2\" buttons onto GitHub.com pages via the browser extension.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L295" \
  --label "extension,ui"

# Issue 56: Handle Click Events in Browser Extension
gh issue create \
  --repo "$REPO" \
  --title "Handle Click Events in Browser Extension" \
  --body "Implement click event handlers for the \"Open in GitHub2\" buttons in the extension.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L296" \
  --label "extension"

# Issue 57: Test Extension on Various GitHub Pages
gh issue create \
  --repo "$REPO" \
  --title "Test Extension on Various GitHub Pages" \
  --body "Test the browser extension functionality across various GitHub page types to ensure compatibility.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L297" \
  --label "testing,extension"

# Issue 58: Decide on Gist Support
gh issue create \
  --repo "$REPO" \
  --title "Decide on Gist Support" \
  --body "Determine whether to support gist.github.com URLs in the URL mapping service. Currently marked as TBD.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L388" \
  --label "decision,url-mapping"

# Issue 59: Decide on Auto-redirect vs User Action
gh issue create \
  --repo "$REPO" \
  --title "Decide on Auto-redirect vs User Action" \
  --body "Finalize the decision on whether to auto-redirect users or require explicit user action (extension button). Currently leaning toward user action.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/specs/url-redirects/SPEC.md#L389" \
  --label "decision,ux"

# Issue 60: Add E2E Testing with Playwright
gh issue create \
  --repo "$REPO" \
  --title "Add E2E Testing with Playwright" \
  --body "Implement end-to-end testing using Playwright for comprehensive application testing.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L215" \
  --label "enhancement,testing,e2e"

# Issue 61: Add Visual Regression Testing
gh issue create \
  --repo "$REPO" \
  --title "Add Visual Regression Testing" \
  --body "Set up visual regression testing to catch unintended UI changes.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L216" \
  --label "enhancement,testing,visual"

# Issue 62: Add Performance Testing
gh issue create \
  --repo "$REPO" \
  --title "Add Performance Testing" \
  --body "Implement performance testing to monitor and optimize application speed.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L217" \
  --label "enhancement,testing,performance"

# Issue 63: Add Accessibility Testing Automation
gh issue create \
  --repo "$REPO" \
  --title "Add Accessibility Testing Automation" \
  --body "Automate accessibility testing to ensure the application meets WCAG standards.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L218" \
  --label "enhancement,testing,accessibility"

# Issue 64: Add Mutation Testing
gh issue create \
  --repo "$REPO" \
  --title "Add Mutation Testing" \
  --body "Implement mutation testing to verify the quality of the test suite.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L219" \
  --label "enhancement,testing"

# Issue 65: Add Code Coverage Reporting in CI
gh issue create \
  --repo "$REPO" \
  --title "Add Code Coverage Reporting in CI" \
  --body "Set up code coverage reporting in the CI pipeline.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L220" \
  --label "enhancement,ci-cd,testing"

# Issue 66: Add Test Reports in PR Comments
gh issue create \
  --repo "$REPO" \
  --title "Add Test Reports in PR Comments" \
  --body "Automatically post test reports as comments on pull requests.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/testing.md#L221" \
  --label "enhancement,ci-cd,testing"

# Issue 67: Add Stylelint for CSS
gh issue create \
  --repo "$REPO" \
  --title "Add Stylelint for CSS" \
  --body "Add stylelint for CSS file linting if needed for the project.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L293" \
  --label "enhancement,linting,css"

# Issue 68: Add Commitlint for Commit Messages
gh issue create \
  --repo "$REPO" \
  --title "Add Commitlint for Commit Messages" \
  --body "Implement commitlint to enforce consistent commit message formatting.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L294" \
  --label "enhancement,linting,git"

# Issue 69: Add Pre-commit Hooks (Optional)
gh issue create \
  --repo "$REPO" \
  --title "Add Pre-commit Hooks (Optional)" \
  --body "Consider adding pre-commit hooks for automated linting before commits.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L295" \
  --label "enhancement,tooling,optional"

# Issue 70: Add Import Sorting
gh issue create \
  --repo "$REPO" \
  --title "Add Import Sorting" \
  --body "Add eslint-plugin-import for automatic import statement sorting.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L296" \
  --label "enhancement,linting"

# Issue 71: Add Spell Checking in Comments/Docs
gh issue create \
  --repo "$REPO" \
  --title "Add Spell Checking in Comments/Docs" \
  --body "Implement spell checking for code comments and documentation.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L297" \
  --label "enhancement,documentation"

# Issue 72: Add License Header Checking
gh issue create \
  --repo "$REPO" \
  --title "Add License Header Checking" \
  --body "Add tooling to verify that all source files have proper license headers.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L298" \
  --label "enhancement,legal"

# Issue 73: Consider Migration to Biome
gh issue create \
  --repo "$REPO" \
  --title "Consider Migration to Biome" \
  --body "Evaluate and potentially migrate to Biome as a replacement for ESLint + Prettier.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/linting-and-formatting.md#L299" \
  --label "enhancement,tooling,evaluation"

# Issue 74: Add E2E Testing Job to CI
gh issue create \
  --repo "$REPO" \
  --title "Add E2E Testing Job to CI" \
  --body "Add an end-to-end testing job to the CI/CD pipeline.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L99" \
  --label "enhancement,ci-cd,e2e"

# Issue 75: Add Visual Regression Testing to CI
gh issue create \
  --repo "$REPO" \
  --title "Add Visual Regression Testing to CI" \
  --body "Integrate visual regression testing into the CI pipeline.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L100" \
  --label "enhancement,ci-cd,visual"

# Issue 76: Add Performance Benchmarking to CI
gh issue create \
  --repo "$REPO" \
  --title "Add Performance Benchmarking to CI" \
  --body "Add performance benchmarking to the CI pipeline to track performance over time.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L101" \
  --label "enhancement,ci-cd,performance"

# Issue 77: Add Dependency Vulnerability Scanning
gh issue create \
  --repo "$REPO" \
  --title "Add Dependency Vulnerability Scanning" \
  --body "Implement automated dependency vulnerability scanning in CI.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L102" \
  --label "enhancement,ci-cd,security"

# Issue 78: Add Code Coverage Reporting to CI
gh issue create \
  --repo "$REPO" \
  --title "Add Code Coverage Reporting to CI" \
  --body "Add code coverage reporting to the CI pipeline.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L103" \
  --label "enhancement,ci-cd,testing"

# Issue 79: Add Automatic PR Labeling Based on Changes
gh issue create \
  --repo "$REPO" \
  --title "Add Automatic PR Labeling Based on Changes" \
  --body "Implement automatic PR labeling based on the files and types of changes in the PR.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L104" \
  --label "enhancement,ci-cd,automation"

# Issue 80: Add Changeset/Release Automation
gh issue create \
  --repo "$REPO" \
  --title "Add Changeset/Release Automation" \
  --body "Implement automated changeset management and release workflows.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/principles/ci-design.md#L105" \
  --label "enhancement,ci-cd,release"

# Issue 81: Add Codeium Support
gh issue create \
  --repo "$REPO" \
  --title "Add Codeium Support" \
  --body "Add support for Codeium as an open-source alternative AI coding assistant.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/guides/ai-tool-config-and-usage.md#L302" \
  --label "enhancement,ai-tools"

# Issue 82: Configure Continue.dev for Local LLMs
gh issue create \
  --repo "$REPO" \
  --title "Configure Continue.dev for Local LLMs" \
  --body "Set up Continue.dev to work with local language models.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/guides/ai-tool-config-and-usage.md#L303" \
  --label "enhancement,ai-tools"

# Issue 83: Add Custom Copilot Instructions
gh issue create \
  --repo "$REPO" \
  --title "Add Custom Copilot Instructions" \
  --body "Create custom instructions for GitHub Copilot to improve code suggestions.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/guides/ai-tool-config-and-usage.md#L304" \
  --label "enhancement,ai-tools"

# Issue 84: Create Project-Specific AI Prompts Library
gh issue create \
  --repo "$REPO" \
  --title "Create Project-Specific AI Prompts Library" \
  --body "Build a library of project-specific prompts for AI coding assistants.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/guides/ai-tool-config-and-usage.md#L305" \
  --label "enhancement,ai-tools"

# Issue 85: Add AI-Powered Code Review Automation
gh issue create \
  --repo "$REPO" \
  --title "Add AI-Powered Code Review Automation" \
  --body "Implement AI-powered automated code review in the CI/CD pipeline.

**Source:** https://github.com/nsheaps/github2/blob/5e98118/docs/guides/ai-tool-config-and-usage.md#L306" \
  --label "enhancement,ci-cd,ai-tools"

echo ""
echo "Successfully created all 85 issues!"
