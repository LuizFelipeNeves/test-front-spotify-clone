import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      login: (accessToken, refreshToken, user) => {
        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      updateUser: user => {
        set({ user });
      },

      setTokens: (accessToken, refreshToken) => {
        set(state => ({
          accessToken,
          refreshToken: refreshToken || state.refreshToken,
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
