import { useState, useEffect, useCallback } from 'react';
import type { AuthState, User } from '@/types';
import { AuthService } from '@/services/auth.service';

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
    AuthService.clearAuthData();
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
      AuthService.setAuthData(accessToken, refreshToken, user, expiresIn);

      setAuthState({
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        expiresAt: AuthService.calculateTokenExpiration(expiresIn),
      });
    },
    []
  );

  const logout = useCallback(() => clearStorage(), [clearStorage]);

  const updateUser = useCallback((user: User) => {
    AuthService.updateUserData(user);
    setAuthState((prev) => ({ ...prev, user }));
  }, []);

  const refreshToken = useCallback(async () => {
    if (!authState.refreshToken) return logout();

    try {
      const newTokens = await AuthService.refreshAccessToken(authState.refreshToken);
      const newExpiresAt = AuthService.calculateTokenExpiration(newTokens.expires_in);

      AuthService.setAuthData(
        newTokens.access_token,
        newTokens.refresh_token || authState.refreshToken,
        authState.user,
        newTokens.expires_in
      );

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
  }, [authState.refreshToken, logout, authState.user]);

  useEffect(() => {
    const { accessToken, user, refreshToken, expiresAt } = AuthService.getAuthData();

    if (accessToken && user && refreshToken && expiresAt) {
      if (!AuthService.isTokenExpired(expiresAt)) {
        setAuthState({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
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
