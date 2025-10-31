import type { Album } from '@/types';
import { useImageCache } from '@/hooks/useImageCache';
import { Button } from '@/components/ui';

interface AlbumCardProps {
  album: Album;
  onClick?: (album: Album) => void;
  onPlay?: (album: Album) => void;
  className?: string;
}

const fallbackImage =
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop';

export function AlbumCard({
  album,
  onClick,
  onPlay,
  className = '',
}: AlbumCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(album);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onPlay) {
      onPlay(album);
    } else {
      // Default behavior: open in new tab
      window.open(album.external_urls.spotify, '_blank');
    }
  };

  // Pega a imagem de melhor qualidade disponível
  const getAlbumImageUrl = () => {
    if (!album.images || album.images.length === 0) {
      return null;
    }

    // Ordena por tamanho e pega a primeira (maior)
    const sortedImages = [...album.images].sort(
      (a, b) => (b.height || 0) - (a.height || 0)
    );
    return sortedImages[0]?.url || album.images[0]?.url;
  };

  // Use o hook de cache de imagens
  const { imageUrl, isLoading } = useImageCache(getAlbumImageUrl(), 'artist', {
    fallbackUrl: fallbackImage,
  });

  const formatReleaseDate = (dateString: string) => {
    if (dateString.length === 4) {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch {
      return dateString;
    }
  };

  const formatArtists = (artists: Album['artists']) => {
    if (!artists || artists.length === 0) return '';
    return artists.map(artist => artist.name).join(', ');
  };

  return (
    <div
      className={`group relative bg-gray-900/50 hover:bg-gray-800/70 p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${className}`}
      onClick={handleClick}
      role="article"
      aria-label={`Álbum ${album.name} por ${formatArtists(album.artists)}`}
    >
      {/* Imagem do Álbum */}
      <div className="relative mb-4">
        {isLoading ? (
          <div className="w-full aspect-square rounded-lg bg-gray-700 animate-pulse flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        ) : (
          <img
            src={imageUrl || fallbackImage}
            alt={`Capa do álbum ${album.name}`}
            className="w-full aspect-square object-cover rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImage;
            }}
          />
        )}

        {/* Overlay com botão de play */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handlePlayClick}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg ml-1 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 text-white"
              variant="spotify"
              aria-label={`Reproduzir ${album.name}`}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Informações do Álbum */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-green-400 transition-colors duration-300">
          {album.name}
        </h3>

        <div className="space-y-1">
          {album.artists && album.artists.length > 0 && (
            <p className="text-gray-400 text-xs line-clamp-1">
              {formatArtists(album.artists)}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            {album.release_date && (
              <span data-testid="release-date">
                {formatReleaseDate(album.release_date)}
              </span>
            )}
            {!!album.total_tracks && <span>{album.total_tracks} faixas</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export type { Album };
