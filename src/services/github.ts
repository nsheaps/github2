import type { RateLimitData, GitHubUser } from '../types';

const API_BASE = 'https://api.github.com';

class GitHubAPIService {
  private token: string | null = null;

  setToken(token: string | null): void {
    this.token = token;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getRateLimit(): Promise<RateLimitData> {
    return this.fetch<RateLimitData>('/rate_limit');
  }

  async getCurrentUser(): Promise<GitHubUser> {
    return this.fetch<GitHubUser>('/user');
  }

  // Note: This is a simplified version. In production, you'd need a backend
  // to exchange the code for a token securely as client secrets shouldn't be exposed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exchangeCodeForToken(_code: string): Promise<string | null> {
    // This is a placeholder - in a real app, this would call your backend
    // which would securely exchange the code for an access token
    console.warn('Token exchange should happen on a backend server');

    // For demonstration, we'll return null and expect the user to manually
    // provide a Personal Access Token
    return null;
  }
}

export const githubAPI = new GitHubAPIService();
