# Requirements Checklist

Please review and check (x) items that are requirements. Remove items that are not requirements.

Note from human: This PR is NOT to implement these requirements, but to document them clearly in a checklist format. Once a requirement is documented here, it should be replaced with a `.github/issues/xxxx.md` task file for implementation and removed from this file.

## TODO/Issue Sync System

- [x] **Bidirectional sync between .github/issues/*.md and GitHub Issues**
  - Discussed in: Multiple comment threads
  - Implemented: Partially (TypeScript action removed in this PR)
  - Details: Sync markdown files in `.github/issues/` with corresponding GitHub Issues. When a doc is created without issue number, create issue and rename file with `{number}-{filename}.md`. When issue is created/edited, update corresponding doc file.
  - References: Comments on sync-issues.py, frontmatter requirements
  - Notes from human:
    The state machine mentioned below is the design for handling all combinations of code/doc/issue presence. 
    The implementation can be removed as long as they're captured in the issues folder.
    If you remove it, capture the bidirectional sync action + logic explicitly in it's own issue
      To sync on push/pr event:
        * Code NO, Doc NO, Issue YES → 
          PR - Do nothing
          Push to main - Close orphaned issue
        * Code NO, Doc YES, Issue YES → 
          PR - Do nothing
          Push to main - Update doc => issue
        * Code NO, Doc YES, Issue NO → 
          PR - do nothing
          Push to main - Create issue from doc and rename doc (and push) to prefix issue number
        * Code YES, Doc NO, Issue NO → 
          PR - Create doc with hardlink to line of todo
          Push to main - Create issue, then doc and prefix with issue number 123-issue-name.md
        * Code YES, Doc YES, Issue NO → 
          PR - ensure doc has hardlink to line of todo, else make new doc with hardlink
          Push to main - Create issue, then rename doc to prefix with issue number
        * Code YES, Doc YES, Issue YES → Sync doc to issue
      If issue create/update, go find issue file by searching for `{number}-*.md` files in `.github/issues/`
        If found, sync issue => doc
        If not found, do nothing
      If an issue is closed, the file should be deleted.
      Goal: Represent all issues as markdown docs in repo.
        - If you update issue in github, file gets updated.
        - If you update file in repo, issue gets updated (or created if not found).
        - If you add a new todo in code
          - on PR: create doc only
          <!-- - on push to main: create issue + doc -->
          - on push to main: do nothing (don't worry about existing todos except for collecting them in this PR)
        - If you push a new doc to main without issue number, create issue + rename doc

- [x] **Automatic TODO scanning on PRs**
  - Discussed in: "When the workflow triggers on PRs, check for all the todos"
  - Implemented: No (removed in this PR)
  - Details: Scan codebase for TODO comments when PR is opened, create/update documentation files in `.github/issues/todo-{hash}-{slug}.md`, commit to PR branch for review
  - References: scan-todos.py feedback

- [x] **File naming convention for issue docs**
  - Discussed in: issue scanning requirements
  - Implemented: Partially (convention documented)
  - Details: 
    * Issue docs (from TODOs found in code): `{issue name}.md` → `{number}-{issue name}.md`
    * issue name is kebab-case, derived from first 30 chars of todo line
    * if issue has number prefix, file renamed to match kebab-case of issue title
    * issue frontmatter references todo
    * Use `git mv` in separate commits to preserve history when renaming
  - References: File naming discussions

- [x] **YAML frontmatter in issue docs**
  - Discussed in: "supplement each issue doc with frontmatter"
  - Implemented: Yes (task files have frontmatter)
  - Details: Each `.md` file should have YAML frontmatter with `title`, 'number', `labels`, `assignees`
  - Current state: 9 task files in `.github/issues/` have frontmatter
  - References: Frontmatter format discussions

- [x] **Infinite loop prevention with [skip ci]**
  - Discussed in: Workflow concurrency requirements
  - Implemented: No (workflows removed)
  - Details: All automated commits should include `[skip ci]` to prevent triggering workflows again
  - References: Push ordering and duplicate prevention

## Monorepo & Package Management

- [x] **Yarn 4 with Corepack**
  - Discussed in: "set the repo up as a monorepo using yarn, corepack, and nx"
  - Implemented: Partially (Yarn 4 setup exists, monorepo structure removed)
  - Details: Use Yarn 4 (`yarn@4.6.0`) with Corepack for package management, not npm
  - Current state: package.json has `"packageManager": "yarn@4.6.0"`, yarn.lock exists
  - References: Multiple comments emphasizing Yarn over npm

- [x] **Yarn workspaces monorepo structure**
  - Discussed in: "Give the `.github/` folder it's own package.json"
  - Implemented: No (removed in this PR)
  - Details: Root workspace + `.github` workspace for actions, workspace named `@github2/actions`
  - References: Monorepo setup comments

- [x] **NX for task orchestration**
  - Discussed in: Monorepo setup requirements
  - Implemented: Partially (nx.json exists, not fully utilized)
  - Details: Use NX for build system orchestration, task caching, parallel execution
  - Current state: nx.json exists but no NX-specific configuration
  - References: NX task orchestration discussions

## GitHub Actions & Workflows

- [X] **Lowercase workflow and job names**
  - Discussed in: "The requirement was 'ci / build', so 'ci' is supposed to be workflow name"
  - Implemented: Yes (in documentation)
  - Details: All workflow names and job names must be lowercase, use kebab-case for multi-word names
  - Display pattern: `{workflow-name} / {job-name}` (e.g., "ci / build", "sync / issues")
  - References: workflow-naming-conventions.instructions.md

- [x] **Correct Yarn 4 + Corepack setup in workflows**
  - Discussed in: "use `corepack enable && corepack install` for yarn setup"
  - Implemented: Yes (in documentation)
  - Details: Sequence must be: Node.js setup → corepack enable → corepack install → yarn install
  - Common mistake: Using `cache: 'yarn'` in setup-node before enabling corepack
  - References: github-actions-workflows.instructions.md

- [x] **Workflow concurrency controls**
  - Discussed in: "workflow only runs with parallelism of one (and cancels in progress on PRs)"
  - Implemented: No (workflows removed)
  - Details:
    * Parallelism of 1 per context to prevent race conditions
    * Cancel in-progress runs on PRs
    * Run on every SHA on main (no cancellation)
  - References: Concurrency control discussions

## Code Organization & Standards

- [x] **500-line file limit**
  - Discussed in: "Generally, no file should be longer than 500 lines"
  - Details: Break files into modules if they exceed 500 lines. Need to capture as rule in copilot instructions
  - References: File organization comments

- [x] **Modular architecture**
  - Discussed in: "separate functions logically into libraries/modules"
  - Details: Organize code into logical modules (common/, scan-todos/, sync-issues/), need to capture as rule
  - References: Code organization feedback

- [x] **Use existing libraries instead of reinventing**
  - Discussed in: "frontmatter parsing belongs in lib/, use well-maintained libraries"
  - Details: Use established libraries like `gray-matter` for frontmatter parsing instead of custom implementation. Need to capture as rule
  - References: Latest simplification comment

## Testing

- [x] **Comprehensive test coverage (>70%)**
- [ ] **Test infrastructure with Vitest**

## Documentation

- [x] **Complete requirements specification**
- [x] **Copilot instruction files**
- [x] **Capture repo-wide patterns in rules**

- [x] **"WTF dude" trigger**
  - Discussed in: "Any time I say 'wtf dude' should trigger you to step back"
  - Implemented: Yes (documented)
  - Details: When user says "wtf dude", stop, analyze what went wrong, update rules, fix the issue
  - References: critical-behavior-rules.instructions.md

- [x] **Repetitive action detection (5+ times)**
  - Discussed in: "if you do same thing more than 5 times in a row, stop and reassess"
  - Implemented: Yes (documented)
  - Details: If same action/sequence performed >5 times, stop, analyze, find correct approach, update rules
  - References: critical-behavior-rules.instructions.md

- [x] **Never blindly wait for CI**
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
