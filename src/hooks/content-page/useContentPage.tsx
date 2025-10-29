import { useCallback } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface UseContentPageProps {
  contentType: 'artists' | 'playlists' | 'albums' | 'tracks';
}

export function useContentPage({ contentType }: UseContentPageProps) {
  const isOnline = useOnlineStatus();

  const getErrorMessage = useCallback((_error: any) => {
    const customMessages = {
      artists: {
        offline: 'Você está offline. Verifique sua conexão para carregar artistas.',
        connectionError: 'Erro de conexão. Verifique sua internet e tente novamente.',
        notFound: 'Artistas não encontrados.',
        unauthorized: 'Sessão expirada. Faça login novamente.',
        default: 'Erro ao carregar artistas'
      },
      playlists: {
        offline: 'Você está offline. Verifique sua conexão para carregar playlists.',
        connectionError: 'Erro de conexão. Verifique sua internet e tente novamente.',
        notFound: 'Playlists não encontradas.',
        unauthorized: 'Sessão expirada. Faça login novamente.',
        default: 'Erro ao carregar playlists'
      },
      albums: {
        offline: 'Você está offline. Verifique sua conexão para carregar álbuns.',
        connectionError: 'Erro de conexão. Verifique sua internet e tente novamente.',
        notFound: 'Álbuns não encontrados.',
        unauthorized: 'Sessão expirada. Faça login novamente.',
        default: 'Erro ao carregar álbuns'
      },
      tracks: {
        offline: 'Você está offline. Verifique sua conexão para carregar músicas.',
        connectionError: 'Erro de conexão. Verifique sua internet e tente novamente.',
        notFound: 'Músicas não encontradas.',
        unauthorized: 'Sessão expirada. Faça login novamente.',
        default: 'Erro ao carregar músicas'
      }
    };

    return customMessages[contentType] || customMessages.tracks;
  }, [contentType]);

  const getEmptyState = useCallback(() => {
    const emptyStates = {
      artists: {
        message: 'Nenhum artista encontrado',
        description: 'Comece a ouvir música para ver seus artistas favoritos aqui!'
      },
      playlists: {
        message: 'Nenhuma playlist encontrada',
        description: 'Crie sua primeira playlist para começar a organizar suas músicas!'
      },
      albums: {
        message: 'Nenhum álbum encontrado',
        description: 'Explore álbuns para expandir sua biblioteca musical!'
      },
      tracks: {
        message: 'Nenhuma música encontrada',
        description: 'Adicione músicas para começar a construir sua coleção!'
      }
    };

    return emptyStates[contentType] || emptyStates.tracks;
  }, [contentType]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    isOnline,
    getErrorMessage,
    getEmptyState,
    handleRetry
  };
}