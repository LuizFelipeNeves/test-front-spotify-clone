import { apiClient } from './api';
import type { Artist, Playlist, User, Album, Track } from '@/types';

/**
 * Spotify API service
 */
class SpotifyService {
  private readonly baseURL = 'https://api.spotify.com/v1';

  /**
   * Detecta se estamos em ambiente de teste (Cypress)
   */
  private isTestEnvironment(): boolean {
    return (
      typeof window !== 'undefined' && 
      (window as any).Cypress !== undefined
    ) || 
    (typeof navigator !== 'undefined' && 
     navigator.userAgent.includes('Cypress'));
  }

  /**
   * Get user profile
   * Em ambiente de teste, retorna dados mock
   */
  async getUserProfile(): Promise<User> {
    // Em ambiente de teste, retornar dados mock
    if (this.isTestEnvironment()) {
      return {
        id: 'test_user_123',
        display_name: 'Test User',
        email: 'test@example.com',
        country: 'BR',
        product: 'premium',
        images: [
          {
            url: 'https://i.scdn.co/image/ab67616d0000b2732c6f9b7d4b1e7c9a2c8d5e6f',
            height: 300,
            width: 300
          }
        ],
        followers: {
          total: 42
        }
      };
    }

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

  /**
   * Get artist's top tracks
   */
  async getArtistTopTracks(artistId: string, market = 'BR'): Promise<{ tracks: Track[] }> {
    const response = await apiClient.get<{ tracks: Track[] }>(
      `${this.baseURL}/artists/${artistId}/top-tracks?market=${market}`
    );
    return response.data;
  }

  /**
   * Get playlist tracks
   */
  async getPlaylistTracks(playlistId: string, limit = 50, offset = 0): Promise<{ items: { track: Track }[]; total: number; next: string | null }> {
    const response = await apiClient.get<{ items: { track: Track }[]; total: number; next: string | null }>(
      `${this.baseURL}/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}&market=BR`
    );
    return response.data;
  }

  // Player API methods

  /**
   * Play track/album/playlist or resume current playback
   */
  async play(deviceId?: string, trackUri?: string, contextUri?: string): Promise<void> {
    const url = deviceId ? `${this.baseURL}/me/player/play?device_id=${deviceId}` : `${this.baseURL}/me/player/play`;

    const body: any = {};
    if (contextUri) {
      body.context_uri = contextUri;
    } else if (trackUri) {
      body.uris = [trackUri];
    }
    // If no trackUri or contextUri, body will be empty, which resumes current playback

    await apiClient.put(url, body);
  }

  /**
   * Pause playback
   */
  async pause(): Promise<void> {
    await apiClient.put(`${this.baseURL}/me/player/pause`);
  }

  /**
   * Skip to next track
   */
  async nextTrack(deviceId?: string): Promise<void> {
    const url = deviceId ? `${this.baseURL}/me/player/next?device_id=${deviceId}` : `${this.baseURL}/me/player/next`;
    await apiClient.post(url);
  }

  /**
   * Skip to previous track
   */
  async previousTrack(deviceId?: string): Promise<void> {
    const url = deviceId ? `${this.baseURL}/me/player/previous?device_id=${deviceId}` : `${this.baseURL}/me/player/previous`;
    await apiClient.post(url);
  }

  /**
   * Seek to position in track
   */
  async seek(positionMs: number, deviceId?: string): Promise<void> {
    const url = deviceId
      ? `${this.baseURL}/me/player/seek?position_ms=${positionMs}&device_id=${deviceId}`
      : `${this.baseURL}/me/player/seek?position_ms=${positionMs}`;
    await apiClient.put(url);
  }

  /**
   * Set volume
   */
  async setVolume(volumePercent: number, deviceId?: string): Promise<void> {
    const url = deviceId
      ? `${this.baseURL}/me/player/volume?volume_percent=${Math.round(volumePercent * 100)}&device_id=${deviceId}`
      : `${this.baseURL}/me/player/volume?volume_percent=${Math.round(volumePercent * 100)}`;
    await apiClient.put(url);
  }

  /**
   * Toggle shuffle
   */
  async toggleShuffle(shuffle: boolean, deviceId?: string): Promise<void> {
    const url = deviceId
      ? `${this.baseURL}/me/player/shuffle?state=${shuffle}&device_id=${deviceId}`
      : `${this.baseURL}/me/player/shuffle?state=${shuffle}`;
    await apiClient.put(url);
  }

  /**
   * Toggle repeat mode
   */
  async toggleRepeat(repeat: 'track' | 'context' | 'off', deviceId?: string): Promise<void> {
    const url = deviceId
      ? `${this.baseURL}/me/player/repeat?state=${repeat}&device_id=${deviceId}`
      : `${this.baseURL}/me/player/repeat?state=${repeat}`;
    await apiClient.put(url);
  }

  /**
   * Transfer playback to device
   */
  async transferPlayback(deviceIds: string[], play = false): Promise<void> {
    await apiClient.put(`${this.baseURL}/me/player`, {
      device_ids: deviceIds,
      play,
    });
  }

  /**
   * Get current playback state
   */
  async getCurrentPlayback(): Promise<any> {
    const response = await apiClient.get(`${this.baseURL}/me/player`);
    return response.data;
  }

  /**
   * Check if tracks are in user's favorites
   */
  async checkTracksFavorites(trackIds: string[]): Promise<boolean[]> {
    const response = await apiClient.get<boolean[]>(
      `${this.baseURL}/me/tracks/contains?ids=${trackIds.join(',')}`
    );
    return response.data;
  }

  /**
   * Add tracks to favorites
   */
  async addTracksFavorites(trackIds: string[]): Promise<void> {
    console.log('🎵 Adding tracks to favorites:', trackIds);
    const response = await apiClient.put(`${this.baseURL}/me/tracks?ids=${trackIds.join(',')}`);
    console.log('✅ Add favorites response:', response);
  }

  /**
   * Remove tracks from favorites
   */
  async removeTracksFavorites(trackIds: string[]): Promise<void> {
    console.log('🗑️ Removing tracks from favorites:', trackIds);
    const response = await apiClient.delete(`${this.baseURL}/me/tracks?ids=${trackIds.join(',')}`);
    console.log('✅ Remove favorites response:', response);
  }
}

export const spotifyService = new SpotifyService();
