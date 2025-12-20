import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { githubAPI } from '../services/github';
import type { AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();

      if (token) {
        githubAPI.setToken(token);
        try {
          const user = await githubAPI.getCurrentUser();
          setAuthState({
            isAuthenticated: true,
            token,
            user,
          });
        } catch (error) {
          console.error('Failed to fetch user:', error);
          authService.removeToken();
          setAuthState({
            isAuthenticated: false,
            token: null,
            user: null,
          });
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string) => {
    authService.setToken(token);
    githubAPI.setToken(token);

    githubAPI
      .getCurrentUser()
      .then(user => {
        setAuthState({
          isAuthenticated: true,
          token,
          user,
        });
      })
      .catch(error => {
        console.error('Login failed:', error);
        authService.removeToken();
      });
  };

  const logout = () => {
    authService.logout();
    githubAPI.setToken(null);
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  };

  return {
    ...authState,
    loading,
    login,
    logout,
  };
};
