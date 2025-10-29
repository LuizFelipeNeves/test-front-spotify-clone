/**
 * Application constants
 */

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
