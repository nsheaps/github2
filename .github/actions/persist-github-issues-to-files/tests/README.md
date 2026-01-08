# Tests for persist-github-issues-to-files Action

This directory contains comprehensive tests for the GitHub Issues sync action.

## Running Tests

```bash
# From the .github directory
cd .github
yarn test

# With coverage
yarn test:coverage

# Watch mode
yarn test:watch
```

## Test Structure

- `common/` - Tests for shared utilities
  - `yaml-frontmatter.test.ts` - YAML parsing and serialization
  - `file-utils.test.ts` - File operations and binary detection
  
- `scan-todos/` - Tests for TODO scanning
  - `scanner.test.ts` - TODO detection in various file types
  
- `sync-issues/` - Tests for issue synchronization
  - `state-machine.test.ts` - State transition logic

## Coverage

All modules maintain >90% code coverage with focus on:
- Edge cases (empty files, special characters, etc.)
- Error handling
- Critical business logic
- State transitions

## Mocking

Tests use Vitest's built-in mocking capabilities for:
- File system operations (where needed for isolation)
- GitHub API calls (to avoid rate limits and ensure deterministic tests)
- Git operations (to avoid modifying the actual repository)
