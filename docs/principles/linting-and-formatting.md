# Linting and Formatting Principles

## Overview

This document outlines the linting and formatting standards for the GitHub2 project.

## Core Principles

### 1. Automated and Enforced

- All code must pass linters before merge
- CI enforces all rules
- Local tools match CI exactly

### 2. Consistent Style

- One style across the entire codebase
- No debates over formatting
- Automate the boring stuff

### 3. Catch Bugs Early

- Linters catch common mistakes
- Type checking prevents runtime errors
- Security vulnerabilities identified

### 4. Developer Friendly

- Clear error messages
- Auto-fix when possible
- Fast execution

## Linting Strategy

### TypeScript/JavaScript - ESLint

**Tool**: ESLint 9+ with TypeScript support

**Configuration**: Flat config (`eslint.config.js`)

**Rules**:

- TypeScript recommended rules
- React hooks rules (prevent infinite loops, missing dependencies)
- React refresh rules (HMR compatibility)
- No unused variables
- No console.log in production (warnings in dev)

**Scripts**:

- `npm run lint:eslint` - Check for issues
- `npx eslint . --fix` - Auto-fix issues

**Exceptions**:

- Use `// eslint-disable-next-line` sparingly
- Must include comment explaining why
- Prefer fixing the code over disabling rules

### Code Formatting - Prettier

**Tool**: Prettier 3+

**Configuration**: `.prettierrc`

**Settings**:

- Semi-colons: Yes
- Single quotes: Yes (for JS/TS)
- Trailing commas: ES5
- Tab width: 2 spaces
- Print width: 100 characters
- Arrow function parentheses: Always

**Scripts**:

- `npm run lint:prettier` - Check formatting
- `npm run format` - Auto-format all files

**Integration**:

- Prettier runs after ESLint
- No conflicting rules
- Format on save (recommended in IDE)

### Markdown - Markdownlint

**Tool**: markdownlint-cli2

**Configuration**: `.markdownlint.json`

**Rules**:

- Consistent heading styles
- No trailing spaces
- Proper link formatting
- Code block language specified
- No inline HTML (with exceptions)

**Scripts**:

- `npm run lint:md` - Check markdown files

**Exceptions**:

- `<!-- markdownlint-disable -->` for complex tables
- HTML allowed for badges in README
- HTML allowed for complex layouts in docs

### YAML - yamllint

**Tool**: yaml-lint

**Scripts**:

- `npm run lint:yaml` - Check workflow files

**Scope**:

- GitHub Actions workflows (`.github/**/*.yml`)
- Other YAML config files

**Rules**:

- Valid YAML syntax
- Consistent indentation
- No duplicate keys

### TypeScript - Type Checking

**Tool**: TypeScript Compiler (tsc)

**Configuration**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

**Settings**:

- Strict mode enabled
- No implicit any
- No unused locals/parameters
- Strict null checks

**Execution**:

- `npm run build` - Full type check + build
- Editor integration for real-time feedback

## File Organization

### Which Files to Lint

**Include**:

- All `.ts`, `.tsx` files in `src/`
- All `.js`, `.cjs`, `.mjs` config files
- All `.md` files (except node_modules)
- All `.yml`, `.yaml` in `.github/`

**Exclude**:

- `node_modules/`
- `dist/`, `build/`
- Generated files
- Third-party code in `vendor/`
- Coverage reports

### Ignore Files

- `.eslintignore` - ESLint exclusions
- `.prettierignore` - Prettier exclusions
- Configured in tools directly (preferred)

## Editor Integration

### Recommended VS Code Extensions

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Markdownlint (`DavidAnson.vscode-markdownlint`)

### Recommended VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Design Decisions

### ESLint Configuration Format

- **Decision**: Flat config (eslint.config.js)
- **Rationale**: New standard, better TypeScript support, simpler
- **Migration**: From legacy .eslintrc.json (completed)

### Prettier vs ESLint for Formatting

- **Decision**: Prettier for all formatting, ESLint for code quality
- **Rationale**: Clear separation of concerns, less conflicts
- **Implementation**: ESLint does not enforce style rules

### Linter Execution Order

- **Decision**: ESLint → Prettier → Markdownlint → YAML
- **Rationale**: Code quality first, formatting second, docs third
- **CI**: Run in parallel for speed (they don't conflict)

### Auto-fix Strategy

- **Decision**: Auto-fix available locally, manual in CI
- **Rationale**: Developers can fix quickly, CI only validates
- **Exception**: Could add auto-fix bot in future

### Markdown Linting Strictness

- **Decision**: Lenient rules, focus on serious issues
- **Rationale**: Documentation should be easy to write
- **Balance**: Maintain consistency without being annoying

## Workflow Integration

### Pre-commit Hooks (Future)

Option to add Husky + lint-staged:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.md": ["markdownlint-cli2"]
  }
}
```

**Decision**: Not implemented yet
**Rationale**: Let developers commit freely, catch in CI
**Review Date**: Consider after team grows

### CI Enforcement

All linters run in CI (see `ci-design.md`):

1. ESLint must pass (no warnings or errors)
2. Prettier must pass (all files formatted)
3. Markdownlint must pass
4. YAML lint may warn (continue-on-error for now)

### Local Development

Developers should run linters before pushing:

```bash
npm run lint        # Run all linters
npm run format      # Auto-format code
npm run build       # Type check + build
```

## Handling Violations

### During Development

1. Run linters locally: `npm run lint`
2. Auto-fix what you can: `npm run format` and `npx eslint . --fix`
3. Manually fix remaining issues
4. Commit

### When CI Fails

1. Pull latest changes
2. Run `npm run lint` locally
3. Fix all issues
4. Commit and push
5. Verify CI passes

### Legacy Code

- **Approach**: Fix violations when touching files
- **Strategy**: Boy Scout Rule - leave it better than you found it
- **Exception**: Don't reformat entire files in unrelated PRs

## Future Enhancements

- [ ] Add stylelint for CSS (if needed)
- [ ] Add commitlint for commit messages
- [ ] Add pre-commit hooks (optional)
- [ ] Add import sorting (eslint-plugin-import)
- [ ] Add spell checking in comments/docs
- [ ] Add license header checking
- [ ] Consider migration to Biome (ESLint + Prettier replacement)

## Appendix

### Example: Adding a New ESLint Rule

1. Update `eslint.config.js`:

```javascript
export default [
  // ... existing config
  {
    rules: {
      'new-rule': 'error',
    },
  },
];
```

2. Test locally: `npm run lint:eslint`
3. Fix violations: `npx eslint . --fix`
4. Update this doc if the rule is significant
5. Commit

### Example: Disabling a Rule

```typescript
// Rarely needed - explain why
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyData: any = externalLibrary.getData();
```

**Better**: Fix the code to not need `any`

### Example: Formatting Exception

```markdown
<!-- prettier-ignore -->
| Complex | Table | That | Would |
| Break | With | Prettier | Formatting |
```

### Common Linting Errors

**Error**: "React Hook useEffect has a missing dependency"
**Fix**: Add the dependency to the array or use useCallback

**Error**: "Unexpected console statement"
**Fix**: Remove console.log or use a logging library

**Error**: "Type 'X' is not assignable to type 'Y'"
**Fix**: Add proper types or use type assertions (carefully)

**Error**: "Line exceeds maximum line length of 100"
**Fix**: Break into multiple lines (Prettier usually handles this)
