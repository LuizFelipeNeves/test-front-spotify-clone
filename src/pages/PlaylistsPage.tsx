import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { ContentList } from '@/components/ContentList';
import { PlaylistCard } from '@/components/PlaylistCard';
import { useSpotifyIntegration } from '@/hooks/useSpotifyIntegration';
import type { Playlist } from '@/types';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchUserPlaylists } = useSpotifyIntegration();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Busca playlists do Spotify
        const userPlaylists = await fetchUserPlaylists();
        setPlaylists(userPlaylists);
      } catch (err) {
        console.error('Erro ao buscar playlists do Spotify:', err);
        setError('Não foi possível carregar suas playlists. Verifique sua conexão com o Spotify.');
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [fetchUserPlaylists]);

  const handlePlaylistClick = (playlist: Playlist) => {
    // Abre a playlist no Spotify
    window.open(playlist.external_urls.spotify, '_blank');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleCreatePlaylist = () => {
    // TODO: Implementar modal de criação de playlist
    console.log('Criar nova playlist');
  };

  const createPlaylistButton = (
    <button
      onClick={handleCreatePlaylist}
      className="px-6 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 transition-colors flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
      Criar Playlist
    </button>
  );

  return (
    <Layout>
      <div className="p-12">
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
      </div>
    </Layout>
  );
}