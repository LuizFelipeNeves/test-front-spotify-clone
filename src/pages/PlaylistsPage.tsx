import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { PageHeader } from '@/components/PageHeader';
import { ContentList } from '@/components/ContentList';
import { PlaylistCard } from '@/components/PlaylistCard';
import { CreatePlaylistModal } from '@/components/CreatePlaylistModal';
import { useSpotifyIntegration } from '@/hooks/useSpotifyIntegration';
import { useInfiniteUserPlaylists, spotifyQueryKeys } from '@/hooks/useSpotifyQueries';
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

  const handlePlaylistClick = (playlist: Playlist) => {
    // Abre a playlist no Spotify
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
      
      // Cria a playlist via API do Spotify
      const newPlaylist = await createPlaylist(name, '');
      
      // Invalida o cache para recarregar as playlists
      queryClient.invalidateQueries({
        queryKey: ['userPlaylists']
      });
      
      // Fecha o modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar playlist:', error);
      // Aqui poderia usar um toast ou outro método de notificação
    } finally {
      setIsCreating(false);
    }
  };

  const createPlaylistButton = (
    <button
      onClick={handleCreatePlaylist}
      className="px-3 sm:px-6 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 focus:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors flex items-center gap-2"
      title="Criar Playlist"
      aria-label="Criar nova playlist"
    >
      <svg 
        className="w-5 h-5" 
        fill="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
      <span className="hidden sm:inline">Criar Playlist</span>
    </button>
  );

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <PageHeader
        title="Minhas Playlists"
        description="Sua coleção pessoal de playlists"
        actionButton={createPlaylistButton}
      />

      <ContentList
        items={playlists}
        loading={isLoading}
        error={isError ? error?.message || 'Erro ao carregar playlists' : null}
        emptyMessage="Nenhuma playlist encontrada"
        emptyDescription="Crie sua primeira playlist para começar a organizar suas músicas!"
        loadingMessage="Carregando playlists..."
        onRetry={handleRetry}
        footerMessage={`${playlists.length} playlist${playlists.length !== 1 ? 's' : ''} na sua biblioteca`}
        renderItem={(playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onClick={handlePlaylistClick}
          />
        )}
      />

      {/* Loading indicator for infinite scroll */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Carregando mais playlists...</span>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
          <span className="text-gray-500 text-sm">Carregando mais...</span>
        </div>
      )}

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePlaylist={handleCreatePlaylistSubmit}
        isCreating={isCreating}
      />
    </div>
  );
}