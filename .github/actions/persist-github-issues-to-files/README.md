# Persist GitHub Issues to Files

Bidirectional sync between `.github/issues/*.md` files and GitHub Issues.

## Status: Placeholder

This is a placeholder action. The sync logic needs to be implemented.

## Planned Features

Based on the spec in `.github/issues/implement-bidirectional-issue-sync.md`:

### State Machine

| Code | Doc | Issue | PR Action | Push to Main Action |
|------|-----|-------|-----------|---------------------|
| NO | NO | YES | Do nothing | Close orphaned issue |
| NO | YES | YES | Do nothing | Sync doc => issue |
| NO | YES | NO | Do nothing | Create issue, rename doc |
| YES | NO | NO | Create doc | Create issue + doc |
| YES | YES | NO | Ensure doc link | Create issue, rename doc |
| YES | YES | YES | - | Sync doc => issue |

### Issue Events

- `opened`/`edited`: Sync issue content to doc file
- `closed`: Delete corresponding doc file

### File Naming

- Without issue: `todo-{id}-{slug}.md`
- With issue: `{number}-{title-slug}.md`

### Frontmatter Format

```yaml
---
title: Issue Title
labels: [label1, label2]
assignees: []
---
```

## Usage

```yaml
- uses: ./.github/actions/persist-github-issues-to-files
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    event-name: ${{ github.event_name }}
    event-action: ${{ github.event.action }}
    issue-number: ${{ github.event.issue.number }}
```

## Implementation TODO

- [ ] Parse `.github/issues/*.md` files with frontmatter
- [ ] Scan code for TODO comments
- [ ] Implement state machine logic
- [ ] Create/update GitHub issues via API
- [ ] Rename docs with `git mv` when issues are created
- [ ] Add `[skip ci]` to automated commits
- [ ] Implement >70% test coverage
