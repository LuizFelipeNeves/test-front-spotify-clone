import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { ContentList } from '@/components/ContentList';
import { PlaylistCard } from '@/components/PlaylistCard';
import { CreatePlaylistModal } from '@/components/CreatePlaylistModal';
import { useSpotifyIntegration } from '@/hooks/useSpotifyIntegration';
import type { Playlist } from '@/types';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const { fetchUserPlaylists, createPlaylist } = useSpotifyIntegration();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError(null);
        setOffset(0);
        
        // Busca playlists do Spotify
        const response = await fetchUserPlaylists(20, 0);
        setPlaylists(response.items);
        setHasMore(response.next !== null);
        setOffset(20);
      } catch (err) {
        console.error('Erro ao buscar playlists do Spotify:', err);
        setError('Não foi possível carregar suas playlists. Verifique sua conexão com o Spotify.');
        setPlaylists([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [fetchUserPlaylists]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePlaylists();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, offset]);

  const handlePlaylistClick = (playlist: Playlist) => {
    // Abre a playlist no Spotify
    window.open(playlist.external_urls.spotify, '_blank');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const loadMorePlaylists = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const response = await fetchUserPlaylists(20, offset);
      setPlaylists(prev => [...prev, ...response.items]);
      setHasMore(response.next !== null);
      setOffset(prev => prev + 20);
    } catch (err) {
      console.error('Erro ao carregar mais playlists:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, offset, fetchUserPlaylists]);

  const handleCreatePlaylist = () => {
    setIsModalOpen(true);
  };

  const handleCreatePlaylistSubmit = async (name: string) => {
    try {
      setIsCreating(true);
      
      // Cria a playlist via API do Spotify
      const newPlaylist = await createPlaylist(name, '');
      
      // Adiciona a nova playlist ao início da lista
      setPlaylists(prev => [newPlaylist, ...prev]);
      
      // Fecha o modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar playlist:', error);
      setError('Não foi possível criar a playlist. Tente novamente.');
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
        loading={loading}
        error={error}
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
      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Carregando mais playlists...</span>
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