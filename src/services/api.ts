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

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      // Se o token expirou (401), tenta renovar automaticamente
      if (response.status === 401) {
        const { refreshToken } = useAuthStore.getState();
        if (refreshToken) {
          try {
            const { AuthService } = await import('./auth.service');
            const newTokenData = await AuthService.refreshAccessToken(refreshToken);

            // Atualiza o token no store
            const { setTokens } = useAuthStore.getState();
            setTokens(newTokenData.access_token, newTokenData.refresh_token);

            // Não tenta refazer a requisição aqui, deixa para o chamador tentar novamente
            const error: ApiError = {
              message: 'Token refreshed, please retry the request',
              status: 401,
              code: 'TOKEN_REFRESHED',
            };
            throw error;
          } catch (refreshError) {
            console.warn('Falha ao renovar token:', refreshError);
            // Só faz logout se não for erro de rede
            const errorMessage = refreshError instanceof Error ? refreshError.message : String(refreshError);
            if (!errorMessage.includes('Failed to fetch') && navigator.onLine) {
              const { logout } = useAuthStore.getState();
              logout();
            }
          }
        } else {
          // Se não tem refresh token, só faz logout se estiver online
          if (navigator.onLine) {
            const { logout } = useAuthStore.getState();
            logout();
          }
        }
      }

      const error: ApiError = {
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      };
      throw error;
    }

    // Handle 204 No Content responses (common for successful DELETE/PUT operations)
    if (response.status === 204) {
      console.log('📄 API Response: 204 No Content - treating as success');
      return {
        data: null as T,
        status: response.status,
      };
    }

    // Check if response has content before trying to parse JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('📄 API Response: Non-JSON response, treating as success');
      return {
        data: null as T,
        status: response.status,
      };
    }

    // Only parse JSON if we're confident it's JSON
    try {
      const data = await response.json();
      console.log('📄 API Response: JSON parsed successfully');
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.warn('📄 API Response: Failed to parse JSON, treating as success:', error);
      return {
        data: null as T,
        status: response.status,
      };
    }
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
