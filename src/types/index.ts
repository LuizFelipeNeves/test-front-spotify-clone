/**
 * Global type definitions for the Spotify Clone application
 */

export interface User {
  id: string;
  display_name: string;
  email: string;
  images: Image[];
  followers: {
    total: number;
  };
  country: string;
  product: string;
}

export interface Artist {
  id: string;
  name: string;
  images: Image[];
  genres: string[];
  popularity: number;
  followers: {
    href: string | null;
    total: number;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  type: 'artist';
  uri: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: Image[];
  owner: {
    id: string;
    display_name: string;
  };
  tracks: {
    total: number;
    items: PlaylistTrack[];
  };
  public: boolean;
  collaborative: boolean;
  external_urls: {
    spotify: string;
  };
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface Album {
  id: string;
  name: string;
  images: Image[];
  artists: Artist[];
  release_date: string;
  total_tracks: number;
  album_type: 'album' | 'single' | 'compilation';
  external_urls: {
    spotify: string;
  };
  uri: string;
}

export interface PlaylistTrack {
  added_at: string;
  track: Track;
}

export interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'track' | 'context';
}

// API Response types
export interface SpotifyApiResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

// Component Props types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface PlaylistFormData {
  name: string;
  description: string;
  isPublic: boolean;
}

export type ApiError = {
  message: string;
  status: number;
  code?: string;
};

// End of global type definitions
