# Development, TypeScript, Bundling, and Deployment

## Overview

This document covers the development workflow, TypeScript configuration, bundling strategy, and deployment process for GitHub2.

## Development Workflow

### No Build Required in Development

**Key Benefit**: Vite serves TypeScript files directly, transpiled on-the-fly.

**How It Works**:
```
Developer saves file → Vite detects change → Transpiles TS to JS → HMR updates browser
```

**Result**: 
- Instant feedback (<100ms)
- No build step during development
- Fast iteration

### Starting Development

```bash
# Install dependencies (once)
npm ci

# Start dev server
npm run dev
# or
mise run dev

# Open http://localhost:5173
```

**Features**:
- Hot Module Replacement (HMR)
- React Fast Refresh
- Source maps for debugging
- Error overlay in browser

### Development vs Production

| Aspect | Development | Production |
|--------|------------|------------|
| TypeScript | On-the-fly transpilation | Pre-compiled |
| Bundling | Individual modules | Bundled chunks |
| Minification | No | Yes |
| Source maps | Inline | External files |
| Optimization | None | Tree-shaking, code-splitting |
| Serving | Vite dev server | Static files on GitHub Pages |

## TypeScript Configuration

### Multi-Config Setup

We use multiple TypeScript configurations for different contexts:

```
tsconfig.json           # Base config (references others)
├── tsconfig.app.json   # Application code (src/)
└── tsconfig.node.json  # Build tools (vite.config.ts, etc.)
```

### Base Config (tsconfig.json)

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**Purpose**: Orchestrates other configs

### App Config (tsconfig.app.json)

**Key Settings**:
```json
{
  "compilerOptions": {
    "target": "ES2020",           // Modern JS features
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",           // Use latest module system
    "skipLibCheck": true,         // Faster builds
    
    "moduleResolution": "bundler", // Vite-compatible
    "allowImportingTsExtensions": true, // Import .ts files
    "isolatedModules": true,      // Required by Vite
    "moduleDetection": "force",
    "noEmit": true,               // Vite handles output
    "jsx": "react-jsx",           // React 17+ JSX transform
    
    "strict": true,               // All strict checks
    "noUnusedLocals": true,       // Catch unused variables
    "noUnusedParameters": true,   // Catch unused params
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**Rationale**:

**`target: ES2020`**: 
- Modern browsers support (2020+)
- Smaller bundle size than ES5
- Native async/await, optional chaining, nullish coalescing

**`module: ESNext`**:
- Latest module features
- Tree-shaking friendly
- Dynamic imports

**`moduleResolution: bundler`**:
- Optimized for Vite/bundlers
- Handles .ts extensions
- Better DX (no .js in imports)

**`noEmit: true`**:
- TypeScript only checks types
- Vite handles transpilation and bundling
- Faster type checking

**`strict: true`**:
- Catches bugs early
- Better IDE support
- Prevents `any` abuse

### Node Config (tsconfig.node.json)

**Purpose**: For build tools (vite.config.ts, vitest.config.ts)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

### Future: Shared Base Config

**Plan**: Extract common settings to a shared package

```
packages/
  tsconfig-base/
    package.json
    tsconfig.json     # Shared settings
    README.md
```

**Usage**:
```json
{
  "extends": "@github2/tsconfig-base",
  "compilerOptions": {
    // Override specific settings
  }
}
```

**Status**: Not implemented yet (future mono-repo setup)

## Bundling Strategy

### Build Process

```bash
npm run build
# Runs: tsc -b && vite build
```

**Steps**:
1. **Type Check** (`tsc -b`): Verify types across all configs
2. **Bundle** (`vite build`): Create optimized production build

### Vite Build Configuration

**From vite.config.ts**:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/github2/',           // GitHub Pages subpath
  build: {
    outDir: 'dist',             // Output directory
    sourcemap: true,            // External source maps
  },
})
```

### Bundle Optimization

**Automatic Optimizations**:
- **Tree-shaking**: Remove unused code
- **Code-splitting**: Separate chunks for better caching
- **Minification**: Reduce file size (esbuild)
- **Asset optimization**: Compress images, inline small assets

**Chunk Strategy**:
- Vendor chunk: React, React DOM, other libraries
- App chunk: Application code
- Lazy routes: Separate chunks per route (future)

### Output Structure

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js       # Main bundle
│   ├── index-[hash].css      # Styles
│   ├── vendor-[hash].js      # Dependencies
│   └── *.js.map              # Source maps
└── vite.svg
```

**Cache Busting**: Hash in filename ensures fresh content after updates

## Deployment

### GitHub Pages Deployment

**Trigger**: Push to `main` branch or manual workflow dispatch

**Process**:
1. Checkout code
2. Install Node.js 20
3. Configure GitHub Pages
4. Install dependencies (`npm ci`)
5. Build (`npm run build`)
6. Upload artifact (dist/)
7. Deploy to GitHub Pages

**Result**: Live at `https://nsheaps.github.io/github2/`

### Base URL Configuration

**Why `/github2/`?**
- GitHub Pages serves repo at `username.github.io/repo-name/`
- All assets must use this base path
- Vite handles this automatically with `base` config

**What It Does**:
- Prefixes all asset URLs: `/github2/assets/index.js`
- Adjusts router base (React Router)
- Ensures links work on GitHub Pages

**Custom Domain** (future):
- Add CNAME file to public/
- Configure DNS
- Update base to '/'

### Runtime Differences

#### Web (GitHub Pages)

**Access**: Via browser at URL

**Characteristics**:
- Served from GitHub's CDN
- Requires internet connection
- Always latest version
- Cleared cache = fresh load

#### Offline Cached Version (PWA - Future)

**Access**: Via browser, works offline

**Implementation**: Service Worker + Cache API

**Characteristics**:
- Works without internet (after first visit)
- Updates in background
- Faster load times
- Syncs when online

**Not Implemented Yet** - See roadmap

#### Install to Homepage (PWA - Future)

**Access**: Icon on home screen (mobile/desktop)

**Implementation**: Web App Manifest + Service Worker

**Characteristics**:
- Looks like native app
- Full screen mode
- Push notifications (if needed)
- Offline capable

**Not Implemented Yet** - See roadmap

#### Native App (React Native - Future)

**Access**: App Store / Play Store

**Implementation**: React Native with shared code

**Characteristics**:
- True native app
- Better performance
- Native integrations
- Larger download size

**Not Implemented Yet** - Long-term goal

### Environment-Specific Builds

#### Development

```bash
npm run dev
```

- No bundling
- Fast HMR
- Source maps inline
- Full error messages

#### Preview (Production Simulation)

```bash
npm run build
npm run preview
```

- Production build
- Served locally
- Test before deploy
- Verify optimizations

#### Production

```bash
# CI does this
npm run build
# Deploy dist/ to GitHub Pages
```

- Fully optimized
- Minified
- Tree-shaken
- Code-split

## Hot Reload with Tilt (Future)

### Current: Vite Dev Server

```bash
npm run dev
```

- Watches `src/` directory
- HMR for instant updates
- React Fast Refresh

### Future: Tilt Integration

**Benefits**:
- Mock GitHub Pages backend
- Multiple services (frontend, mock API)
- Better logging and debugging
- Production-like environment locally

**Tiltfile** (future):
```python
local_resource('vite', 'npm run dev')
# Future: Add mock backend
```

**Status**: Not implemented (see `local-tooling-parity-with-ci.md`)

## Type Checking During Development

### IDE Integration

**VS Code** (recommended):
- Install "TypeScript and JavaScript Language Features"
- Automatic type checking on save
- Inline error highlighting

### Manual Type Check

```bash
# Check types (no build)
npx tsc --noEmit

# Or use build command
npm run build
```

**When to Run**:
- Before committing
- After major refactoring
- When CI fails

## Mono-Repo Considerations (Future)

### Shared TypeScript Config

**Plan**:
```
packages/
  tsconfig-base/
    tsconfig.json      # Base settings
  app/                 # Main app
    tsconfig.json      # Extends base
  extension/           # Browser extension
    tsconfig.json      # Extends base
```

### Build Coordination

**Challenge**: Build packages in correct order

**Solution** (future):
- Use Turborepo or Nx
- Define dependencies between packages
- Parallel builds where possible

**Status**: Not needed yet (single package currently)

## Performance Considerations

### Development Performance

- **Vite is fast**: No build step, instant HMR
- **TypeScript in IDE**: Continuous type checking
- **Split configs**: Faster type checking (isolated modules)

### Build Performance

**Current** (single package):
- TypeScript type check: ~2-5s
- Vite build: ~5-10s
- Total: ~10-15s

**Optimization**:
- `skipLibCheck: true`: Don't check node_modules types
- `isolatedModules: true`: Faster transpilation
- `noEmit: true`: Vite handles output

### Runtime Performance

**Optimizations Applied**:
- Code splitting (automatic via Vite)
- Tree shaking (remove unused code)
- Minification (esbuild)
- Compression (gzip by GitHub Pages)

**Future Optimizations**:
- Route-based code splitting
- Component lazy loading
- Image optimization (Vite plugin)
- Font subsetting

## Troubleshooting

### Type Errors in CI, Not Locally

**Cause**: Different TypeScript version

**Fix**:
```bash
npm ci    # Use exact versions from package-lock.json
```

### Build Succeeds Locally, Fails in CI

**Cause**: Missing dependencies or files

**Fix**:
```bash
# Check what's committed
git status

# Ensure dist/ is in .gitignore (it should be)
```

### Slow Type Checking

**Cause**: Large number of files or complex types

**Solutions**:
- Add `skipLibCheck: true`
- Use project references (already done)
- Upgrade TypeScript version

### HMR Not Working

**Cause**: File watcher limit (Linux)

**Fix**:
```bash
# Increase file watcher limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
