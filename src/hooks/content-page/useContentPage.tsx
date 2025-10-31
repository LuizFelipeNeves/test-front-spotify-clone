import { useCallback } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface UseContentPageProps {
  contentType: 'artists' | 'playlists' | 'albums' | 'tracks';
}

const EMPTY_STATES = {
  artists: {
    message: 'Nenhum artista encontrado',
    description: 'Comece a ouvir música para ver seus artistas favoritos aqui!',
  },
  playlists: {
    message: 'Nenhuma playlist encontrada',
    description:
      'Crie sua primeira playlist para começar a organizar suas músicas!',
  },
  albums: {
    message: 'Nenhum álbum encontrado',
    description: 'Explore álbuns para expandir sua biblioteca musical!',
  },
  tracks: {
    message: 'Nenhuma música encontrada',
    description: 'Adicione músicas para começar a construir sua coleção!',
  },
};

export function useContentPage({ contentType }: UseContentPageProps) {
  const isOnline = useOnlineStatus();

  const getEmptyState = useCallback(() => {
    return EMPTY_STATES[contentType] ?? EMPTY_STATES.tracks;
  }, [contentType]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    isOnline,
    getEmptyState,
    handleRetry,
  };
}
