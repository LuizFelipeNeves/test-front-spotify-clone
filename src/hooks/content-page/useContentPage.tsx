import { useCallback } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface UseContentPageProps {
  contentType: 'artists' | 'playlists' | 'albums' | 'tracks';
}

const MESSAGES = {
  CONNECTION_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente.',
  SESSION_EXPIRED: 'Sessão expirada. Faça login novamente.',
  NOT_FOUND: {
    artists: 'Artistas não encontrados.',
    playlists: 'Playlists não encontradas.',
    albums: 'Álbuns não encontrados.',
    tracks: 'Músicas não encontradas.',
  },
  OFFLINE: {
    artists: 'Você está offline. Verifique sua conexão para carregar artistas.',
    playlists: 'Você está offline. Verifique sua conexão para carregar playlists.',
    albums: 'Você está offline. Verifique sua conexão para carregar álbuns.',
    tracks: 'Você está offline. Verifique sua conexão para carregar músicas.',
  },
  DEFAULT: {
    artists: 'Erro ao carregar artistas',
    playlists: 'Erro ao carregar playlists',
    albums: 'Erro ao carregar álbuns',
    tracks: 'Erro ao carregar músicas',
  }
};

const EMPTY_STATES = {
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

export function useContentPage({ contentType }: UseContentPageProps) {
  const isOnline = useOnlineStatus();

  const getErrorMessage = useCallback((_error: any) => {
    return {
      offline: MESSAGES.OFFLINE[contentType] ?? MESSAGES.OFFLINE.tracks,
      connectionError: MESSAGES.CONNECTION_ERROR,
      notFound: MESSAGES.NOT_FOUND[contentType] ?? MESSAGES.NOT_FOUND.tracks,
      unauthorized: MESSAGES.SESSION_EXPIRED,
      default: MESSAGES.DEFAULT[contentType] ?? MESSAGES.DEFAULT.tracks
    };
  }, [contentType]);

  const getEmptyState = useCallback(() => {
    return EMPTY_STATES[contentType] ?? EMPTY_STATES.tracks;
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
