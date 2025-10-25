import { useState, useEffect, useCallback } from 'react';
import { spotifyService } from '@/services/spotify.service';
import { useAuthStore } from '@/store/authStore';
import type { User, Artist, Playlist } from '@/types';

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
  fetchTopArtists: () => Promise<Artist[]>;
  fetchUserPlaylists: () => Promise<Playlist[]>;
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

  const fetchTopArtists = useCallback(async (): Promise<Artist[]> => {
    try {
      return await spotifyService.getTopArtists();
    } catch (error) {
      console.warn('Erro ao buscar top artistas:', error);
      throw error;
    }
  }, []);

  const fetchUserPlaylists = useCallback(async (): Promise<Playlist[]> => {
    try {
      return await spotifyService.getUserPlaylists();
    } catch (error) {
      console.warn('Erro ao buscar playlists:', error);
      throw error;
    }
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    refreshData,
    fetchTopArtists,
    fetchUserPlaylists
  };
}