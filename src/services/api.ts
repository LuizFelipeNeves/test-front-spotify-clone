/**
 * API wrapper for fetch with error handling
 */

import { useAuthStore } from '@/store/authStore';
import type { ApiError } from '@/types';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const { accessToken } = useAuthStore.getState();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }

  private async handleUnauthorizedResponse(): Promise<ApiError> {
    const { refreshToken } = useAuthStore.getState();

    if (!refreshToken) {
      this.performLogoutIfNeeded();
      return {
        message: 'No refresh token available',
        status: 401,
      };
    }

    try {
      return await this.handleTokenRefresh();
    } catch (refreshError) {
      this.handleRefreshError(refreshError);
      return {
        message: 'Token refresh failed',
        status: 401,
      };
    }
  }

  private async handleTokenRefresh(): Promise<ApiError> {
    const { refreshToken, setTokens } = useAuthStore.getState();

    const { AuthService } = await import('./auth.service');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const newTokenData = await AuthService.refreshAccessToken(refreshToken);

    setTokens(
      newTokenData.access_token,
      newTokenData.refresh_token || refreshToken || undefined
    );

    return {
      message: 'Token refreshed, please retry the request',
      status: 401,
      code: 'TOKEN_REFRESHED',
    };
  }

  private handleRefreshError(refreshError: unknown): void {
    console.warn('Falha ao renovar token:', refreshError);

    if (!this.isNetworkError(refreshError) && navigator.onLine) {
      this.performLogoutIfNeeded();
    }
  }

  private isNetworkError(error: unknown): boolean {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorMessage.includes('Failed to fetch');
  }

  private performLogoutIfNeeded(): void {
    if (navigator.onLine) {
      const { logout } = useAuthStore.getState();
      logout();
    }
  }

  private createSuccessResponse<T>(data: T, status: number): ApiResponse<T> {
    return {
      data,
      status,
    };
  }

  private async parseJsonResponse<T>(
    response: Response
  ): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      return this.createSuccessResponse(data, response.status);
    } catch (error) {
      return this.createSuccessResponse(null as T, response.status);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      if (response.status === 401) {
        const error = await this.handleUnauthorizedResponse();
        throw error;
      }

      const error: ApiError = {
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      };
      throw error;
    }

    if (response.status === 204) {
      console.log('📄 API Response: 204 No Content - treating as success');
      return this.createSuccessResponse(null as T, response.status);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('📄 API Response: Non-JSON response, treating as success');
      return this.createSuccessResponse(null as T, response.status);
    }

    return this.parseJsonResponse<T>(response);
  }

  async get<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient('');
