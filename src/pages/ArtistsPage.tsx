import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { ArtistCard } from '@/components/ArtistCard';
import { spotifyService } from '@/services/spotify.service';
import type { Artist } from '@/types';

export function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Busca os top artistas do usuário
        const topArtists = await spotifyService.getTopArtists(20);
        setArtists(topArtists);
      } catch (err) {
        console.error('Erro ao buscar artistas:', err);
        setError('Não foi possível carregar os artistas. Tente novamente.');
        
        // Fallback para dados mockados em caso de erro
        setArtists([
          {
            id: '1',
            name: 'Black Alien',
            images: [{ url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop', height: 200, width: 200 }],
            genres: ['Hip Hop', 'Rap'],
            popularity: 75,
            followers: { total: 150000 },
            external_urls: { spotify: '' }
          },
          {
            id: '2',
            name: 'Iguinho e Lulinha',
            images: [{ url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop', height: 200, width: 200 }],
            genres: ['Forró', 'Piseiro'],
            popularity: 80,
            followers: { total: 300000 },
            external_urls: { spotify: '' }
          },
          {
            id: '3',
            name: 'O Rappa',
            images: [{ url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&h=200&fit=crop', height: 200, width: 200 }],
            genres: ['Rock', 'Reggae'],
            popularity: 70,
            followers: { total: 500000 },
            external_urls: { spotify: '' }
          },
          {
            id: '4',
            name: 'NX Zero',
            images: [{ url: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=200&h=200&fit=crop', height: 200, width: 200 }],
            genres: ['Rock', 'Pop Rock'],
            popularity: 65,
            followers: { total: 400000 },
            external_urls: { spotify: '' }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

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
    <Layout>
      {/* Main Content */}
      <div className="p-12">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-3">Top Artistas</h1>
          <p className="text-gray-400 text-lg">
            Aqui você encontra seus artistas preferidos
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white text-lg">Carregando artistas...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-6">
              <h3 className="text-white text-xl font-semibold mb-2">Ops! Algo deu errado</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Artists List */}
        {!loading && !error && (
          <div className="space-y-4">
            {artists.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-white text-xl font-semibold mb-2">
                  Nenhum artista encontrado
                </h3>
                <p className="text-gray-400">
                  Comece a ouvir música para ver seus artistas favoritos aqui!
                </p>
              </div>
            ) : (
              artists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  onClick={handleArtistClick}
                />
              ))
            )}
          </div>
        )}

        {/* Footer com informações adicionais */}
        {!loading && !error && artists.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm text-center">
              Mostrando {artists.length} artistas baseados no seu histórico de reprodução
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}