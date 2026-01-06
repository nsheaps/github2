# URL Redirects and Mapping Specification

## Goal

Create a system for redirecting GitHub URLs to their GitHub2 equivalents, supporting seamless navigation between github.com and the GitHub2 client.

## Background

GitHub2 needs to provide an alternative interface to GitHub while maintaining URL compatibility. Users should be able to:

1. Navigate from github.com to GitHub2 by modifying the URL
2. Share GitHub2 URLs that map to GitHub resources
3. Use browser extensions to add "Open in GitHub2" buttons on GitHub pages

## Requirements

### Functional Requirements

1. **URL Pattern Mapping**: Support mapping GitHub URL patterns to GitHub2 routes
2. **Bidirectional Navigation**: Support both github.com → github2 and github2 → github.com
3. **Comprehensive Coverage**: Handle all major GitHub page types (repos, issues, PRs, commits, etc.)
4. **Query Parameter Preservation**: Maintain query parameters during redirects
5. **Fragment/Hash Support**: Preserve URL fragments (e.g., #L123 for line numbers)

### Non-Functional Requirements

1. **Performance**: URL parsing and transformation should be <1ms
2. **Maintainability**: Easy to add new URL patterns
3. **Type Safety**: TypeScript types for all URL patterns
4. **Testing**: 100% coverage for URL transformations

### Out of Scope

- Server-side redirects (client-side only)
- GitHub Enterprise Server URLs (public GitHub only)
- Legacy GitHub URLs (pre-2015)

## User Stories

**As a** GitHub user
**I want** to easily navigate from a GitHub page to its GitHub2 equivalent
**So that** I can use GitHub2's enhanced features for that resource

**As a** GitHub2 user
**I want** to share GitHub2 URLs with others
**So that** they can view the same resource in GitHub2

**As a** developer
**I want** a programmatic way to convert between GitHub and GitHub2 URLs
**So that** I can build features that link between the two platforms

## Design

### Architecture

```
┌─────────────────┐
│  GitHub URL     │
│  github.com/... │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  URL Parser     │
│  Extract parts  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  URL Mapper     │
│  Apply pattern  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GitHub2 URL    │
│  .../github2/...│
└─────────────────┘
```

### URL Patterns

#### GitHub → GitHub2 Mapping

```
github.com/{owner}/{repo}
  → /github2/{owner}/{repo}

github.com/{owner}/{repo}/issues
  → /github2/{owner}/{repo}/issues

github.com/{owner}/{repo}/issues/{number}
  → /github2/{owner}/{repo}/issues/{number}

github.com/{owner}/{repo}/pull/{number}
  → /github2/{owner}/{repo}/pull/{number}

github.com/{owner}/{repo}/pulls
  → /github2/{owner}/{repo}/pulls

github.com/{owner}/{repo}/commit/{sha}
  → /github2/{owner}/{repo}/commit/{sha}

github.com/{owner}/{repo}/commits/{branch}
  → /github2/{owner}/{repo}/commits/{branch}

github.com/{owner}/{repo}/compare/{base}...{head}
  → /github2/{owner}/{repo}/compare/{base}...{head}

github.com/{owner}
  → /github2/{owner}

github.com/notifications
  → /github2/notifications

github.com/issues
  → /github2/issues

github.com/pulls
  → /github2/pulls
```

### Components

#### URLMapper Class

**Purpose**: Convert between GitHub and GitHub2 URLs

**Interface**:

```typescript
class URLMapper {
  // Convert GitHub URL to GitHub2 URL
  static toGitHub2(githubUrl: string): string | null;

  // Convert GitHub2 URL to GitHub URL
  static toGitHub(github2Url: string): string | null;

  // Parse a URL into components
  static parse(url: string): ParsedURL | null;

  // Check if URL is a GitHub URL
  static isGitHubURL(url: string): boolean;

  // Check if URL is a GitHub2 URL
  static isGitHub2URL(url: string): boolean;
}

interface ParsedURL {
  type: 'repo' | 'issue' | 'pull' | 'commit' | 'commits' | 'compare' | 'user' | 'notifications';
  owner?: string;
  repo?: string;
  number?: number;
  sha?: string;
  branch?: string;
  base?: string;
  head?: string;
  path?: string;
  query?: Record<string, string>;
  hash?: string;
}
```

**Implementation Strategy**:

```typescript
// Pattern-based approach using regex
const patterns = [
  {
    pattern: /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/,
    type: 'issue',
    extract: match => ({ owner: match[1], repo: match[2], number: parseInt(match[3]) }),
    toGitHub2: parts => `/github2/${parts.owner}/${parts.repo}/issues/${parts.number}`,
  },
  // ... more patterns
];
```

#### React Hook: useURLRedirect

**Purpose**: Provide redirect functionality in React components

**Interface**:

```typescript
function useURLRedirect() {
  const redirectToGitHub2 = (githubUrl: string) => void;
  const redirectToGitHub = (github2Url: string) => void;
  const getGitHub2URL = (githubUrl: string) => string | null;
  const getGitHubURL = (github2Url: string) => string | null;

  return { redirectToGitHub2, redirectToGitHub, getGitHub2URL, getGitHubURL };
}
```

### Data Model

```typescript
type URLPattern = {
  // Regex pattern to match URLs
  pattern: RegExp;

  // Type of resource this pattern matches
  type: PageType;

  // Extract parts from regex match
  extract: (match: RegExpMatchArray) => URLParts;

  // Build GitHub2 URL from parts
  toGitHub2: (parts: URLParts) => string;

  // Build GitHub URL from parts
  toGitHub: (parts: URLParts) => string;
};

type PageType =
  | 'repo'
  | 'issue'
  | 'issues'
  | 'pull'
  | 'pulls'
  | 'commit'
  | 'commits'
  | 'compare'
  | 'user'
  | 'notifications'
  | 'search';

type URLParts = {
  owner?: string;
  repo?: string;
  number?: number;
  sha?: string;
  branch?: string;
  base?: string;
  head?: string;
  path?: string;
  query?: URLSearchParams;
  hash?: string;
};
```

## UI/UX

### Browser Extension Button

```
┌─────────────────────────────────────────────┐
│ github.com/owner/repo/issues/123            │
├─────────────────────────────────────────────┤
│                                             │
│  Issue Title                 [Open in 🚀]  │ ← Button added by extension
│                                             │
│  Issue body...                              │
│                                             │
└─────────────────────────────────────────────┘
```

### GitHub2 Navigation

Users can manually edit URLs:

```
github.com/owner/repo/issues/123
         ↓ (user edits)
nsheaps.github.io/github2/owner/repo/issues/123
```

Or click extension button:

```
[GitHub page] → [Click "Open in GitHub2"] → [GitHub2 page opens]
```

## Implementation Plan

### Phase 1: Core URL Mapping

- [x] Create `src/services/urlMapper.ts`
- [ ] Implement URLMapper class
- [ ] Add URL pattern definitions
- [ ] Add unit tests for all patterns
- [ ] Document supported patterns

### Phase 2: React Integration

- [ ] Create `useURLRedirect` hook
- [ ] Add redirect button component
- [ ] Integrate with routing
- [ ] Add tests for hook

### Phase 3: Browser Extension Integration

- [ ] Use URLMapper in extension content script
- [ ] Add "Open in GitHub2" buttons to GitHub pages
- [ ] Handle click events
- [ ] Test on various GitHub pages

## Testing Strategy

### Unit Tests

Test URLMapper for each pattern:

```typescript
describe('URLMapper', () => {
  describe('Issue URLs', () => {
    it('should convert issue URL to GitHub2', () => {
      const input = 'https://github.com/owner/repo/issues/123';
      const expected = '/github2/owner/repo/issues/123';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should preserve query parameters', () => {
      const input = 'https://github.com/owner/repo/issues?q=bug';
      const output = URLMapper.toGitHub2(input);
      expect(output).toContain('?q=bug');
    });

    it('should preserve hash fragments', () => {
      const input = 'https://github.com/owner/repo/issues/123#issuecomment-456';
      const output = URLMapper.toGitHub2(input);
      expect(output).toContain('#issuecomment-456');
    });
  });

  // ... tests for all other patterns
});
```

### Integration Tests

Test hook in React components:

```typescript
describe('useURLRedirect', () => {
  it('should redirect to GitHub2 URL', () => {
    const { result } = renderHook(() => useURLRedirect());

    const githubUrl = 'https://github.com/owner/repo';
    act(() => {
      result.current.redirectToGitHub2(githubUrl);
    });

    // Verify navigation occurred
  });
});
```

### E2E Tests

- Navigate from GitHub to GitHub2 via extension
- Navigate from GitHub2 back to GitHub
- Verify all page types load correctly

## Security Considerations

1. **URL Validation**: Always validate URLs before redirecting to prevent open redirect vulnerabilities
   - Mitigation: Whitelist github.com domain, validate GitHub2 base path

2. **XSS via URL Parameters**: Ensure URL parameters are not executed as code
   - Mitigation: Use built-in URL parsing, escape rendered parameters

3. **Extension Permissions**: Minimize required browser permissions
   - Mitigation: Only request access to github.com, not all sites

## Performance Considerations

- URL parsing should be synchronous and <1ms
- Cache parsed URLs (memoization) if repeatedly accessed
- Use compiled regex patterns (don't create new regex on each call)

**Expected Metrics**:

- URL transformation: <1ms
- Pattern matching: <0.5ms
- No memory leaks from cached URLs

## Accessibility

- Extension buttons should be keyboard accessible
- Provide clear labels for screen readers
- Maintain focus management when redirecting

## Open Questions

- [x] Should we support GitHub Enterprise URLs? → No, out of scope for v1
- [ ] Should we support gist.github.com? → TBD
- [ ] Should we auto-redirect or require user action? → User action (extension button)

## Assumptions

- Users access GitHub via github.com (not enterprise)
- Browser extensions have permission to inject content on github.com
- GitHub2 is hosted at a predictable URL (e.g., nsheaps.github.io/github2)
- GitHub URL structure remains stable

## Alternatives Considered

### Alternative 1: Server-Side Redirects

**Pros**: Would work without JavaScript, simpler for users
**Cons**: Requires a server, more complex infrastructure
**Decision**: Client-side only for now (static hosting)

### Alternative 2: Browser Extension Only (No URL Mapping Service)

**Pros**: Simpler, extension-focused
**Cons**: Can't manually edit URLs, less flexible
**Decision**: Provide both extension and URL mapping for flexibility

### Alternative 3: Use Proxy Server

**Pros**: Could intercept and rewrite all GitHub requests
**Cons**: Privacy concerns, complexity, potential ToS violations
**Decision**: Not chosen due to complexity and privacy concerns

## References

- [GitHub URL Patterns Documentation](https://docs.github.com/)
- [Browser Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [URL Web API](https://developer.mozilla.org/en-US/docs/Web/API/URL)

## Revision History

| Date       | Version | Changes       | Author         |
| ---------- | ------- | ------------- | -------------- |
| 2026-01-06 | 0.1     | Initial draft | GitHub Copilot |
