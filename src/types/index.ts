export interface RateLimitData {
  resources: {
    core: RateLimitResource;
    search: RateLimitResource;
    graphql: RateLimitResource;
    integration_manifest: RateLimitResource;
    code_scanning_upload: RateLimitResource;
  };
  rate: RateLimitResource;
}

export interface RateLimitResource {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export interface RateLimitSnapshot {
  timestamp: number;
  core: RateLimitResource;
  search: RateLimitResource;
  graphql: RateLimitResource;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: GitHubUser | null;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  email: string | null;
}

export type PollingInterval = 5000 | 10000 | 30000 | 60000;
