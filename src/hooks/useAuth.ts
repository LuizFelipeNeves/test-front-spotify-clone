import { useState, useEffect, useCallback } from 'react';
import type { AuthState, User } from '@/types';
import { AuthService } from '@/services/auth.service';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'spotify_access_token',
  REFRESH_TOKEN: 'spotify_refresh_token',
  USER: 'spotify_user',
  EXPIRES_AT: 'spotify_expires_at',
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  });

  const [loading, setLoading] = useState(true);

  const clearStorage = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    });
  }, []);

  const login = useCallback(
    (accessToken: string, refreshToken: string, user: User, expiresIn: number) => {
      const expiresAt = AuthService.calculateTokenExpiration(expiresIn);

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());

      setAuthState({
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        expiresAt,
      });
    },
    []
  );

  const logout = useCallback(() => clearStorage(), [clearStorage]);

  const updateUser = useCallback((user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setAuthState((prev) => ({ ...prev, user }));
  }, []);

  const refreshToken = useCallback(async () => {
    if (!authState.refreshToken) return logout();

    try {
      const newTokens = await AuthService.refreshAccessToken(authState.refreshToken);
      const newExpiresAt = AuthService.calculateTokenExpiration(newTokens.expires_in);

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newTokens.access_token);
      localStorage.setItem(
        STORAGE_KEYS.REFRESH_TOKEN,
        newTokens.refresh_token || authState.refreshToken
      );
      localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, newExpiresAt.toString());

      setAuthState((prev) => ({
        ...prev,
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token || prev.refreshToken,
        expiresAt: newExpiresAt,
      }));
    } catch (err) {
      console.error('Failed to refresh token:', err);
      logout();
    }
  }, [authState.refreshToken, logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const storedExpiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);

    if (storedToken && storedUser && storedRefreshToken && storedExpiresAt) {
      const expiresAt = Number(storedExpiresAt);
      if (!AuthService.isTokenExpired(expiresAt)) {
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          accessToken: storedToken,
          refreshToken: storedRefreshToken,
          expiresAt,
        });
      } else {
        clearStorage();
      }
    }

    setLoading(false);
  }, [clearStorage]);

  useEffect(() => {
    if (!authState.isAuthenticated || !authState.expiresAt) return;

    const expiresInMs = authState.expiresAt - Date.now();
    const refreshBuffer = 5 * 60 * 1000; // 5 minutos

    if (expiresInMs <= 0) {
      logout();
      return;
    }

    const timeout = setTimeout(() => {
      refreshToken();
    }, Math.max(expiresInMs - refreshBuffer, 0));

    return () => clearTimeout(timeout);
  }, [authState.expiresAt, authState.isAuthenticated, refreshToken, logout]);

  return {
    ...authState,
    loading,
    login,
    logout,
    updateUser,
  };
};
