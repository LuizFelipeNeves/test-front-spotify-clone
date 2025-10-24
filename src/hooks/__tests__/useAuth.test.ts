import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { mockUser, mockLocalStorage } from '../../test/utils';

describe('useAuth', () => {
  beforeEach(() => {
    mockLocalStorage();
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle login process', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('access_token', 'refresh_token', mockUser);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe('access_token');
    expect(result.current.refreshToken).toBe('refresh_token');
  });

  it('should handle logout process', () => {
    const { result } = renderHook(() => useAuth());

    // First login
    act(() => {
      result.current.login('access_token', 'refresh_token', mockUser);
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
  });

  it('should handle user update', () => {
    const { result } = renderHook(() => useAuth());
    const updatedUser = { ...mockUser, display_name: 'Updated Name' };

    // First login
    act(() => {
      result.current.login('access_token', 'refresh_token', mockUser);
    });

    // Then update user
    act(() => {
      result.current.updateUser(updatedUser);
    });

    expect(result.current.user).toEqual(updatedUser);
  });

  it('should provide authentication methods', () => {
    const { result } = renderHook(() => useAuth());

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.updateUser).toBe('function');
  });
});
