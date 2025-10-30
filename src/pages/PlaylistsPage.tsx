import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ContentPage, CreateButton, FeaturePlaylistCard, CreatePlaylistModal, SkipLink, MainContent } from '@/components';
import { useSpotifyIntegration } from '@/hooks/useSpotifyIntegration';
import { useInfiniteUserPlaylists } from '@/hooks/useSpotifyQueries';
import { UI_TEXTS } from '@/constants/ui';
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

  const handlePlaylistClick = (playlist: Playlist) => {
    window.open(playlist.external_urls.spotify, '_blank');
  };

  const handleRetry = () => {
    window.location.reload();
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
    <>
      <SkipLink href="#playlists-content">
        {UI_TEXTS.pularParaConteudoPlaylists}
      </SkipLink>

      <MainContent id="playlists-content">
        <ContentPage
        title={UI_TEXTS.minhasPlaylists}
        description={UI_TEXTS.colecaoPlaylists}
        items={playlists}
        loading={isLoading}
        error={isError ? error?.message || 'Erro ao carregar playlists' : null}
        emptyMessage="Nenhuma playlist encontrada"
        emptyDescription="Crie sua primeira playlist para começar a organizar suas músicas"
        onRetry={handleRetry}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        loadingText={UI_TEXTS.carregandoMaisPlaylists}
        gridClassName="grid grid-cols-2 gap-4 md:gap-6"
        renderItem={(playlist: Playlist) => (
          <FeaturePlaylistCard
            key={playlist.id}
            playlist={playlist}
            onClick={handlePlaylistClick}
          />
        )}
      />

      {/* Create button shown when there are no playlists */}
      {!isLoading && !isError && playlists.length === 0 && (
        <div className="text-center mt-8">
          {createPlaylistButton}
        </div>
          )}
      </MainContent>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePlaylist={handleCreatePlaylistSubmit}
        isCreating={isCreating}
      />
    </>
  );
}