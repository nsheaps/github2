# Copilot Requirements Reference

## Overview
This document directs Copilot to the comprehensive project requirements that must be followed for all development work in this repository.

## Primary Requirements Document
**Location**: `/docs/specs/project-requirements.md`

This document contains all project requirements, conventions, and technical decisions including:
- Package management (Yarn 4 + Corepack)
- Monorepo architecture (Yarn workspaces + NX)
- GitHub Actions patterns and best practices
- TODO/Issue synchronization system
- Testing requirements and standards
- Code organization and file size limits
- TypeScript configuration
- Documentation standards
- Security and quality requirements
- Development workflow and CI monitoring

## Critical Requirements Summary

### Always Remember
1. **Use Yarn 4 via Corepack** - NEVER use npm, NEVER use `cache: 'yarn'` before `corepack enable`
2. **Check CI incrementally** - Wait 10s → 20s → 30s → 30s → 30s (never longer than 30s at once)
3. **Keep files under 500 lines** - Break into modules if exceeded
4. **Test all action code** - Target >90% coverage
5. **Document as requested** - Only what's explicitly asked for

### Before Making Changes
- Read `/docs/specs/project-requirements.md` thoroughly
- Check `.github/instructions/github-actions-workflows.instructions.md` for workflow patterns
- Understand the monorepo structure and workspace configuration

### After Making Changes
- Run appropriate linters and tests
- Check CI status using GitHub MCP tools
- Wait incrementally for CI completion (10s, 20s, 30s intervals)
- Fix any CI failures immediately
- Use `report_progress` to commit changes

## Workflow-Specific Instructions

### GitHub Actions Workflows
See: `.github/instructions/github-actions-workflows.instructions.md`
- Yarn 4 + Corepack setup sequence
- Concurrency controls
- Common pitfalls and solutions
- Debugging with GitHub MCP tools

### Workflow and Job Naming
See: `.github/instructions/workflow-naming-conventions.instructions.md`
- Always use lowercase for workflow and job names
- Never duplicate workflow name in job name
- When to document new patterns repository-wide
- Pattern recognition triggers

### TODO/Issue Sync
See: `/docs/specs/project-requirements.md` → "TODO/Issue Synchronization System"
- State machine logic
- File naming conventions
- Frontmatter format
- Workflow triggers

## When to Update Requirements

Add to `/docs/specs/project-requirements.md` when:
- User provides explicit new requirements
- User corrects a misconception
- User establishes a new convention or pattern
- An important technical decision is made
- **User suggests a pattern that should apply repository-wide**
- **Deviating from suggested pattern would create inconsistency**

Do NOT add:
- Obvious best practices
- Framework-standard conventions
- Temporary or one-off instructions
- Implementation details

### Pattern Recognition
When a user suggests a pattern across the whole repo (or one that should be considered a pattern, since a deviation from it would have 2 patterns in the same codebase), capture it in the appropriate Copilot instructions file immediately.

## Tools for Checking CI

Use GitHub MCP server tools to monitor workflow status:
```typescript
// List workflow runs
actions_list({ method: 'list_workflow_runs', owner, repo, resource_id: 'workflow.yml' })

// Get failed job logs
get_job_logs({ owner, repo, run_id, failed_only: true, return_content: true })
```

**Remember**: Check CI after every meaningful change. Wait incrementally (10s → 20s → 30s).

## Emergency Procedures

### CI Failing After Your Changes
1. Use GitHub MCP tools to get failure logs
2. Identify root cause
3. Make minimal fix
4. Commit and check CI again (wait incrementally)
5. Repeat until passing

### Lost or Confused About Requirements
1. Read `/docs/specs/project-requirements.md`
2. Read workflow-specific instructions in `.github/instructions/`
3. Ask user for clarification if still unclear

## Maintenance

This file should be updated whenever:
- New instruction files are created in `.github/instructions/`
- New spec files are created in `docs/specs/`
- The structure of requirements documentation changes

Last updated: 2026-01-10
