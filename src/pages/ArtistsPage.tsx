import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { WifiOff } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { ContentList } from '@/components/ContentList';
import { ArtistCard } from '@/components/ArtistCard';
import { useInfiniteTopArtists } from '@/hooks/useSpotifyQueries';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import type { Artist } from '@/types';

export default function ArtistsPage() {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTopArtists(20);

  // Flatten all pages into a single array of artists
  const artists = data?.pages.flatMap(page => page.items) ?? [];

  // Get error message based on online status and error type
  const getErrorMessage = () => {
    if (!isOnline) {
      return (
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5" />
          <span>Você está offline. Verifique sua conexão com a internet.</span>
        </div>
      );
    }

    if (error) {
      const errorData = error as any;
      const errorMessage = errorData?.message || 'Erro desconhecido';

      if (errorMessage.includes('Failed to fetch')) {
        return (
          <div className="flex items-center gap-2">
            <WifiOff className="w-5 h-5" />
            <span>Erro de conexão. Verifique sua internet e tente novamente.</span>
          </div>
        );
      }

      if (errorData?.status === 404) {
        return 'Artistas não encontrados.';
      }

      if (errorData?.status === 401) {
        return 'Sessão expirada. Faça login novamente.';
      }

      return `Erro ao carregar artistas: ${errorMessage}`;
    }

    return 'Erro ao carregar artistas';
  };

  // Infinite scroll with intersection observer
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleArtistClick = (artist: Artist) => {
    // Navega para a página de detalhes do artista
    navigate(`/artists/${artist.id}`);
  };

  const handleRetry = () => {
    // Recarrega a página para tentar novamente
    window.location.reload();
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <PageHeader
        title="Artistas"
        description="Descubra e explore seus artistas favoritos"
      />

      <ContentList
        items={artists}
        loading={isLoading}
        error={isError ? getErrorMessage() : null}
        emptyMessage="Nenhum artista encontrado"
        emptyDescription="Comece a ouvir música para ver seus artistas favoritos aqui!"
        onRetry={handleRetry}
        renderItem={(artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onClick={handleArtistClick}
          />
        )}
      />

      {/* Loading indicator for infinite scroll */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Carregando mais artistas...</span>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
          <span className="text-gray-500 text-sm">Carregando mais...</span>
        </div>
      )}
    </div>
  );
}