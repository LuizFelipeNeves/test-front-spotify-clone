import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { ContentList } from '@/components/ContentList';
import { ArtistCard } from '@/components/ArtistCard';
import { useInfiniteTopArtists } from '@/hooks/useSpotifyQueries';
import type { Artist } from '@/types';

export default function ArtistsPage() {
  const navigate = useNavigate();
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

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        hasNextPage &&
        !isFetchingNextPage &&
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 1000
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        title="Top Artistas" 
        description="Aqui você encontra seus artistas preferidos"
      />

      <ContentList
        items={artists}
        loading={isLoading}
        error={isError ? error?.message || 'Erro ao carregar artistas' : null}
        emptyMessage="Nenhum artista encontrado"
        emptyDescription="Comece a ouvir música para ver seus artistas favoritos aqui!"
        loadingMessage="Carregando artistas..."
        onRetry={handleRetry}
        footerMessage={`Mostrando ${artists.length} artistas baseados no seu histórico de reprodução`}
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
    </div>
  );
}