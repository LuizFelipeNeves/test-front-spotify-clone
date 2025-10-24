import { useState, useEffect } from 'react';
import type { AuthState, User } from '@/types';

/**
 * Custom hook for authentication management
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('spotify_access_token');
    const storedUser = localStorage.getItem('spotify_user');

    if (storedToken && storedUser) {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(storedUser),
        accessToken: storedToken,
        refreshToken: localStorage.getItem('spotify_refresh_token'),
      });
    }

    setLoading(false);
  }, []);

  const login = (accessToken: string, refreshToken: string, user: User) => {
    localStorage.setItem('spotify_access_token', accessToken);
    localStorage.setItem('spotify_refresh_token', refreshToken);
    localStorage.setItem('spotify_user', JSON.stringify(user));

    setAuthState({
      isAuthenticated: true,
      user,
      accessToken,
      refreshToken,
    });
  };

  const logout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_user');

    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  };

  const updateUser = (user: User) => {
    localStorage.setItem('spotify_user', JSON.stringify(user));
    setAuthState(prev => ({ ...prev, user }));
  };

  return {
    ...authState,
    loading,
    login,
    logout,
    updateUser,
  };
};
