import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useArtist, useInfiniteArtistAlbums } from '@/hooks/useSpotifyQueries';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { AlbumCard } from '@/components/AlbumCard';
import { useSpotifyPlayerContext } from '@/contexts/SpotifyPlayerContext';
import type { Album } from '@/components/AlbumCard';

export const ArtistDetailPage: React.FC = () => {
  const { id: artistId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const { playTrack, isReady } = useSpotifyPlayerContext();

  if (!artistId) {
    return <div>ID do artista não encontrado</div>;
  }

  // Fetch artist data
  const {
    data: artist,
    isLoading: artistLoading,
    isError: artistError,
    error: artistErrorData
  } = useArtist(artistId);

  // Fetch artist albums with infinite scroll
  const {
    data: albumsData,
    isLoading: albumsLoading,
    isError: albumsError,
    error: albumsErrorData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteArtistAlbums(artistId, 20);

  // Flatten all pages into a single array of albums
  const albums = albumsData?.pages.flatMap(page => page.items) ?? [];

  // Separate albums, singles, and compilations
  const albumsOnly = albums.filter(album => album.album_type === 'album');
  const singlesOnly = albums.filter(album => album.album_type === 'single');
  const compilationsOnly = albums.filter(album => album.album_type === 'compilation');

  // Remove duplicates based on album name and release date
  const removeDuplicates = (items: typeof albums) => {
    const seen = new Set();
    return items.filter(item => {
      const key = `${item.name}-${item.release_date}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  const visibleAlbums = removeDuplicates(albumsOnly);
  const visibleSingles = removeDuplicates(singlesOnly);
  const visibleCompilations = removeDuplicates(compilationsOnly);

  const loading = artistLoading || albumsLoading;
  const error = artistError || albumsError;

  // Function to play an album
  const handlePlayAlbum = async (album: Album) => {
    if (!isReady) {
      console.warn('Player not ready');
      return;
    }

    try {
      // Play the album using the context URI
      const albumUri = `spotify:album:${album.id}`;
      // We don't need a specific track URI, just the album context
      playTrack('', albumUri);
    } catch (error) {
      console.error('Error playing album:', error);
    }
  };

  // Função para determinar a mensagem de erro apropriada
  const getErrorMessage = () => {
    if (!isOnline) {
      return 'Você está offline. Verifique sua conexão com a internet.';
    }

    const errorData = artistErrorData || albumsErrorData;
    const errorWithStatus = errorData as any; // Cast para acessar propriedades customizadas

    if (errorData?.message?.includes('Failed to fetch')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }
    if (errorWithStatus?.status === 404) {
      return 'Artista não encontrado.';
    }
    if (errorWithStatus?.status === 401) {
      return 'Sessão expirada. Faça login novamente.';
    }
    return errorData?.message || 'Erro ao carregar dados do artista.';
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex items-center mb-4">
          {isOnline ? (
            <Wifi className="w-6 h-6 text-green-500 mr-2" />
          ) : (
            <WifiOff className="w-6 h-6 text-red-500 mr-2" />
          )}
          <p className="text-red-500">{getErrorMessage()}</p>
        </div>
        <button
          onClick={() => navigate('/artists')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Voltar para Artistas
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header with back button */}
      <div className="flex items-center p-6 pb-0">
        <button
          onClick={() => navigate('/artists')}
          className="flex items-center text-white hover:text-green-500 transition-colors mr-4"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span className="text-lg font-medium">{artist.name}</span>
        </button>
      </div>

      {/* Artist info section */}
      <div className="flex items-center p-6 pt-4">
        {artist.images?.[0] && (
          <img
            src={artist.images[0].url}
            alt={artist.name}
            className="w-24 h-24 rounded-full object-cover mr-6"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold mb-2">{artist.name}</h1>
          <p className="text-gray-400 text-sm">
            {artist.followers?.total?.toLocaleString()} seguidores
          </p>
          {artist.genres?.length > 0 && (
            <p className="text-gray-400 text-sm mt-1">
              {artist.genres.slice(0, 3).join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Albums, Singles and Compilations sections */}
      <div className="px-6 pb-6">
        {albums.length === 0 && !isFetchingNextPage ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum álbum, single ou compilação encontrado</p>
          </div>
        ) : (
          <>
            {/* Albums section */}
            {visibleAlbums.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-6">Álbuns ({visibleAlbums.length})</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                  {visibleAlbums.map((album) => (
                    <AlbumCard
                      key={`album-${album.id}`}
                      album={album}
                      onPlay={handlePlayAlbum}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Singles section */}
            {visibleSingles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-6">Singles e EPs ({visibleSingles.length})</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                  {visibleSingles.map((single) => (
                    <AlbumCard
                      key={`single-${single.id}`}
                      album={single}
                      onPlay={handlePlayAlbum}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Compilations section */}
            {visibleCompilations.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-6">Compilações ({visibleCompilations.length})</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                  {visibleCompilations.map((compilation) => (
                    <AlbumCard
                      key={`compilation-${compilation.id}`}
                      album={compilation}
                      onPlay={handlePlayAlbum}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Infinite scroll trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span className="ml-3 text-gray-400">Carregando mais conteúdo...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};