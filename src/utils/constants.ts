/**
 * Application constants
 */

// Spotify API
export const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
export const SPOTIFY_ACCOUNTS_BASE_URL = 'https://accounts.spotify.com';

// OAuth
export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-follow-read',
  'user-follow-modify',
  'user-library-read',
  'user-library-modify',
  'streaming',
].join(' ');

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'spotify_access_token',
  REFRESH_TOKEN: 'spotify_refresh_token',
  USER_DATA: 'spotify_user_data',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  PLAYER_VOLUME: 'player_volume',
  PLAYER_REPEAT: 'player_repeat',
  PLAYER_SHUFFLE: 'player_shuffle',
} as const;

// API Limits
export const API_LIMITS = {
  PLAYLISTS: 50,
  TRACKS: 50,
  ARTISTS: 50,
  ALBUMS: 50,
  SEARCH_RESULTS: 20,
} as const;

// Player
export const PLAYER_CONSTANTS = {
  DEFAULT_VOLUME: 0.5,
  MIN_VOLUME: 0,
  MAX_VOLUME: 1,
  SEEK_STEP: 10, // seconds
  PREVIEW_DURATION: 30, // seconds
} as const;

// UI
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 240,
  HEADER_HEIGHT: 64,
  PLAYER_HEIGHT: 80,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
} as const;

// Colors
export const COLORS = {
  SPOTIFY_GREEN: '#1DB954',
  SPOTIFY_GREEN_HOVER: '#1ED760',
  SPOTIFY_BLACK: '#191414',
  SPOTIFY_DARK_GRAY: '#121212',
  SPOTIFY_GRAY: '#535353',
  SPOTIFY_LIGHT_GRAY: '#B3B3B3',
  SPOTIFY_WHITE: '#FFFFFF',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ARTISTS: '/artists',
  ARTIST_DETAIL: '/artists/:id',
  PLAYLISTS: '/playlists',
  PLAYLIST_DETAIL: '/playlists/:id',
  PROFILE: '/profile',
  SEARCH: '/search',
  LIBRARY: '/library',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  NOT_FOUND: 'Conteúdo não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor.',
  INVALID_CREDENTIALS: 'Credenciais inválidas.',
  RATE_LIMIT: 'Muitas tentativas. Tente novamente em alguns minutos.',
  GENERIC_ERROR: 'Algo deu errado. Tente novamente.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  PLAYLIST_CREATED: 'Playlist criada com sucesso!',
  PLAYLIST_UPDATED: 'Playlist atualizada com sucesso!',
  PLAYLIST_DELETED: 'Playlist excluída com sucesso!',
  TRACK_ADDED: 'Música adicionada à playlist!',
  TRACK_REMOVED: 'Música removida da playlist!',
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SPOTIFY_ID: /^[a-zA-Z0-9]{22}$/,
  SPOTIFY_URL:
    /^https:\/\/open\.spotify\.com\/(track|album|artist|playlist)\/([a-zA-Z0-9]{22})(\?.*)?$/,
} as const;
