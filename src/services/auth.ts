const TOKEN_KEY = 'github_access_token';
const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';

export const authService = {
  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Store token
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove token
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Start OAuth flow
  initiateLogin(): void {
    const redirectUri = `${window.location.origin}/github-rate-limit-viewer/callback`;
    const scope = 'read:user';
    const state = Math.random().toString(36).substring(7);

    // Store state for verification
    sessionStorage.setItem('oauth_state', state);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    window.location.href = authUrl;
  },

  // Handle OAuth callback
  handleCallback(): string | null {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const storedState = sessionStorage.getItem('oauth_state');

    // Verify state to prevent CSRF
    if (state !== storedState) {
      console.error('State mismatch - possible CSRF attack');
      return null;
    }

    sessionStorage.removeItem('oauth_state');
    return code;
  },

  // Logout
  logout(): void {
    this.removeToken();
  },
};
