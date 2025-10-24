import { apiClient } from './api';
import type { Artist, Playlist, User } from '@/types';

/**
 * Spotify API service
 */
class SpotifyService {
  private readonly baseURL = 'https://api.spotify.com/v1';

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<User> {
    const response = await apiClient.get<User>(`${this.baseURL}/me`);
    return response.data;
  }

  /**
   * Get user's top artists
   */
  async getTopArtists(limit = 20): Promise<Artist[]> {
    const response = await apiClient.get<{ items: Artist[] }>(
      `${this.baseURL}/me/top/artists?limit=${limit}`
    );
    return response.data.items;
  }

  /**
   * Get user's playlists
   */
  async getUserPlaylists(limit = 50): Promise<Playlist[]> {
    const response = await apiClient.get<{ items: Playlist[] }>(
      `${this.baseURL}/me/playlists?limit=${limit}`
    );
    return response.data.items;
  }

  /**
   * Get artist details
   */
  async getArtist(artistId: string): Promise<Artist> {
    const response = await apiClient.get<Artist>(
      `${this.baseURL}/artists/${artistId}`
    );
    return response.data;
  }

  /**
   * Get playlist details
   */
  async getPlaylist(playlistId: string): Promise<Playlist> {
    const response = await apiClient.get<Playlist>(
      `${this.baseURL}/playlists/${playlistId}`
    );
    return response.data;
  }

  /**
   * Create a new playlist
   */
  async createPlaylist(
    userId: string,
    name: string,
    description?: string
  ): Promise<Playlist> {
    const response = await apiClient.post<Playlist>(
      `${this.baseURL}/users/${userId}/playlists`,
      {
        name,
        description,
        public: false,
      }
    );
    return response.data;
  }
}

export const spotifyService = new SpotifyService();
