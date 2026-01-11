# GitHub Actions Workflow Naming Conventions

## Naming Rules

All GitHub Actions workflows and jobs in this repository **MUST** follow these naming conventions:

### Workflow Names
- **Always lowercase** (e.g., `name: ci`, `name: sync`)
- Use **kebab-case** for multi-word names (e.g., `sync-issues`)
- Keep names short and descriptive

### Job Names
- **Always lowercase** (e.g., `name: build`, `name: test`, `name: issues`)
- Use **kebab-case** for multi-word names (e.g., `scan-code`)
- Keep names short and descriptive
- **Do NOT repeat the workflow name** in the job name

### Combined Display Pattern

GitHub Actions displays jobs as: `{workflow-name} / {job-name}`

**Examples:**
- Workflow: `ci`, Job: `build` → Displays as: **ci / build** ✅
- Workflow: `ci`, Job: `test` → Displays as: **ci / test** ✅
- Workflow: `sync`, Job: `issues` → Displays as: **sync / issues** ✅

**Anti-patterns:**
- ❌ Workflow: `CI`, Job: `Build` → Displays as: **CI / Build** (wrong casing)
- ❌ Workflow: `ci`, Job: `ci / build` → Displays as: **ci / ci / build** (duplication)
- ❌ Workflow: `Sync Issues`, Job: `Sync Issues` → Displays as: **Sync Issues / Sync Issues** (duplication + wrong casing)

## Rationale

- **Lowercase**: Consistent with standard YAML/config file conventions
- **No duplication**: GitHub already combines workflow and job names in the UI
- **Short names**: Easier to read in CI status badges and PR checks
- **Kebab-case**: Standard for identifiers in YAML files

## When to Update These Rules

If a user suggests a pattern that should be applied across the whole repository, or if deviating from it would create inconsistency with existing patterns, **capture it in Copilot instructions immediately**.

### Pattern Recognition Triggers

Update rules when:
1. A user explicitly requests a pattern to be applied repository-wide
2. A user corrects an inconsistency that reveals an implicit pattern
3. A user suggests a convention that would apply to multiple files/workflows
4. Deviating from the pattern would create two different patterns in the codebase

**Example**: User says "all workflow names should be lowercase" → This affects ALL workflows, so it becomes a rule.

## References

- See `.github/instructions/github-actions-workflows.instructions.md` for workflow setup patterns
- See `.github/instructions/copilot-requirements.instructions.md` for general requirements
