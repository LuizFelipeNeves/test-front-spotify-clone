import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { ContentList } from '@/components/ContentList';
import { ArtistCard } from '@/components/ArtistCard';
import { useSpotifyIntegration } from '@/hooks/useSpotifyIntegration';
import type { Artist } from '@/types';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchTopArtists } = useSpotifyIntegration();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Busca artistas do Spotify
        const topArtists = await fetchTopArtists();
        setArtists(topArtists);
      } catch (err) {
        console.error('Erro ao buscar artistas do Spotify:', err);
        setError('Não foi possível carregar seus artistas. Verifique sua conexão com o Spotify.');
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [fetchTopArtists]);

  const handleArtistClick = (artist: Artist) => {
    // Aqui você pode implementar navegação para página do artista
    // ou abrir o Spotify
    console.log('Artista clicado:', artist);
    
    // Abre o Spotify se disponível
    if (artist.external_urls?.spotify) {
      window.open(artist.external_urls.spotify, '_blank');
    }
  };

  const handleRetry = () => {
    setError(null);
    // Recarrega a página para tentar novamente
    window.location.reload();
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <PageHeader 
        title="Artistas" 
        description="Aqui você encontra seus artistas preferidos ordenados por suas preferências"
      />

      <ContentList
        items={artists}
        loading={loading}
        error={error}
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
    </div>
  );
}