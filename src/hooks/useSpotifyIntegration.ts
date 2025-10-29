import { useState, useEffect, useCallback } from 'react';
import { spotifyService } from '@/services/spotify.service';
import { useAuthStore } from '@/store/authStore';
import type { Artist, Playlist, User, Album, Track } from '@/types';

interface SpotifyIntegrationState {
  isConnected: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface SpotifyIntegrationActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshData: () => Promise<void>;
  fetchTopArtists: (limit?: number, offset?: number) => Promise<{ items: Artist[]; total: number; next: string | null }>;
  fetchUserPlaylists: (limit?: number, offset?: number) => Promise<{ items: Playlist[]; total: number; next: string | null }>;
  createPlaylist: (name: string, description?: string) => Promise<Playlist>;
  getPlaylist: (playlistId: string) => Promise<Playlist>;
  getArtist: (artistId: string) => Promise<Artist>;
  fetchArtistAlbums: (artistId: string, limit?: number, offset?: number) => Promise<{ items: Album[]; total: number; next: string | null }>;
  fetchArtistTopTracks: (artistId: string) => Promise<{ tracks: Track[] }>;
  fetchPlaylistTracks: (playlistId: string, limit?: number, offset?: number) => Promise<{ items: { track: Track }[]; total: number; next: string | null }>;
}

export function useSpotifyIntegration(): SpotifyIntegrationState & SpotifyIntegrationActions {
  const { logout: authLogout, isAuthenticated, user: authUser, accessToken } = useAuthStore();
  const [state, setState] = useState<SpotifyIntegrationState>({
    isConnected: isAuthenticated,
    user: authUser,
    loading: false,
    error: null
  });



  // Sincroniza com o estado do authStore
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isConnected: isAuthenticated,
      user: authUser
    }));
  }, [isAuthenticated, authUser]);

  // Verifica se já existe um token de acesso armazenado
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (accessToken && !authUser) {
        try {
          setState(prev => ({ ...prev, loading: true }));
          const user = await spotifyService.getUserProfile();
          setState(prev => ({
            ...prev,
            isConnected: true,
            user,
            loading: false,
            error: null
          }));
        } catch (error) {
          console.warn('Token inválido, fazendo logout:', error);
          authLogout();
          setState(prev => ({
            ...prev,
            isConnected: false,
            user: null,
            loading: false,
            error: null
          }));
        }
      }
    };

    checkExistingConnection();
  }, [accessToken, authUser, authLogout]);

  const connect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // TODO: Implementar fluxo de autenticação OAuth do Spotify
      // Por enquanto, simula uma conexão bem-sucedida
      console.log('Iniciando conexão com Spotify...');
      
      // Simula delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Busca dados do usuário
      const user = await spotifyService.getUserProfile();
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        user,
        loading: false,
        error: null
      }));
      
      console.log('Conectado ao Spotify com sucesso!');
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao conectar com Spotify'
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    // Faz logout no authStore (que automaticamente limpa o localStorage)
    authLogout();
    
    setState({
      isConnected: false,
      user: null,
      loading: false,
      error: null
    });
    
    console.log('Desconectado do Spotify');
  }, [authLogout]);

  const refreshData = useCallback(async () => {
    if (!state.isConnected) return;
    
    try {
      setState(prev => ({ ...prev, loading: true }));
      const user = await spotifyService.getUserProfile();
      setState(prev => ({
        ...prev,
        user,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar dados'
      }));
    }
  }, [state.isConnected]);

  const fetchTopArtists = useCallback(async (limit = 20, offset = 0): Promise<{ items: Artist[]; total: number; next: string | null }> => {
    try {
      return await spotifyService.getTopArtists(limit, offset);
    } catch (error) {
      console.warn('Erro ao buscar top artistas:', error);
      throw error;
    }
  }, []);

  const fetchUserPlaylists = useCallback(async (limit = 50, offset = 0): Promise<{ items: Playlist[]; total: number; next: string | null }> => {
    try {
      return await spotifyService.getUserPlaylists(limit, offset);
    } catch (error) {
      console.warn('Erro ao buscar playlists:', error);
      throw error;
    }
  }, []);

  const createPlaylist = useCallback(async (name: string, description?: string): Promise<Playlist> => {
    try {
      if (!authUser?.id) {
        throw new Error('Usuário não autenticado');
      }
      return await spotifyService.createPlaylist(authUser.id, name, description);
    } catch (error) {
      console.warn('Erro ao criar playlist:', error);
      throw error;
    }
  }, [authUser?.id]);

  const getPlaylist = useCallback(async (playlistId: string): Promise<Playlist> => {
    try {
      return await spotifyService.getPlaylist(playlistId);
    } catch (error) {
      console.warn('Erro ao buscar playlist:', error);
      throw error;
    }
  }, []);

  const getArtist = useCallback(async (artistId: string): Promise<Artist> => {
    try {
      return await spotifyService.getArtist(artistId);
    } catch (error) {
      console.warn('Erro ao buscar artista:', error);
      throw error;
    }
  }, []);

  const fetchArtistAlbums = useCallback(async (artistId: string, limit = 20, offset = 0): Promise<{ items: Album[]; total: number; next: string | null }> => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const data = await spotifyService.getArtistAlbums(artistId, limit, offset);
      return data;
    } catch (error) {
      console.error('Erro ao buscar álbuns do artista:', error);
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const fetchArtistTopTracks = useCallback(async (artistId: string): Promise<{ tracks: Track[] }> => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const data = await spotifyService.getArtistTopTracks(artistId);
      return data;
    } catch (error) {
      console.error('Erro ao buscar top tracks do artista:', error);
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const fetchPlaylistTracks = useCallback(async (playlistId: string, limit = 50, offset = 0): Promise<{ items: { track: Track }[]; total: number; next: string | null }> => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const data = await spotifyService.getPlaylistTracks(playlistId, limit, offset);
      return data;
    } catch (error) {
      console.error('Erro ao buscar tracks da playlist:', error);
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    refreshData,
    fetchTopArtists,
    fetchUserPlaylists,
    createPlaylist,
    getPlaylist,
    getArtist,
    fetchArtistAlbums,
    fetchArtistTopTracks,
    fetchPlaylistTracks
  };
}