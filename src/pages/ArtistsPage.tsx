import { useNavigate } from 'react-router-dom';
import { PageContent } from '@/components/ui';
import { InfiniteScrollList } from '@/components';
import { ArtistCard } from '@/components';
import { useInfiniteTopArtists } from '@/hooks/useSpotifyQueries';
import { useContentPage } from '@/hooks/content-page';
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

  const { getEmptyState, handleRetry } = useContentPage({ contentType: 'artists' });

  const handleArtistClick = (artist: Artist) => {
    navigate(`/artists/${artist.id}`);
  };

  return (
    <PageContent
      title={UI_TEXTS.artistas}
      description={UI_TEXTS.descubraArtistas}
    >
      <InfiniteScrollList
        items={artists}
        loading={isLoading}
        error={isError ? error?.message || 'Erro ao carregar artistas' : null}
        emptyMessage={getEmptyState().message}
        emptyDescription={getEmptyState().description}
        onRetry={handleRetry}
        gridClassName="grid grid-cols-2 gap-4 md:gap-6"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        loadingText={UI_TEXTS.carregandoMaisArtistas}
        renderItem={(artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onClick={handleArtistClick}
          />
        )}
      />
    </PageContent>
  );
}