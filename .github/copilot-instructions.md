# GitHub2 - Copilot Coding Agent Instructions

<CRITICAL>
After completing any task, you MUST review what you did, summarize any learnings, and update any relevant AI documentation in the following paths:
- `.claude/rules/`
- `.claude/rules/copilot-instructions`  <== should always be a symlink to the .github/instructions/ directory
- `.claude/rules/copilot-instructions.md`  <== should always symlink to this file
` `.claude/settings.json`
- `.mcp.json`
- `**/*/AGENTS.md`
- `**/*/CLAUDE.md`
- `.github/copilot-instructions.md`
- `.github/instructions/*.instructions.md`
- scratch notes in `.github/copilot`
or documentation elsewhere in the repository such as the `docs/` folder.

Failure to do so will result in repetitive mistakes and inefficiencies in future tasks.
You WILL NOT remember anything. ALL details INCLUDING _HOW_ you should perform tasks MUST be captured in documents.
Don't forget to push the changes to those files after committing the changes to the rules.
IMPORTANT: Always avoid "wtf dude" moments
IMPORTANT: any time a requirement is given you should review all of the documentation to ensure it is up to date and any previous decisions are corrected as necessary.
</CRITICAL>

After completing any task, re-read this file to refresh your memory on the project guidelines and best practices.

## Repository Overview

**GitHub2** is a modern, high-performance alternative GitHub UI client built with React, TypeScript, and Vite. It provides a faster, more customizable interface for managing GitHub workflows with features like customizable dashboards, real-time rate limit monitoring, and advanced charting.

**Tech Stack:**

- **Frontend:** React 19 with TypeScript
- **Build Tool:** Vite 7 (development server + production bundler)
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint 9 (flat config), Prettier, Markdownlint, YAML-lint
- **CI/CD:** GitHub Actions
- **Deployment:** GitHub Pages at `https://nsheaps.github.io/github2/`
- **Package Manager:** yarn

**Repository Size:** ~15,000 files (including node_modules), 209MB total

## Critical Build and Validation Commands

**ALWAYS run these commands in this exact order. All commands have been validated and work correctly.**

### 1. Fresh Environment Setup (Required After Clone)

```bash
npm ci
```

- **ALWAYS use `npm ci`** (not `npm install`) - ensures exact dependency versions from package-lock.json
- Takes ~4-5 seconds on first run
- Required before any other command after cloning or cleaning

### 2. Linting (Run Before Committing)

```bash
# Run all linters (RECOMMENDED - takes ~5 seconds)
npm run lint

# Or run individual linters:
npm run lint:eslint      # TypeScript/JavaScript linting
npm run lint:prettier    # Code formatting check
npm run lint:md          # Markdown linting
npm run lint:yaml        # YAML linting (GitHub workflows)
```

**IMPORTANT:** All linters MUST pass before committing. CI will reject PRs with linting errors.

### 3. Testing

```bash
npm test                 # Run all tests once (~1.5 seconds)
npm run test:watch       # Watch mode for development
npm run test:ui          # UI mode for interactive testing
```

- Current tests: 58 passing tests across 3 test files
- **ALWAYS run tests** after making code changes

### 4. Building

```bash
npm run build            # TypeScript type-check + Vite production build
```

- Takes ~6 seconds from clean state, ~3 seconds incremental
- Runs two steps: `tsc -b` (type check) then `vite build` (bundle)
- Output: `dist/` directory with optimized production build
- **WARNING:** You may see a chunk size warning (>500KB) - this is expected and can be ignored

### 5. Local Development

```bash
npm run dev              # Start Vite dev server at http://localhost:5173
```

- Hot Module Replacement (HMR) enabled
- Changes reflect instantly (<100ms)
- No build step required during development

### 6. Full CI Validation (Run Before Pushing)

```bash
npm ci && npm run lint && npm test && npm run build
```

- This replicates the full CI pipeline locally
- Takes ~15 seconds total
- **STRONGLY RECOMMENDED** before pushing to avoid CI failures

## Project Structure and Architecture

### Root Directory Layout

```
github2/
├── .github/
│   └── workflows/          # CI/CD pipelines (ci.yml, deploy.yml)
├── docs/                   # Comprehensive documentation
│   ├── principles/         # Development principles (testing, linting, CI)
│   ├── specs/             # Feature specifications
│   └── guides/            # Development guides
├── src/                   # Application source code
│   ├── components/        # React components (Login, Dashboard, RateLimitChart, etc.)
│   ├── hooks/             # Custom React hooks (useAuth, useRateLimitPolling)
│   ├── services/          # API services (github.ts, auth.ts, urlMapper.ts)
│   ├── types/             # TypeScript type definitions
│   ├── test/              # Test setup and utilities
│   ├── main.tsx           # Application entry point
│   └── App.tsx            # Root component
├── public/                # Static assets
├── dist/                  # Production build output (gitignored)
├── node_modules/          # Dependencies (gitignored)
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependency versions (COMMIT THIS)
├── vite.config.ts         # Vite build configuration
├── vitest.config.ts       # Vitest test configuration
├── tsconfig.json          # TypeScript base config (references app + node configs)
├── tsconfig.app.json      # TypeScript config for src/
├── tsconfig.node.json     # TypeScript config for build tools
├── eslint.config.js       # ESLint flat config
├── .prettierrc            # Prettier formatting rules
├── .markdownlint.json     # Markdownlint configuration
└── .mise.toml             # Optional: mise task runner configuration
```

### Key Source Files

**Entry Point:**

- `src/main.tsx` - Renders the React app into the DOM
- `src/App.tsx` - Root component, handles authentication flow

**Components:**

- `src/components/Login.tsx` - GitHub token login form
- `src/components/Dashboard.tsx` - Main dashboard with rate limit viewer
- `src/components/RateLimitChart.tsx` - Recharts-based visualization
- `src/components/RateLimitStats.tsx` - Rate limit statistics display

**Services:**

- `src/services/github.ts` - GitHub API client
- `src/services/auth.ts` - Authentication service (localStorage-based)
- `src/services/urlMapper.ts` - URL mapping for GitHub redirects

**Hooks:**

- `src/hooks/useAuth.ts` - Authentication state management
- `src/hooks/useRateLimitPolling.ts` - Rate limit polling with configurable intervals

### Configuration Files Reference

**TypeScript:**

- Uses **project references** (base config delegates to app + node configs)
- `moduleResolution: "bundler"` - Vite-compatible module resolution
- `noEmit: true` - TypeScript only checks types; Vite handles transpilation
- Strict mode enabled for all files

**Vite:**

- `base: '/github2/'` - **CRITICAL:** Required for GitHub Pages deployment
- Change this if repository name changes or using custom domain
- Output: `dist/` directory

**ESLint:**

- Uses **flat config format** (eslint.config.js, not .eslintrc)
- Includes React hooks rules (prevents dependency issues)
- React refresh rules for HMR

**Prettier:**

- Single quotes, 2-space indentation, 100-char line width
- Semi-colons required, trailing commas (ES5)

## CI/CD Workflows

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers:** All pushes and pull requests to `main` or `develop` branches

**Jobs (run in parallel):**

1. **Lint** - Runs all linters (ESLint, Prettier, Markdownlint, YAML)
   - YAML lint has `continue-on-error: true` (may warn but won't fail)
2. **Test** - Runs Vitest test suite
3. **Build** - TypeScript compilation + Vite build, uploads dist/ artifact

**Node Version:** 20 (LTS)

**Key Command Sequence in CI:**

```bash
npm ci              # Install exact dependencies
npm run lint:eslint # ESLint check
npm run lint:prettier # Prettier check
npm run lint:md     # Markdownlint check
npm run lint:yaml   # YAML lint check
npm test            # Run tests
npm run build       # TypeScript + Vite build
```

### Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:** Pushes to `main` branch or manual workflow dispatch

**Jobs:**

1. **Build** - Builds production bundle
2. **Deploy** - Deploys to GitHub Pages

**Important:** Requires GitHub Pages to be enabled and set to "GitHub Actions" source in repository settings.

## Common Pitfalls and Workarounds

### 1. Build Failures

**Problem:** TypeScript errors in CI but not locally

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
npm ci
```

Always use `npm ci` in clean environments to match CI exactly.

### 2. Linting Failures

**Problem:** Prettier formatting issues

**Solution:**

```bash
npm run format      # Auto-format all files
npm run lint        # Verify formatting
```

**Problem:** ESLint errors

**Solution:**

```bash
npx eslint . --fix  # Auto-fix what's possible
npm run lint:eslint # Check remaining issues
```

### 3. Test Failures

**Problem:** Tests fail due to missing dependencies

**Solution:** Ensure test setup file exists at `src/test/setup.ts`

### 4. GitHub Pages 404 Errors

**Problem:** Deployed app shows 404

**Root Cause:** `base` in `vite.config.ts` doesn't match repository name

**Solution:** Verify `base: '/github2/'` matches your repo name or use `'/'` for custom domains

### 5. Chunk Size Warnings

**Problem:** Vite warns about chunks >500KB during build

**Solution:** This is EXPECTED and can be ignored. The warning suggests code-splitting improvements for future optimization but doesn't prevent deployment.

## Development Workflow Best Practices

### Making Code Changes

1. **Start dev server:** `npm run dev`
2. **Make changes** in `src/` - changes reflect instantly via HMR
3. **Run linters frequently:** `npm run lint` (or auto-format: `npm run format`)
4. **Run tests:** `npm test` or `npm run test:watch`
5. **Before committing:** `npm run lint && npm test && npm run build`
6. **Commit and push** - CI will validate automatically

### Test-First Development (Recommended)

- Tests are co-located with source files (e.g., `Login.tsx` + `Login.test.tsx`)
- Use React Testing Library best practices (test user behavior, not implementation)
- See `docs/principles/testing.md` for detailed guidelines

### Cleaning and Resetting

```bash
# Clean build artifacts
rm -rf dist node_modules

# Fresh install
npm ci

# Or use mise (if available)
mise run clean      # Clean everything
mise run reset      # Clean + reinstall
```

## Key Development Principles

**From docs/principles:**

1. **Testing:** Test user-facing behavior, not implementation. Aim for 80%+ coverage on critical paths.
2. **Linting:** All linters must pass. No exceptions. Auto-fix is available locally.
3. **CI Design:** Fast feedback (parallel jobs), comprehensive validation, consistency with local development.
4. **TypeScript:** Strict mode enabled. No `any` types. Use proper type definitions.

## Environment Variables

**Optional:** Create `.env` file (gitignored) for OAuth configuration:

```bash
VITE_GITHUB_CLIENT_ID=your_github_oauth_client_id_here
```

**Note:** The app works with Personal Access Tokens without OAuth setup.

## Important Notes

- **Package Manager:** Use `npm ci` (NOT `npm install`, `yarn`, or `bun`)
- **Bun is NOT supported** - attempted in early development but had critical failures (see TODO.md)
- **Node Version:** 20+ required (matches CI)
- **Browser Support:** Modern browsers (2020+), ES2022 target
- **Git Hooks:** None configured (linting happens in CI, not pre-commit)
- **Code Style:** Enforced by Prettier + ESLint. Don't debate - just run `npm run format`

## Documentation References

For deeper understanding, consult:

- `README.md` - Project overview, features, quick start
- `docs/guides/development.md` - TypeScript config, bundling, deployment details
- `docs/principles/ci-design.md` - CI pipeline design and rationale
- `docs/principles/testing.md` - Testing strategy and examples
- `docs/principles/linting-and-formatting.md` - Detailed linting rules
- `docs/DEPLOYMENT.md` - GitHub Pages deployment guide

## Trust These Instructions

These instructions have been validated by running all commands in a clean environment. If you encounter issues not documented here, the documentation may be incomplete. In that case:

1. Check the relevant docs/ file for more context
2. Verify you're using Node 20+ and npm (not other package managers)
3. Ensure you ran `npm ci` after cloning or cleaning

All build times and command outputs documented here are accurate as of the last validation.
