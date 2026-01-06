# Testing Principles

## Overview

This document outlines the testing strategy and principles for the GitHub2 project.

## Core Principles

### 1. Test What Matters
- Focus on user-facing functionality
- Test behavior, not implementation details
- Happy path coverage is mandatory, edge cases are important

### 2. Fast and Reliable
- Tests should run quickly (<5s for unit tests)
- No flaky tests - fix or remove
- Deterministic results every time

### 3. Easy to Write and Maintain
- Use clear, descriptive test names
- Keep tests simple and focused
- Minimize test setup and mocking

### 4. Test at the Right Level
- Unit tests for business logic
- Integration tests for component interactions
- E2E tests for critical user flows

## Testing Strategy

### Unit Testing

**Tool**: Vitest + React Testing Library

**What to Test**:
- React components (rendering, user interactions)
- Custom hooks (state management, side effects)
- Utility functions (data transformations, validations)
- Service modules (API calls, data fetching)

**What NOT to Test**:
- Third-party libraries
- Browser APIs (mock them instead)
- Trivial getters/setters
- Constants and types

**Example Structure**:
```typescript
describe('ComponentName', () => {
  it('should render with default props', () => {
    // Arrange
    // Act
    // Assert
  });
  
  it('should handle user interaction', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Integration Testing

**Tool**: Vitest + React Testing Library

**What to Test**:
- Multiple components working together
- Data flow between components
- State management across the app
- API integration with mocked responses

**Example**: Testing a form with validation, submission, and success/error states

### End-to-End Testing

**Tool**: Playwright (future)

**What to Test**:
- Complete user flows
- Critical paths (login, create PR, etc.)
- Cross-browser compatibility
- Mobile responsiveness

**Strategy**:
- Run in CI on every PR
- Use real GitHub API with test account (or mocked)
- Capture screenshots on failure
- Run against production-like build

## Testing Guidelines

### Component Testing

**DO**:
- Render components with realistic props
- Test from the user's perspective
- Use accessible queries (getByRole, getByLabelText)
- Test keyboard navigation
- Test loading and error states

**DON'T**:
- Test implementation details (state variables, internal methods)
- Mock everything (prefer real implementations)
- Use snapshot testing for everything
- Test CSS or styles directly

### Hook Testing

**DO**:
- Use `renderHook` from @testing-library/react
- Test the hook's return values and behavior
- Test effects and cleanup
- Test with different initial values

**DON'T**:
- Test hooks in isolation if they depend on context
- Ignore error handling

### Service Testing

**DO**:
- Mock fetch/axios for API calls
- Test request headers and body
- Test response parsing
- Test error scenarios

**DON'T**:
- Make real API calls in unit tests
- Test network layer itself

## Coverage Goals

- **Overall**: Aim for 80%+ coverage
- **Critical Paths**: 100% coverage required
- **New Code**: Should not decrease overall coverage
- **UI Components**: Focus on user interactions, not every render path

**Note**: 100% coverage is not the goal. Quality over quantity.

## Testing Workflow

### During Development

1. Write test first (TDD) or alongside code
2. Run tests in watch mode: `npm run test:watch`
3. Ensure new tests pass and old tests still pass
4. Check coverage for new code

### Before Committing

1. Run full test suite: `npm test`
2. Fix any failing tests
3. Ensure no console errors/warnings
4. Commit with confidence

### In CI

1. All tests must pass
2. No skipped/todo tests in main branch
3. Coverage reports generated (future)
4. E2E tests run on preview deployment (future)

## Design Decisions

### Testing Framework
- **Decision**: Vitest over Jest
- **Rationale**: Faster, native ESM support, Vite integration, better DX
- **Review Date**: Continuous

### Component Testing Library
- **Decision**: React Testing Library
- **Rationale**: Industry standard, encourages best practices, great documentation
- **Alternative Considered**: Enzyme (deprecated)

### Mocking Strategy
- **Decision**: Minimal mocking, prefer real implementations
- **Rationale**: More realistic tests, catches integration issues
- **When to Mock**: External APIs, slow operations, non-deterministic behavior

### Test File Location
- **Decision**: Co-located with source files (*.test.ts, *.test.tsx)
- **Rationale**: Easy to find, encourages writing tests
- **Alternative**: Separate __tests__ directory (only for integration tests)

### Assertion Library
- **Decision**: Vitest's built-in assertions
- **Rationale**: Good enough, one less dependency
- **Extension**: @testing-library/jest-dom for DOM assertions

## Future Enhancements

- [ ] Add E2E testing with Playwright
- [ ] Add visual regression testing
- [ ] Add performance testing
- [ ] Add accessibility testing automation
- [ ] Add mutation testing
- [ ] Add code coverage reporting in CI
- [ ] Add test reports in PR comments

## Appendix

### Example: Component Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from './Login';

describe('Login', () => {
  it('should allow user to login with token', async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    
    render(<Login onLogin={onLogin} />);
    
    const input = screen.getByLabelText('GitHub Token');
    const button = screen.getByRole('button', { name: 'Login' });
    
    await user.type(input, 'ghp_test123');
    await user.click(button);
    
    expect(onLogin).toHaveBeenCalledWith('ghp_test123');
  });
  
  it('should show error for empty token', async () => {
    const user = userEvent.setup();
    
    render(<Login onLogin={vi.fn()} />);
    
    const button = screen.getByRole('button', { name: 'Login' });
    await user.click(button);
    
    expect(screen.getByText('Token is required')).toBeInTheDocument();
  });
});
```

### Example: Hook Test

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useRateLimitPolling } from './useRateLimitPolling';

describe('useRateLimitPolling', () => {
  it('should fetch rate limit on mount', async () => {
    const { result } = renderHook(() => useRateLimitPolling('token', 5000));
    
    await waitFor(() => {
      expect(result.current.rateLimit).toBeDefined();
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
```

### Example: Service Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { githubService } from './github';

describe('githubService', () => {
  it('should fetch rate limit', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ rate: { limit: 5000, remaining: 4999 } }),
      })
    );
    
    const result = await githubService.getRateLimit('token');
    
    expect(result.rate.limit).toBe(5000);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/rate_limit',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token',
        }),
      })
    );
  });
});
```
