import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useArtist, useInfiniteArtistAlbums } from '@/hooks/useSpotifyQueries';
import { useFilteredArtistAlbums } from '@/hooks/useFilteredArtistAlbums';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSpotifyPlayerContext } from '@/contexts';
import type { Album } from '@/types';

import { ArtistDetailHeader } from '@/components';
import { AlbumGrid } from '@/components';
import { LoadingSpinner } from '@/components';
import { ArtistDetailErrorState } from '@/components';
import { getArtistErrorMessage, toApiError } from '@/utils/errorMessages';
import { EmptyState } from '@/components';

export const ArtistDetailPage: React.FC = () => {
  const { id: artistId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const { playTrack, isReady } = useSpotifyPlayerContext();

  // Fetch artist data
  const {
    data: artist,
    isLoading: artistLoading,
    isError: artistError,
    error: artistErrorData
  } = useArtist(artistId || '');

  // Fetch artist albums with infinite scroll
  const {
    data: albumsData,
    isLoading: albumsLoading,
    isError: albumsError,
    error: albumsErrorData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteArtistAlbums(artistId || '', 20);

  // Flatten all pages into a single array of albums
  const albums = albumsData?.pages.flatMap(page => page.items) ?? [];

  const { visibleAlbums, visibleSingles, visibleCompilations } = useFilteredArtistAlbums({ albums });

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
  const errorMessage = getArtistErrorMessage(isOnline, toApiError(artistErrorData), toApiError(albumsErrorData));

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

  if (!artistId) {
    return <div>ID do artista não encontrado</div>;
  }

  if (loading) {
    return <LoadingSpinner message="Carregando artista..." />;
  }

  if (error || !artist) {
    return (
      <ArtistDetailErrorState
        isOnline={isOnline}
        errorMessage={errorMessage}
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
            message="Nenhum álbum, single ou compilação encontrado"
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