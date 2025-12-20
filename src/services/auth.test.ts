import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../services/auth';

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store and retrieve token', () => {
    const token = 'ghp_test123';
    authService.setToken(token);

    expect(authService.getToken()).toBe(token);
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('should remove token on logout', () => {
    authService.setToken('ghp_test123');
    authService.logout();

    expect(authService.getToken()).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
  });
});
