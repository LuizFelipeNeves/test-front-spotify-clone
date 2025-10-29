import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useArtist, useInfiniteArtistAlbums } from '@/hooks/useSpotifyQueries';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSpotifyPlayerContext } from '@/contexts/SpotifyPlayerContext';
import type { Album } from '@/components/AlbumCard';

import { ArtistDetailHeader } from '@/components/artist-detail/ArtistDetailHeader';
import { AlbumGrid } from '@/components/artist-detail/AlbumGrid';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ArtistDetailErrorState } from '@/components/artist-detail/ArtistDetailErrorState';
import { EmptyState } from '@/components/EmptyState';

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
    return <LoadingSpinner message="Carregando artista..." />;
  }

  if (error || !artist) {
    return (
      <ArtistDetailErrorState
        isOnline={isOnline}
        errorMessage={getErrorMessage()}
        onBackClick={() => navigate('/artists')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <ArtistDetailHeader artist={artist} />

      <div className="px-6 pb-6">
        {albums.length === 0 && !isFetchingNextPage ? (
          <EmptyState
            title="Nenhum álbum, single ou compilação encontrado"
            description="Parece que este artista ainda não tem lançamentos disponíveis."
          />
        ) : (
          <>
            <AlbumGrid title="Álbuns" albums={visibleAlbums} onPlay={handlePlayAlbum} />
            <AlbumGrid title="Singles e EPs" albums={visibleSingles} onPlay={handlePlayAlbum} />
            <AlbumGrid title="Compilações" albums={visibleCompilations} onPlay={handlePlayAlbum} />

            {/* Infinite scroll trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
                <LoadingSpinner size="sm" message="Carregando mais conteúdo..." />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};