import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useArtist, useInfiniteArtistAlbums } from '@/hooks/useSpotifyQueries';
import { ContentList } from '@/components/ContentList';
import { AlbumCard } from '@/components/AlbumCard';
import type { Album } from '@/types';

export const ArtistDetailPage: React.FC = () => {
  const { id: artistId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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

  // Separate albums and singles
  const albumsOnly = albums.filter(album => album.album_type === 'album');
  const singlesOnly = albums.filter(album => album.album_type === 'single');

  const loading = artistLoading || albumsLoading;
  const error = artistError || albumsError;
  const errorMessage = artistErrorData?.message || albumsErrorData?.message || null;

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        hasNextPage &&
        !isFetchingNextPage &&
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        <p className="text-red-500 mb-4">{error || 'Artista não encontrado'}</p>
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

      {/* Albums and Singles sections */}
      <div className="px-6 pb-6">
        {albums.length === 0 && !isFetchingNextPage ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum álbum ou single encontrado</p>
          </div>
        ) : (
          <>
            {/* Albums section */}
            {albumsOnly.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-6">Álbuns</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                  {albumsOnly.map((album) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Singles section */}
            {singlesOnly.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-6">Singles</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                  {singlesOnly.map((single) => (
                    <AlbumCard
                      key={single.id}
                      album={single}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Loading indicator for infinite scroll */}
            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-8">
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