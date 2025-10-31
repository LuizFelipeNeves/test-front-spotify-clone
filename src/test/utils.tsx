import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { TestProviders } from './TestProviders';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestProviders, ...options });

export { customRender as render };

// Mock data generators
export const mockUser = {
  id: 'test-user-id',
  display_name: 'Test User',
  email: 'test@example.com',
  images: [{ url: 'https://example.com/avatar.jpg', height: 64, width: 64 }],
  followers: { total: 100 },
  country: 'US',
  product: 'premium' as const,
};

export const mockArtist = {
  id: 'test-artist-id',
  name: 'Test Artist',
  images: [{ url: 'https://example.com/artist.jpg', height: 640, width: 640 }],
  genres: ['pop', 'rock'],
  followers: { total: 1000000 },
  popularity: 85,
  external_urls: { spotify: 'https://open.spotify.com/artist/test' },
  uri: 'spotify:artist:test',
  href: 'https://api.spotify.com/v1/artists/test',
  type: 'artist' as const,
};

export const mockTrack = {
  id: 'test-track-id',
  name: 'Test Track',
  artists: [mockArtist],
  album: {
    id: 'test-album-id',
    name: 'Test Album',
    images: [{ url: 'https://example.com/album.jpg', height: 640, width: 640 }],
    release_date: '2023-01-01',
    total_tracks: 10,
    type: 'album' as const,
    uri: 'spotify:album:test',
    href: 'https://api.spotify.com/v1/albums/test',
    external_urls: { spotify: 'https://open.spotify.com/album/test' },
    album_type: 'album' as const,
    available_markets: ['US'],
    artists: [mockArtist],
  },
  duration_ms: 180000,
  explicit: false,
  external_urls: { spotify: 'https://open.spotify.com/track/test' },
  href: 'https://api.spotify.com/v1/tracks/test',
  is_local: false,
  popularity: 75,
  preview_url: 'https://example.com/preview.mp3',
  track_number: 1,
  type: 'track' as const,
  uri: 'spotify:track:test',
  is_playable: true,
  available_markets: ['US'],
  disc_number: 1,
  external_ids: { isrc: 'TEST123456789' },
};

export const mockPlaylist = {
  id: 'test-playlist-id',
  name: 'Test Playlist',
  description: 'A test playlist',
  images: [
    { url: 'https://example.com/playlist.jpg', height: 640, width: 640 },
  ],
  owner: mockUser,
  public: true,
  collaborative: false,
  followers: { total: 50 },
  tracks: {
    total: 25,
    items: [
      {
        added_at: '2023-01-01T00:00:00Z',
        added_by: mockUser,
        is_local: false,
        track: mockTrack,
      },
    ],
    href: 'https://api.spotify.com/v1/playlists/test/tracks',
    limit: 100,
    next: null,
    offset: 0,
    previous: null,
  },
  external_urls: { spotify: 'https://open.spotify.com/playlist/test' },
  href: 'https://api.spotify.com/v1/playlists/test',
  snapshot_id: 'test-snapshot',
  type: 'playlist' as const,
  uri: 'spotify:playlist:test',
  primary_color: null,
};

// Test helpers
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));

export const mockFetch = (data: unknown, ok = true) => {
  globalThis.fetch = vi
    .fn()
    .mockResolvedValue({
      ok,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
      status: ok ? 200 : 400,
      statusText: ok ? 'OK' : 'Bad Request',
    });
};

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  globalThis.localStorage = {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: 0,
    key: vi.fn(),
  };

  return store;
};
