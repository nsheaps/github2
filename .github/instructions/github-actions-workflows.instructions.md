# GitHub Actions Workflows - Best Practices and Common Pitfalls

## Critical: Yarn 4 with Corepack Setup

**ALWAYS follow this exact sequence when setting up Yarn 4 in GitHub Actions workflows:**

### ✅ Correct Setup Order

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    # ❌ DO NOT add cache: 'yarn' here - corepack must be enabled first

- name: Enable Corepack
  run: corepack enable

- name: Install Corepack
  run: corepack install

- name: Install dependencies
  run: yarn install
```

### ❌ Common Mistake - DO NOT DO THIS

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'yarn'  # ❌ WRONG! Corepack not enabled yet
```

**Why this fails:**
- `actions/setup-node` cache feature tries to use Yarn immediately
- But Yarn 4 requires corepack to be enabled first
- The global Yarn version (1.22.22) doesn't match package.json (4.6.0)
- Error: "Corepack must currently be enabled by running corepack enable"

### Package Manager Configuration

This repository uses:
- **Yarn 4.6.0** (defined in `package.json` `packageManager` field)
- **Corepack** for package manager version management
- **Yarn workspaces** for monorepo structure

### Workflow Job Setup Template

Use this template for any job that needs to install dependencies:

```yaml
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          # Note: No cache here - handled by Yarn natively

      - name: Enable Corepack
        run: corepack enable

      - name: Install Corepack
        run: corepack install

      - name: Install dependencies
        run: yarn install
        # Yarn 4 has built-in caching via .yarn/cache

      # Your job steps here
      - name: Run tests
        run: yarn test
```

## Monorepo Structure

This repository is a Yarn workspaces monorepo:

**Root workspace:**
- `package.json` - Workspace configuration, nx
- Main application code

**`.github/` workspace:**
- `.github/package.json` - GitHub Actions composite action code
- TypeScript modules for TODO/issue sync
- Tests for the action

### Installing Dependencies

```bash
# Install all workspaces
yarn install

# Run commands in specific workspace
cd .github && yarn test
```

## Workflow Separation

### test-actions.yml
- **Purpose**: Test the composite action's TypeScript code
- **Triggers**: Push/PR to `.github/actions/**`, `.github/package.json`
- **Directory**: Works in `.github/` workspace
- **Commands**: `yarn test`, `yarn test:coverage`

### sync-issues.yml
- **Purpose**: Execute TODO scanning and issue synchronization
- **Triggers**: Push to main, PRs, issue events
- **Uses**: The composite action via `uses: ./.github/actions/persist-github-issues-to-files`

## Concurrency Controls

Always set concurrency to prevent race conditions:

```yaml
concurrency:
  group: workflow-name-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

**Rules:**
- PRs: Cancel in-progress runs when new commits pushed
- Main branch: Never cancel - process every SHA

## Common Workflow Patterns

### Conditional Steps

```yaml
- name: Run only on main
  if: github.ref == 'refs/heads/main'
  run: echo "Main branch only"

- name: Run only on PRs
  if: github.event_name == 'pull_request'
  run: echo "PR only"
```

### Skip CI Commits

Check for `[skip ci]` in commit messages:

```yaml
- name: Check for skip ci
  if: "!contains(github.event.head_commit.message, '[skip ci]')"
  run: echo "CI will run"
```

### Path Filters

Only run when specific files change:

```yaml
on:
  push:
    paths:
      - '.github/actions/**'
      - '.github/package.json'
      - '.github/workflows/test-actions.yml'
```

## Debugging Failed Workflows

Use GitHub MCP server tools to investigate:

```typescript
// List recent workflow runs
actions_list({ method: 'list_workflow_runs', owner, repo })

// Get failed job logs
get_job_logs({ owner, repo, run_id, failed_only: true })

// Get specific job details
actions_get({ method: 'get_workflow_job', owner, repo, resource_id: job_id })
```

## Security Best Practices

1. **Use GITHUB_TOKEN**: Built-in token with automatic permissions
2. **Minimal permissions**: Only request what's needed
3. **No secrets in logs**: Use `::add-mask::` for sensitive data
4. **Pin action versions**: Use specific SHA or version tags

## Memory Aid Checklist

Before creating/updating a workflow:

- [ ] Using Yarn 4? Enable corepack BEFORE setup-node cache
- [ ] Set concurrency group to prevent race conditions
- [ ] Add path filters if workflow is file-specific
- [ ] Check for `[skip ci]` to prevent infinite loops
- [ ] Use minimal required permissions
- [ ] Test locally with `act` if possible
- [ ] Validate YAML syntax with `yamllint`

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Corepack Documentation](https://nodejs.org/api/corepack.html)
- [Yarn 4 Documentation](https://yarnpkg.com/)
