const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:5174/callback';

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface SpotifyUserData {
  id: string;
  display_name: string;
  email: string;
  country: string;
  product: string;
  images: Array<{ url: string; height: number | null; width: number | null }>;
  followers: {
    total: number;
    href?: string | null;
  };
}

export class AuthService {
  private static readonly SPOTIFY_SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read',
    'user-library-modify',
    'streaming',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played'
  ];

  /**
   * Detecta se estamos em ambiente de teste (Cypress)
   */
  private static isTestEnvironment(): boolean {
    return (
      typeof window !== 'undefined' &&
      (window as unknown as { Cypress?: unknown }).Cypress !== undefined
    ) ||
    (typeof navigator !== 'undefined' &&
     navigator.userAgent.includes('Cypress'));
  }

  /**
   * Gera a URL de autorização do Spotify
   * Em ambiente de teste, redireciona diretamente para callback com mock
   */
  static generateSpotifyAuthUrl(): string {
    // Em ambiente de teste, redirecionar diretamente para callback com código mock
    if (this.isTestEnvironment()) {
      const baseUrl = window.location.origin;
      return `${baseUrl}/callback?code=mock_auth_code&state=mock_state`;
    }

    const scopes = this.SPOTIFY_SCOPES.join(' ');
    
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', SPOTIFY_REDIRECT_URI);
    authUrl.searchParams.append('scope', scopes);
    authUrl.searchParams.append('show_dialog', 'true');

    return authUrl.toString();
  }

  /**
   * Redireciona para a página de autorização do Spotify
   */
  static redirectToSpotifyAuth(): void {
    const authUrl = this.generateSpotifyAuthUrl();
    window.location.href = authUrl;
  }

  /**
   * Troca o código de autorização por tokens de acesso
   * Em ambiente de teste, retorna dados mock
   */
  static async exchangeCodeForTokens(code: string): Promise<SpotifyTokenResponse> {
    // Em ambiente de teste, retornar dados mock
    if (this.isTestEnvironment() && code === 'mock_auth_code') {
      return {
        access_token: 'mock_access_token',
        token_type: 'Bearer',
        scope: this.SPOTIFY_SCOPES.join(' '),
        expires_in: 3600,
        refresh_token: 'mock_refresh_token'
      };
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao trocar código por tokens: ${error.error_description || error.error}`);
    }

    return response.json();
  }

  /**
   * Atualiza o token de acesso usando o refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<SpotifyTokenResponse> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao atualizar token: ${error.error_description || error.error}`);
    }

    return response.json();
  }

  /**
   * Verifica se o token está expirado
   */
  static isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt;
  }

  /**
   * Calcula o timestamp de expiração do token
   */
  static calculateTokenExpiration(expiresIn: number): number {
    return Date.now() + (expiresIn * 1000);
  }

  private static readonly STORAGE_KEYS = {
    ACCESS_TOKEN: 'spotify_access_token',
    REFRESH_TOKEN: 'spotify_refresh_token',
    USER: 'spotify_user',
    EXPIRES_AT: 'spotify_expires_at',
  };

  static setAuthData(
    accessToken: string,
    refreshToken: string,
    user: SpotifyUserData,
    expiresIn: number
  ): void {
    const expiresAt = AuthService.calculateTokenExpiration(expiresIn);

    localStorage.setItem(AuthService.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(AuthService.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(AuthService.STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(AuthService.STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
  }

  static getAuthData(): {
    accessToken: string | null;
    refreshToken: string | null;
    user: SpotifyUserData | null;
    expiresAt: number | null;
  } {
    const accessToken = localStorage.getItem(AuthService.STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(AuthService.STORAGE_KEYS.REFRESH_TOKEN);
    const user = localStorage.getItem(AuthService.STORAGE_KEYS.USER);
    const expiresAt = localStorage.getItem(AuthService.STORAGE_KEYS.EXPIRES_AT);

    return {
      accessToken,
      refreshToken,
      user: user ? JSON.parse(user) : null,
      expiresAt: expiresAt ? Number(expiresAt) : null,
    };
  }

  static clearAuthData(): void {
    Object.values(AuthService.STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }

  static updateUserData(user: SpotifyUserData): void {
    localStorage.setItem(AuthService.STORAGE_KEYS.USER, JSON.stringify(user));
  }
}