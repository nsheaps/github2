import { describe, it, expect, beforeEach } from 'vitest';
import { URLMapper } from './urlMapper';

describe('URLMapper', () => {
  beforeEach(() => {
    // Mock window.location for tests
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://nsheaps.github.io',
      },
      writable: true,
    });
  });

  describe('isGitHubURL', () => {
    it('should return true for GitHub URLs', () => {
      expect(URLMapper.isGitHubURL('https://github.com/owner/repo')).toBe(true);
      expect(URLMapper.isGitHubURL('http://github.com/owner/repo')).toBe(true);
    });

    it('should return false for non-GitHub URLs', () => {
      expect(URLMapper.isGitHubURL('https://example.com')).toBe(false);
      expect(URLMapper.isGitHubURL('https://nsheaps.github.io/github2/owner/repo')).toBe(false);
    });

    it('should return false for invalid URLs', () => {
      expect(URLMapper.isGitHubURL('not a url')).toBe(false);
    });
  });

  describe('isGitHub2URL', () => {
    it('should return true for GitHub2 URLs', () => {
      expect(URLMapper.isGitHub2URL('/github2/owner/repo')).toBe(true);
      expect(URLMapper.isGitHub2URL('https://nsheaps.github.io/github2/owner/repo')).toBe(true);
    });

    it('should return false for non-GitHub2 URLs', () => {
      expect(URLMapper.isGitHub2URL('https://github.com/owner/repo')).toBe(false);
      expect(URLMapper.isGitHub2URL('/other/path')).toBe(false);
    });
  });

  describe('parse', () => {
    it('should parse repository URL', () => {
      const result = URLMapper.parse('https://github.com/owner/repo');
      expect(result).toEqual({
        type: 'repo',
        owner: 'owner',
        repo: 'repo',
        query: '',
        hash: '',
      });
    });

    it('should parse issue URL', () => {
      const result = URLMapper.parse('https://github.com/owner/repo/issues/123');
      expect(result).toEqual({
        type: 'issue',
        owner: 'owner',
        repo: 'repo',
        number: 123,
        query: '',
        hash: '',
      });
    });

    it('should parse pull request URL', () => {
      const result = URLMapper.parse('https://github.com/owner/repo/pull/456');
      expect(result).toEqual({
        type: 'pull',
        owner: 'owner',
        repo: 'repo',
        number: 456,
        query: '',
        hash: '',
      });
    });

    it('should parse commit URL', () => {
      const result = URLMapper.parse('https://github.com/owner/repo/commit/abc123');
      expect(result).toEqual({
        type: 'commit',
        owner: 'owner',
        repo: 'repo',
        sha: 'abc123',
        query: '',
        hash: '',
      });
    });

    it('should parse user URL', () => {
      const result = URLMapper.parse('https://github.com/username');
      expect(result).toEqual({
        type: 'user',
        owner: 'username',
        query: '',
        hash: '',
      });
    });

    it('should preserve query parameters', () => {
      const result = URLMapper.parse('https://github.com/owner/repo/issues?q=bug');
      expect(result?.query).toBe('?q=bug');
    });

    it('should preserve hash fragments', () => {
      const result = URLMapper.parse('https://github.com/owner/repo/issues/123#issuecomment-456');
      expect(result?.hash).toBe('#issuecomment-456');
    });

    it('should return null for invalid URLs', () => {
      expect(URLMapper.parse('not a url')).toBeNull();
    });

    it('should return null for non-GitHub URLs', () => {
      expect(URLMapper.parse('https://example.com/path')).toBeNull();
    });
  });

  describe('toGitHub2', () => {
    it('should convert repository URL', () => {
      const input = 'https://github.com/owner/repo';
      const expected = '/github2/owner/repo';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert issue URL', () => {
      const input = 'https://github.com/owner/repo/issues/123';
      const expected = '/github2/owner/repo/issues/123';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert pull request URL', () => {
      const input = 'https://github.com/owner/repo/pull/456';
      const expected = '/github2/owner/repo/pull/456';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert commit URL', () => {
      const input = 'https://github.com/owner/repo/commit/abc123def456';
      const expected = '/github2/owner/repo/commit/abc123def456';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert commits list URL', () => {
      const input = 'https://github.com/owner/repo/commits/main';
      const expected = '/github2/owner/repo/commits/main';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert compare URL with two dots', () => {
      const input = 'https://github.com/owner/repo/compare/main..feature';
      const expected = '/github2/owner/repo/compare/main...feature';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert compare URL with three dots', () => {
      const input = 'https://github.com/owner/repo/compare/main...feature';
      const expected = '/github2/owner/repo/compare/main...feature';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert issues list URL', () => {
      const input = 'https://github.com/owner/repo/issues';
      const expected = '/github2/owner/repo/issues';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert pulls list URL', () => {
      const input = 'https://github.com/owner/repo/pulls';
      const expected = '/github2/owner/repo/pulls';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert user/org URL', () => {
      const input = 'https://github.com/username';
      const expected = '/github2/username';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert global notifications URL', () => {
      const input = 'https://github.com/notifications';
      const expected = '/github2/notifications';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert global issues URL', () => {
      const input = 'https://github.com/issues';
      const expected = '/github2/issues';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should convert global pulls URL', () => {
      const input = 'https://github.com/pulls';
      const expected = '/github2/pulls';
      expect(URLMapper.toGitHub2(input)).toBe(expected);
    });

    it('should preserve query parameters', () => {
      const input = 'https://github.com/owner/repo/issues?q=bug&sort=created';
      const output = URLMapper.toGitHub2(input);
      expect(output).toContain('?q=bug&sort=created');
    });

    it('should preserve hash fragments', () => {
      const input = 'https://github.com/owner/repo/issues/123#issuecomment-456';
      const output = URLMapper.toGitHub2(input);
      expect(output).toContain('#issuecomment-456');
    });

    it('should preserve both query and hash', () => {
      const input = 'https://github.com/owner/repo/pull/123?tab=files#diff-abc';
      const output = URLMapper.toGitHub2(input);
      expect(output).toContain('?tab=files');
      expect(output).toContain('#diff-abc');
    });

    it('should return null for non-GitHub URLs', () => {
      expect(URLMapper.toGitHub2('https://example.com')).toBeNull();
    });

    it('should return null for invalid URLs', () => {
      expect(URLMapper.toGitHub2('not a url')).toBeNull();
    });
  });

  describe('toGitHub', () => {
    it('should convert repository URL', () => {
      const input = '/github2/owner/repo';
      const expected = 'https://github.com/owner/repo';
      expect(URLMapper.toGitHub(input)).toBe(expected);
    });

    it('should convert issue URL', () => {
      const input = '/github2/owner/repo/issues/123';
      const expected = 'https://github.com/owner/repo/issues/123';
      expect(URLMapper.toGitHub(input)).toBe(expected);
    });

    it('should convert pull request URL', () => {
      const input = '/github2/owner/repo/pull/456';
      const expected = 'https://github.com/owner/repo/pull/456';
      expect(URLMapper.toGitHub(input)).toBe(expected);
    });

    it('should convert commit URL', () => {
      const input = '/github2/owner/repo/commit/abc123';
      const expected = 'https://github.com/owner/repo/commit/abc123';
      expect(URLMapper.toGitHub(input)).toBe(expected);
    });

    it('should preserve query parameters', () => {
      const input = '/github2/owner/repo/issues?q=bug';
      const output = URLMapper.toGitHub(input);
      expect(output).toContain('?q=bug');
    });

    it('should preserve hash fragments', () => {
      const input = '/github2/owner/repo/issues/123#issuecomment-456';
      const output = URLMapper.toGitHub(input);
      expect(output).toContain('#issuecomment-456');
    });

    it('should return null for non-GitHub2 URLs', () => {
      expect(URLMapper.toGitHub('/other/path')).toBeNull();
    });
  });

  describe('round-trip conversions', () => {
    const testCases = [
      'https://github.com/owner/repo',
      'https://github.com/owner/repo/issues/123',
      'https://github.com/owner/repo/pull/456',
      'https://github.com/owner/repo/commit/abc123',
      'https://github.com/owner/repo/commits/main',
      'https://github.com/owner/repo/compare/main...feature',
      'https://github.com/username',
      'https://github.com/notifications',
      'https://github.com/issues',
      'https://github.com/pulls',
    ];

    testCases.forEach(githubUrl => {
      it(`should round-trip: ${githubUrl}`, () => {
        const github2Url = URLMapper.toGitHub2(githubUrl);
        expect(github2Url).not.toBeNull();

        const backToGitHub = URLMapper.toGitHub(github2Url!);
        expect(backToGitHub).toBe(githubUrl);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle URLs with trailing slashes', () => {
      const input = 'https://github.com/owner/repo/';
      const output = URLMapper.toGitHub2(input);
      expect(output).toBe('/github2/owner/repo');
    });

    it('should handle commit SHAs of various lengths', () => {
      // Short SHA
      expect(URLMapper.toGitHub2('https://github.com/o/r/commit/abc123')).toBe(
        '/github2/o/r/commit/abc123'
      );

      // Full SHA
      expect(
        URLMapper.toGitHub2(
          'https://github.com/o/r/commit/abc123def456789abc123def456789abc1234567'
        )
      ).toBe('/github2/o/r/commit/abc123def456789abc123def456789abc1234567');
    });

    it('should handle branch names with special characters', () => {
      const input = 'https://github.com/owner/repo/commits/feature/my-branch';
      const output = URLMapper.toGitHub2(input);
      expect(output).toBe('/github2/owner/repo/commits/feature/my-branch');
    });

    it('should handle complex query strings', () => {
      const input = 'https://github.com/owner/repo/issues?q=is:open+label:bug+sort:created-desc';
      const output = URLMapper.toGitHub2(input);
      expect(output).toContain('?q=is:open+label:bug+sort:created-desc');
    });
  });

  describe('getBasePath', () => {
    it('should return the GitHub2 base path', () => {
      expect(URLMapper.getBasePath()).toBe('/github2');
    });
  });
});
