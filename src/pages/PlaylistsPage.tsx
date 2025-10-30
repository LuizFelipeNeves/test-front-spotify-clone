import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PageContent } from '@/components/ui';
import { InfiniteScrollList } from '@/components';
import { CreateButton } from '@/components/ui';
import { FeaturePlaylistCard } from '@/components';
import { CreatePlaylistModal } from '@/components';
import { useSpotifyIntegration } from '@/hooks/useSpotifyIntegration';
import { useInfiniteUserPlaylists } from '@/hooks/useSpotifyQueries';
import { useContentPage } from '@/hooks/content-page';
import type { Playlist } from '@/types';

export default function PlaylistsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();
  const { createPlaylist } = useSpotifyIntegration();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUserPlaylists(50);

  // Flatten all pages into a single array of playlists
  const playlists = data?.pages.flatMap(page => page.items) ?? [];

  const { getEmptyState, handleRetry } = useContentPage({ contentType: 'playlists' });

  const handlePlaylistClick = (playlist: Playlist) => {
    window.open(playlist.external_urls.spotify, '_blank');
  };

  const handleCreatePlaylist = () => {
    setIsModalOpen(true);
  };

  const handleCreatePlaylistSubmit = async (name: string) => {
    try {
      setIsCreating(true);
      await createPlaylist(name, '');

      queryClient.invalidateQueries({
        queryKey: ['userPlaylists']
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar playlist:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const createPlaylistButton = (
    <CreateButton
      onClick={handleCreatePlaylist}
      text="Criar Playlist"
      title="Criar Playlist"
      ariaLabel="Criar nova playlist"
    />
  );

  return (
    <PageContent
      title="Minhas Playlists"
      description="Sua coleção pessoal de playlists"
      actionButton={createPlaylistButton}
    >
      <InfiniteScrollList
        items={playlists}
        loading={isLoading}
        error={isError ? error?.message || 'Erro ao carregar playlists' : null}
        emptyMessage={getEmptyState().message}
        emptyDescription={getEmptyState().description}
        onRetry={handleRetry}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        loadingText="Carregando mais playlists..."
        renderItem={(playlist: Playlist) => (
          <FeaturePlaylistCard
            key={playlist.id}
            playlist={playlist}
            onClick={handlePlaylistClick}
          />
        )}
      />

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePlaylist={handleCreatePlaylistSubmit}
        isCreating={isCreating}
      />
    </PageContent>
  );
}