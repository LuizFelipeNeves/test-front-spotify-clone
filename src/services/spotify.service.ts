import { apiClient } from './api';
import type { Artist, Playlist, User, Album } from '@/types';

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
  async getTopArtists(limit = 20, offset = 0): Promise<{ items: Artist[]; total: number; next: string | null }> {
    const response = await apiClient.get<{ items: Artist[]; total: number; next: string | null }>(
      `${this.baseURL}/me/top/artists?limit=${limit}&offset=${offset}`
    );
    return response.data;
  }

  /**
   * Get user playlists
   */
  async getUserPlaylists(limit = 50, offset = 0): Promise<{ items: Playlist[]; total: number; next: string | null }> {
    const response = await apiClient.get<{ items: Playlist[]; total: number; next: string | null }>(
      `${this.baseURL}/me/playlists?limit=${limit}&offset=${offset}`
    );
    return response.data;
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
   * Get artist's albums
   */
  async getArtistAlbums(artistId: string, limit = 20, offset = 0): Promise<{ items: Album[]; total: number; next: string | null }> {
    const response = await apiClient.get<{ items: Album[]; total: number; next: string | null }>(
      `${this.baseURL}/artists/${artistId}/albums?include_groups=album,single,compilation&market=BR&limit=${limit}&offset=${offset}`
    );
    
    // Sort albums by release date (newest first)
    const sortedItems = response.data.items.sort((a, b) => {
      const dateA = new Date(a.release_date);
      const dateB = new Date(b.release_date);
      return dateB.getTime() - dateA.getTime();
    });
    
    return {
      ...response.data,
      items: sortedItems
    };
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
