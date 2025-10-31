import { useNavigate } from 'react-router-dom';
import { ContentPage, ArtistCard, SkipLink, MainContent } from '@/components';
import { useInfiniteTopArtists } from '@/hooks/useSpotifyQueries';
import { UI_TEXTS } from '@/constants/ui';
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

  const handleArtistClick = (artist: Artist) => {
    navigate(`/artists/${artist.id}`);
  };

  const handleRetry = () => {
    // Refetch data
    window.location.reload();
  };

  return (
    <>
      {/* Skip links for accessibility */}
      <SkipLink href="#artists-content">
        {UI_TEXTS.pularParaConteudoArtistas}
      </SkipLink>

      <MainContent id="artists-content">
        <ContentPage
          title={UI_TEXTS.artistas}
          description={UI_TEXTS.descubraArtistas}
          items={artists}
          loading={isLoading}
          error={isError ? error?.message || 'Erro ao carregar artistas' : null}
          emptyMessage="Nenhum artista encontrado"
          emptyDescription="Conecte-se ao Spotify para ver seus artistas favoritos"
          onRetry={handleRetry}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          loadingText={UI_TEXTS.carregandoMaisArtistas}
          gridClassName="grid grid-cols-2 gap-4 md:gap-6"
          renderItem={artist => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onClick={handleArtistClick}
              // Accessibility attributes
              aria-label={`Artista ${artist.name}. ${artist.followers ? `${artist.followers.total} seguidores.` : ''} ${artist.genres ? `Gêneros: ${artist.genres.slice(0, 2).join(', ')}.` : ''}`}
            />
          )}
        />
      </MainContent>
    </>
  );
}
