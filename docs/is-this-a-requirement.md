# Requirements Checklist

Please review and check (✓) items that are requirements. Remove items that are not requirements.

## TODO/Issue Sync System

- [ ] **Bidirectional sync between .github/issues/*.md and GitHub Issues**
  - Discussed in: Multiple comment threads
  - Implemented: Partially (TypeScript action removed in this PR)
  - Details: Sync markdown files in `.github/issues/` with corresponding GitHub Issues. When a doc is created without issue number, create issue and rename file with `{number}-{filename}.md`. When issue is created/edited, update corresponding doc file.
  - References: Comments on sync-issues.py, frontmatter requirements

- [ ] **Automatic TODO scanning on PRs**
  - Discussed in: "When the workflow triggers on PRs, check for all the todos"
  - Implemented: No (removed in this PR)
  - Details: Scan codebase for TODO comments when PR is opened, create/update documentation files in `.github/issues/todo-{hash}-{slug}.md`, commit to PR branch for review
  - References: scan-todos.py feedback

- [ ] **State machine for Code/Doc/Issue combinations**
  - Discussed in: Multiple requirements threads
  - Implemented: No (removed in this PR)
  - Details: Handle all 6 combinations:
    * Code NO, Doc NO, Issue YES → Close orphaned issue
    * Code NO, Doc YES, Issue YES → Sync doc and issue
    * Code NO, Doc YES, Issue NO → Create issue from doc
    * Code YES, Doc NO, Issue NO → Create doc, then issue
    * Code YES, Doc YES, Issue NO → Create issue from doc
    * Code YES, Doc YES, Issue YES → Sync doc to issue
  - References: Comments detailing state machine logic

- [ ] **File naming convention for TODO docs**
  - Discussed in: TODO scanning requirements
  - Implemented: Partially (convention documented)
  - Details: 
    * TODO docs (from code): `todo-{hash}-{slug}.md` → `{number}-todo-{hash}-{slug}.md`
    * Task docs (manual): `task-name.md` → `{number}-task-name.md`
    * Use `git mv` to preserve history when renaming
  - References: File naming discussions

- [ ] **YAML frontmatter in issue docs**
  - Discussed in: "supplement each issue doc with frontmatter"
  - Implemented: Yes (task files have frontmatter)
  - Details: Each `.md` file should have YAML frontmatter with `title`, `labels`, `assignees`
  - Current state: 9 task files in `.github/issues/` have frontmatter
  - References: Frontmatter format discussions

- [ ] **Infinite loop prevention with [skip ci]**
  - Discussed in: Workflow concurrency requirements
  - Implemented: No (workflows removed)
  - Details: All automated commits should include `[skip ci]` to prevent triggering workflows again
  - References: Push ordering and duplicate prevention

## Monorepo & Package Management

- [ ] **Yarn 4 with Corepack**
  - Discussed in: "set the repo up as a monorepo using yarn, corepack, and nx"
  - Implemented: Partially (Yarn 4 setup exists, monorepo structure removed)
  - Details: Use Yarn 4 (`yarn@4.6.0`) with Corepack for package management, not npm
  - Current state: package.json has `"packageManager": "yarn@4.6.0"`, yarn.lock exists
  - References: Multiple comments emphasizing Yarn over npm

- [ ] **Yarn workspaces monorepo structure**
  - Discussed in: "Give the `.github/` folder it's own package.json"
  - Implemented: No (removed in this PR)
  - Details: Root workspace + `.github` workspace for actions, workspace named `@github2/actions`
  - References: Monorepo setup comments

- [ ] **NX for task orchestration**
  - Discussed in: Monorepo setup requirements
  - Implemented: Partially (nx.json exists, not fully utilized)
  - Details: Use NX for build system orchestration, task caching, parallel execution
  - Current state: nx.json exists but no NX-specific configuration
  - References: NX task orchestration discussions

## GitHub Actions & Workflows

- [ ] **Lowercase workflow and job names**
  - Discussed in: "The requirement was 'ci / build', so 'ci' is supposed to be workflow name"
  - Implemented: Yes (in documentation)
  - Details: All workflow names and job names must be lowercase, use kebab-case for multi-word names
  - Display pattern: `{workflow-name} / {job-name}` (e.g., "ci / build", "sync / issues")
  - References: workflow-naming-conventions.instructions.md

- [ ] **Never duplicate workflow name in job name**
  - Discussed in: "They look like 'CI / ci / build' - that's duplication"
  - Implemented: Yes (in documentation)
  - Details: GitHub combines workflow + job name in UI, don't repeat the workflow name
  - References: workflow-naming-conventions.instructions.md

- [ ] **Correct Yarn 4 + Corepack setup in workflows**
  - Discussed in: "use `corepack enable && corepack install` for yarn setup"
  - Implemented: Yes (in documentation)
  - Details: Sequence must be: Node.js setup → corepack enable → corepack install → yarn install
  - Common mistake: Using `cache: 'yarn'` in setup-node before enabling corepack
  - References: github-actions-workflows.instructions.md

- [ ] **Workflow concurrency controls**
  - Discussed in: "workflow only runs with parallelism of one (and cancels in progress on PRs)"
  - Implemented: No (workflows removed)
  - Details:
    * Parallelism of 1 per context to prevent race conditions
    * Cancel in-progress runs on PRs
    * Run on every SHA on main (no cancellation)
  - References: Concurrency control discussions

## Code Organization & Standards

- [ ] **500-line file limit**
  - Discussed in: "Generally, no file should be longer than 500 lines"
  - Implemented: Yes (documented in requirements)
  - Details: Break files into modules if they exceed 500 lines
  - References: File organization comments

- [ ] **TypeScript for action code**
  - Discussed in: "Create a composite action that loads a ts file"
  - Implemented: No (action removed)
  - Details: Use TypeScript instead of Python for GitHub Actions code
  - References: Composite action discussions

- [ ] **Modular architecture**
  - Discussed in: "separate functions logically into libraries/modules"
  - Implemented: No (action removed, but principle documented)
  - Details: Organize code into logical modules (common/, scan-todos/, sync-issues/)
  - References: Code organization feedback

- [ ] **Use existing libraries instead of reinventing**
  - Discussed in: "frontmatter parsing belongs in lib/, use well-maintained libraries"
  - Implemented: No
  - Details: Use established libraries like `gray-matter` for frontmatter parsing instead of custom implementation
  - References: Latest simplification comment

## Testing

- [ ] **Comprehensive test coverage (>90%)**
  - Discussed in: "cover the code in tests... >90% coverage target"
  - Implemented: No (tests removed)
  - Details: 4 test suites covering all modules with >90% line coverage
  - References: Test coverage requirements

- [ ] **Test infrastructure with Vitest**
  - Discussed in: Testing setup requirements
  - Implemented: Partially (vitest.config.ts exists at root)
  - Details: Use Vitest for testing TypeScript code
  - References: Test infrastructure discussions

## Documentation

- [ ] **Complete requirements specification**
  - Discussed in: "document in docs/specs/xxxx.md so you don't forget them"
  - Implemented: Yes
  - Details: All requirements captured in `docs/specs/project-requirements.md`
  - Current state: File exists and is comprehensive
  - References: Requirements documentation task

- [ ] **Copilot instruction files**
  - Discussed in: "mention that in a copilot instructions doc"
  - Implemented: Yes
  - Details: `.github/instructions/` directory with guidance for future development
  - Current state: 4 instruction files created
  - References: Instructions creation tasks

- [ ] **Capture repo-wide patterns in rules**
  - Discussed in: "when user suggests pattern across whole repo, capture in copilot rules"
  - Implemented: Yes (in workflow-naming-conventions.instructions.md)
  - Details: When a pattern is suggested that should apply repo-wide, immediately document it in Copilot instructions
  - References: workflow-naming-conventions.instructions.md

## Critical Behaviors

- [ ] **"WTF dude" trigger**
  - Discussed in: "Any time I say 'wtf dude' should trigger you to step back"
  - Implemented: Yes (documented)
  - Details: When user says "wtf dude", stop, analyze what went wrong, update rules, fix the issue
  - References: critical-behavior-rules.instructions.md

- [ ] **Repetitive action detection (5+ times)**
  - Discussed in: "if you do same thing more than 5 times in a row, stop and reassess"
  - Implemented: Yes (documented)
  - Details: If same action/sequence performed >5 times, stop, analyze, find correct approach, update rules
  - References: critical-behavior-rules.instructions.md

- [ ] **Never blindly wait for CI**
  - Discussed in: "don't blindly wait 10s for CI to start, just check the CI status"
  - Implemented: Yes (documented)
  - Details: Always check CI status first before waiting. CI might be done, in progress, or not started
  - References: CI status checking rules, critical-behavior-rules.instructions.md

## Task Synthesis (Core Deliverable)

- [x] **Collect all TODOs into .github/copilot/todos.md**
  - Discussed in: "collect all the todos into local md docs"
  - Implemented: Yes
  - Details: Single file aggregating all TODO items from codebase
  - Current state: `.github/copilot/todos.md` exists
  - References: Initial TODO collection request

- [x] **Synthesize TODOs into parallelizable tasks**
  - Discussed in: "synthesize into succinct set of tasks with little overlap"
  - Implemented: Yes
  - Details: Create individual task files in `.github/issues/` with minimal overlap
  - Current state: 9 task files created
  - References: Task synthesis requirements

- [x] **Task files contain only description + sub-tasks**
  - Discussed in: "Capture only specified detail... not architecture or design exercise"
  - Implemented: Yes
  - Details: Each task file has brief description and numbered sub-tasks only
  - Current state: All 9 files follow this pattern
  - References: Task file format requirements

- [x] **Tasks can be worked on independently**
  - Discussed in: "parallelizable... can be worked on independently"
  - Implemented: Yes
  - Details: Each task is self-contained with clear boundaries
  - Current state: 9 independent tasks
  - References: Parallelization requirements
