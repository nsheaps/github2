/**
 * URL Mapper Service
 *
 * Converts between GitHub URLs and GitHub2 URLs
 */

export type PageType =
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
  | 'search'
  | 'global-issues'
  | 'global-pulls';

export interface URLParts {
  type: PageType;
  owner?: string;
  repo?: string;
  number?: number;
  sha?: string;
  branch?: string;
  base?: string;
  head?: string;
  path?: string;
  query?: string;
  hash?: string;
}

interface URLPattern {
  pattern: RegExp;
  type: PageType;
  extract: (match: RegExpMatchArray, url: URL) => URLParts;
  toGitHub2: (parts: URLParts) => string;
  toGitHub: (parts: URLParts) => string;
}

// GitHub2 base path (configured for GitHub Pages deployment)
const GITHUB2_BASE = '/github2';

// URL Pattern definitions
const patterns: URLPattern[] = [
  // Pull request
  {
    pattern: /^\/([^/]+)\/([^/]+)\/pull\/(\d+)/,
    type: 'pull',
    extract: (match, url) => ({
      type: 'pull',
      owner: match[1],
      repo: match[2],
      number: parseInt(match[3]),
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts =>
      `${GITHUB2_BASE}/${parts.owner}/${parts.repo}/pull/${parts.number}${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts =>
      `https://github.com/${parts.owner}/${parts.repo}/pull/${parts.number}${parts.query || ''}${parts.hash || ''}`,
  },

  // Pull requests list
  {
    pattern: /^\/([^/]+)\/([^/]+)\/pulls\/?$/,
    type: 'pulls',
    extract: (match, url) => ({
      type: 'pulls',
      owner: match[1],
      repo: match[2],
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts =>
      `${GITHUB2_BASE}/${parts.owner}/${parts.repo}/pulls${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts =>
      `https://github.com/${parts.owner}/${parts.repo}/pulls${parts.query || ''}${parts.hash || ''}`,
  },

  // Issue
  {
    pattern: /^\/([^/]+)\/([^/]+)\/issues\/(\d+)/,
    type: 'issue',
    extract: (match, url) => ({
      type: 'issue',
      owner: match[1],
      repo: match[2],
      number: parseInt(match[3]),
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts =>
      `${GITHUB2_BASE}/${parts.owner}/${parts.repo}/issues/${parts.number}${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts =>
      `https://github.com/${parts.owner}/${parts.repo}/issues/${parts.number}${parts.query || ''}${parts.hash || ''}`,
  },

  // Issues list
  {
    pattern: /^\/([^/]+)\/([^/]+)\/issues\/?$/,
    type: 'issues',
    extract: (match, url) => ({
      type: 'issues',
      owner: match[1],
      repo: match[2],
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts =>
      `${GITHUB2_BASE}/${parts.owner}/${parts.repo}/issues${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts =>
      `https://github.com/${parts.owner}/${parts.repo}/issues${parts.query || ''}${parts.hash || ''}`,
  },

  // Commit
  {
    pattern: /^\/([^/]+)\/([^/]+)\/commit\/([a-fA-F0-9]+)/,
    type: 'commit',
    extract: (match, url) => ({
      type: 'commit',
      owner: match[1],
      repo: match[2],
      sha: match[3],
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts =>
      `${GITHUB2_BASE}/${parts.owner}/${parts.repo}/commit/${parts.sha}${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts =>
      `https://github.com/${parts.owner}/${parts.repo}/commit/${parts.sha}${parts.query || ''}${parts.hash || ''}`,
  },

  // Commits
  {
    pattern: /^\/([^/]+)\/([^/]+)\/commits\/(.+)/,
    type: 'commits',
    extract: (match, url) => ({
      type: 'commits',
      owner: match[1],
      repo: match[2],
      branch: match[3],
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts =>
      `${GITHUB2_BASE}/${parts.owner}/${parts.repo}/commits/${parts.branch}${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts =>
      `https://github.com/${parts.owner}/${parts.repo}/commits/${parts.branch}${parts.query || ''}${parts.hash || ''}`,
  },

  // Compare
  {
    pattern: /^\/([^/]+)\/([^/]+)\/compare\/([^.]+)\.\.\.?([^/]+)/,
    type: 'compare',
    extract: (match, url) => ({
      type: 'compare',
      owner: match[1],
      repo: match[2],
      base: match[3],
      head: match[4],
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts =>
      `${GITHUB2_BASE}/${parts.owner}/${parts.repo}/compare/${parts.base}...${parts.head}${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts =>
      `https://github.com/${parts.owner}/${parts.repo}/compare/${parts.base}...${parts.head}${parts.query || ''}${parts.hash || ''}`,
  },

  // Repository
  {
    pattern: /^\/([^/]+)\/([^/]+)\/?$/,
    type: 'repo',
    extract: (match, url) => ({
      type: 'repo',
      owner: match[1],
      repo: match[2],
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts =>
      `${GITHUB2_BASE}/${parts.owner}/${parts.repo}${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts =>
      `https://github.com/${parts.owner}/${parts.repo}${parts.query || ''}${parts.hash || ''}`,
  },

  // User/Organization
  {
    pattern: /^\/([^/]+)\/?$/,
    type: 'user',
    extract: (match, url) => ({
      type: 'user',
      owner: match[1],
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts => `${GITHUB2_BASE}/${parts.owner}${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts => `https://github.com/${parts.owner}${parts.query || ''}${parts.hash || ''}`,
  },

  // Global notifications
  {
    pattern: /^\/notifications\/?$/,
    type: 'notifications',
    extract: (_match, url) => ({
      type: 'notifications',
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts => `${GITHUB2_BASE}/notifications${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts => `https://github.com/notifications${parts.query || ''}${parts.hash || ''}`,
  },

  // Global issues
  {
    pattern: /^\/issues\/?$/,
    type: 'global-issues',
    extract: (_match, url) => ({
      type: 'global-issues',
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts => `${GITHUB2_BASE}/issues${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts => `https://github.com/issues${parts.query || ''}${parts.hash || ''}`,
  },

  // Global pulls
  {
    pattern: /^\/pulls\/?$/,
    type: 'global-pulls',
    extract: (_match, url) => ({
      type: 'global-pulls',
      query: url.search,
      hash: url.hash,
    }),
    toGitHub2: parts => `${GITHUB2_BASE}/pulls${parts.query || ''}${parts.hash || ''}`,
    toGitHub: parts => `https://github.com/pulls${parts.query || ''}${parts.hash || ''}`,
  },
];

export class URLMapper {
  /**
   * Check if URL is a GitHub URL
   */
  static isGitHubURL(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.hostname === 'github.com';
    } catch {
      return false;
    }
  }

  /**
   * Check if URL is a GitHub2 URL
   * @param url - URL to check
   * @param origin - Optional origin (defaults to window.location.origin if available)
   */
  static isGitHub2URL(url: string, origin?: string): boolean {
    try {
      const baseOrigin =
        origin ||
        (typeof window !== 'undefined' ? window.location.origin : 'https://nsheaps.github.io');
      const parsed = new URL(url, baseOrigin);
      return parsed.pathname.startsWith(GITHUB2_BASE);
    } catch {
      return false;
    }
  }

  /**
   * Parse a URL into components
   * @param url - URL to parse
   * @param origin - Optional origin (defaults to window.location.origin if available)
   */
  static parse(url: string, origin?: string): URLParts | null {
    try {
      const baseOrigin =
        origin ||
        (typeof window !== 'undefined' ? window.location.origin : 'https://nsheaps.github.io');
      const parsed = new URL(url, baseOrigin);
      const pathname = parsed.pathname;

      // Try GitHub2 URL first
      if (pathname.startsWith(GITHUB2_BASE)) {
        const github2Path = pathname.slice(GITHUB2_BASE.length);
        return this.parseGitHubPath(github2Path, parsed);
      }

      // Try GitHub URL
      if (parsed.hostname === 'github.com') {
        return this.parseGitHubPath(parsed.pathname, parsed);
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Parse GitHub pathname
   */
  private static parseGitHubPath(pathname: string, url: URL): URLParts | null {
    for (const pattern of patterns) {
      const match = pathname.match(pattern.pattern);
      if (match) {
        return pattern.extract(match, url);
      }
    }
    return null;
  }

  /**
   * Convert GitHub URL to GitHub2 URL
   */
  static toGitHub2(githubUrl: string): string | null {
    if (!this.isGitHubURL(githubUrl)) {
      return null;
    }

    try {
      const parsed = new URL(githubUrl);
      const pathname = parsed.pathname;

      for (const pattern of patterns) {
        const match = pathname.match(pattern.pattern);
        if (match) {
          const parts = pattern.extract(match, parsed);
          return pattern.toGitHub2(parts);
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Convert GitHub2 URL to GitHub URL
   * @param github2Url - GitHub2 URL to convert
   * @param origin - Optional origin (defaults to window.location.origin if available)
   */
  static toGitHub(github2Url: string, origin?: string): string | null {
    try {
      const baseOrigin =
        origin ||
        (typeof window !== 'undefined' ? window.location.origin : 'https://nsheaps.github.io');
      const parsed = new URL(github2Url, baseOrigin);
      const pathname = parsed.pathname;

      if (!pathname.startsWith(GITHUB2_BASE)) {
        return null;
      }

      const github2Path = pathname.slice(GITHUB2_BASE.length);

      for (const pattern of patterns) {
        const match = github2Path.match(pattern.pattern);
        if (match) {
          const parts = pattern.extract(match, parsed);
          return pattern.toGitHub(parts);
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Get the GitHub2 base path (for configuration)
   */
  static getBasePath(): string {
    return GITHUB2_BASE;
  }
}
