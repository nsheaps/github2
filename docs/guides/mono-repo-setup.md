# Mono-Repo Setup

## Overview

This document outlines the strategy for organizing GitHub2 as a mono-repository with multiple packages and shared code.

## Current State

**Status**: Single Package

The project currently exists as a single package:

```
github2/
├── src/              # Application code
├── package.json      # Dependencies
└── ...
```

**Why**: Simple to start, no mono-repo overhead needed yet

## Future Mono-Repo Structure

### Planned Structure

```
github2/
├── packages/
│   ├── app/                    # Main web application
│   │   ├── src/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   ├── extension-chrome/       # Chrome browser extension
│   │   ├── src/
│   │   ├── manifest.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── extension-firefox/      # Firefox browser extension
│   │   ├── src/
│   │   ├── manifest.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-ui/              # Shared React components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-api/             # Shared GitHub API client
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-utils/           # Shared utilities
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── tsconfig-base/          # Shared TypeScript config
│       ├── tsconfig.json
│       ├── package.json
│       └── README.md
│
├── apps/                       # Future native apps
│   ├── mobile/                 # React Native app (future)
│   └── desktop/                # Electron app (future)
│
├── docs/                       # Documentation
├── package.json                # Root package.json (workspace config)
├── pnpm-workspace.yaml         # Workspace definition (if using pnpm)
└── turbo.json                  # Turborepo config (if using)
```

## Module Organization

### Application Package (`packages/app`)

**Purpose**: Main web application

**Dependencies**:

- `@github2/shared-ui`
- `@github2/shared-api`
- `@github2/shared-utils`
- React, React Router, etc.

**Responsibilities**:

- Main application UI
- Routing
- Page components
- App-specific logic

**Build Output**: `dist/` for GitHub Pages

### Extension Packages

#### Chrome (`packages/extension-chrome`)

**Purpose**: Chrome browser extension

**Dependencies**:

- `@github2/shared-api`
- `@github2/shared-utils`
- Chrome extension APIs

**Responsibilities**:

- Content scripts (inject buttons on GitHub)
- Background service worker
- Popup UI
- Extension-specific logic

**Build Output**: `dist/` for Chrome Web Store

#### Firefox (`packages/extension-firefox`)

**Purpose**: Firefox browser extension

**Note**: May share code with Chrome extension via symlinks or shared package

### Shared Packages

#### UI Components (`packages/shared-ui`)

**Purpose**: Reusable React components

**Contents**:

- Button, Input, Modal, etc.
- Dashboard widgets
- Charts
- Common layouts

**Exported**:

```typescript
export { Button } from './components/Button';
export { DashboardWidget } from './components/DashboardWidget';
// ...
```

#### API Client (`packages/shared-api`)

**Purpose**: GitHub API integration

**Contents**:

- API client
- Type definitions for GitHub API
- Request/response handling
- Rate limit management
- Authentication

**Exported**:

```typescript
export { GitHubClient } from './client';
export type { User, Repository, Issue, PullRequest } from './types';
```

#### Utilities (`packages/shared-utils`)

**Purpose**: Framework-agnostic utilities

**Contents**:

- Date formatting
- String manipulation
- Data transformations
- Validation functions

**No React Dependencies**: Pure TypeScript

#### TypeScript Config (`packages/tsconfig-base`)

**Purpose**: Shared TypeScript configuration

**Contents**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true
    // ... common settings
  }
}
```

**Usage in other packages**:

```json
{
  "extends": "@github2/tsconfig-base",
  "compilerOptions": {
    // Package-specific overrides
  }
}
```

## Workspace Management

### Package Manager Choice

**Options**:

1. **npm workspaces** (current default)
2. **pnpm workspaces** (faster, more efficient)
3. **yarn workspaces** (legacy)

**Recommendation**: Start with npm, migrate to pnpm if needed

### npm Workspaces Setup

**Root package.json**:

```json
{
  "name": "github2-monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "dev": "npm run dev --workspace=@github2/app",
    "build": "npm run build --workspaces",
    "lint": "npm run lint --workspaces",
    "test": "npm run test --workspaces"
  }
}
```

**Install dependencies**:

```bash
# Install all workspace dependencies
npm install

# Add dependency to specific package
npm install react --workspace=@github2/app

# Add dependency to all packages
npm install typescript --workspaces
```

### Build Orchestration

**Challenge**: Build packages in dependency order

**Solution**: Use Turborepo or Nx

#### Option 1: Turborepo (Recommended)

**Install**:

```bash
npm install -D turbo
```

**turbo.json**:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {
      "cache": false
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Usage**:

```bash
# Build all packages in correct order
npx turbo build

# Run tests in all packages
npx turbo test

# Dev mode (watches all packages)
npx turbo dev
```

**Benefits**:

- Automatic dependency order
- Caching (skip unchanged packages)
- Parallel execution
- Simple configuration

#### Option 2: Nx

More powerful but heavier.

**When to use**: If we need advanced features like affected commands

## Package Versioning

### Internal Packages

**Strategy**: Use `*` or `workspace:*` for internal dependencies

**Example** (`packages/app/package.json`):

```json
{
  "dependencies": {
    "@github2/shared-ui": "workspace:*",
    "@github2/shared-api": "workspace:*"
  }
}
```

**Why**: Always use latest local version, no version conflicts

### External Packages

**Strategy**: Pin major versions, allow minor/patch updates

**Example**:

```json
{
  "dependencies": {
    "react": "^19.2.0" // 19.x.x allowed
  },
  "devDependencies": {
    "typescript": "~5.9.3" // 5.9.x allowed
  }
}
```

## Linting, Formatting, Testing

### Per-Package Configuration

**Each package can have**:

- Own `tsconfig.json` (extending base)
- Own test files (co-located with source)
- Own build configuration

**Shared across packages**:

- ESLint config (root)
- Prettier config (root)
- Testing framework (Vitest)

### Running Scripts

**All packages**:

```bash
npm run lint --workspaces
npm run test --workspaces
npm run build --workspaces
```

**Specific package**:

```bash
npm run dev --workspace=@github2/app
npm run build --workspace=@github2/extension-chrome
```

**With Turbo**:

```bash
turbo lint    # All packages
turbo test    # All packages
turbo build   # All packages (in order)
```

## Deployment

### Multi-Package Deployment

**App** (`packages/app`):

- Build: `npm run build`
- Deploy to: GitHub Pages
- Trigger: Push to main

**Chrome Extension** (`packages/extension-chrome`):

- Build: `npm run build`
- Deploy to: Chrome Web Store (manual or automated)
- Trigger: Version tag (e.g., v1.0.0)

**Firefox Extension** (`packages/extension-firefox`):

- Build: `npm run build`
- Deploy to: Firefox Add-ons (manual or automated)
- Trigger: Version tag

### CI Workflow

**Strategy**: Build all, deploy conditionally

```yaml
jobs:
  build-all:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build --workspaces

  deploy-app:
    needs: build-all
    if: github.ref == 'refs/heads/main'
    # Deploy packages/app to GitHub Pages

  deploy-chrome:
    needs: build-all
    if: startsWith(github.ref, 'refs/tags/v')
    # Deploy to Chrome Web Store
```

## Migration Path

### Phase 1: Current (Single Package)

**Status**: ✅ Current state

**Structure**: Everything in root

**When to move to Phase 2**: When we start building extensions

### Phase 2: Minimal Mono-Repo

**Trigger**: Start building browser extension

**Changes**:

1. Create `packages/app/` and move current code
2. Create `packages/extension-chrome/`
3. Create `packages/shared-api/` for common code
4. Set up npm workspaces
5. Update CI

**Effort**: ~1-2 days

### Phase 3: Full Mono-Repo

**Trigger**: Need more shared code or more apps

**Changes**:

1. Extract `shared-ui`, `shared-utils`
2. Add Turborepo for build orchestration
3. Add `tsconfig-base` package
4. Optimize CI for mono-repo

**Effort**: ~2-3 days

### Phase 4: Advanced Mono-Repo (Future)

**Trigger**: Large team or complex dependencies

**Changes**:

1. Add Nx for advanced features
2. Add affected command (only test changed packages)
3. Add remote caching (speed up CI)
4. Add code owners per package

**Effort**: ~1 week

**Status**: Not needed yet

## Best Practices

### Package Naming

**Convention**: `@github2/package-name`

**Examples**:

- `@github2/app`
- `@github2/shared-ui`
- `@github2/extension-chrome`

**Benefits**:

- Clear namespace
- Easy to identify internal packages
- No conflicts with npm registry

### Dependency Management

**Rules**:

1. Internal dependencies always use `workspace:*`
2. External dependencies specified in each package
3. Common dev dependencies can be in root

**Example** (root package.json):

```json
{
  "devDependencies": {
    "typescript": "~5.9.3",
    "vitest": "^4.0.0",
    "turbo": "^2.0.0"
  }
}
```

### Code Sharing

**Do**:

- Extract shared logic to packages
- Keep packages focused (single responsibility)
- Use TypeScript for shared code (type safety)

**Don't**:

- Create packages for everything (start simple)
- Share React components to non-React packages
- Over-abstract (wait until you need it)

### Documentation

**Each package should have**:

- README.md with purpose and usage
- Examples of how to use
- API documentation (for libraries)

## Troubleshooting

### Dependency Not Found

**Cause**: Workspaces not installed correctly

**Fix**:

```bash
# Re-install from root
npm install
```

### Build Order Issues

**Cause**: Package built before its dependencies

**Fix**:

- Use Turborepo: `npx turbo build`
- Or manually build in order

### Version Conflicts

**Cause**: Different packages using different versions

**Fix**:

- Use `npm list package-name` to find conflicts
- Align versions in package.json files

## Resources

- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Turborepo](https://turbo.build/)
- [Nx](https://nx.dev/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
