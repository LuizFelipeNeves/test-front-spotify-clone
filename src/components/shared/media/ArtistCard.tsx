import type { Artist } from '@/types';
import { useImageCache } from '@/hooks/useImageCache';

interface ArtistCardProps {
  artist: Artist;
  onClick?: (artist: Artist) => void;
  className?: string;
}

const fallBackImage = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop'

export function ArtistCard({ artist, onClick, className = '' }: ArtistCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(artist);
    }
  };

  // Pega a imagem de melhor qualidade disponível
  const getArtistImageUrl = () => {
    if (!artist.images || artist.images.length === 0) {
      return null;
    }

    // Ordena por tamanho e pega a primeira (maior)
    const sortedImages = [...artist.images].sort((a, b) => (b.height || 0) - (a.height || 0));
    return sortedImages[0]?.url || artist.images[0]?.url;
  };

  // Use o hook de cache de imagens
  const { imageUrl, isLoading } = useImageCache(
    getArtistImageUrl(),
    'artist',
    { fallbackUrl: fallBackImage }
  );

  const formatFollowers = (count?: number) => {
    if (!count) return '';

    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M seguidores`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K seguidores`;
    }
    return `${count} seguidores`;
  };

  return (
    <div
      className={`relative hover:bg-gray-900 p-3 sm:p-4 lg:p-5 rounded-lg cursor-pointer transition-all duration-300 group ${className}`}
    >
      {/* Layout responsivo: vertical em mobile, horizontal em desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-5">
        {/* Imagem do Artista */}
        <div className="relative flex-shrink-0 self-center sm:self-auto">
          {isLoading ? (
            <div className="w-20 h-20 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gray-700 animate-pulse flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          ) : (
            <img
              src={imageUrl || fallBackImage}
              alt={artist.name}
              className="w-20 h-20 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full object-cover ring-2 ring-transparent group-hover:ring-green-500/30 transition-all duration-300"
              onError={(e) => {
                // Fallback para imagem padrão se a imagem falhar
                const target = e.target as HTMLImageElement;
                target.src = fallBackImage;
              }}
            />
          )}
          {/* Indicador de alta popularidade */}
          {artist.popularity && artist.popularity > 80 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Informações do Artista */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="text-white font-semibold text-lg sm:text-base lg:text-lg truncate group-hover:text-green-400 transition-colors duration-300">
            {artist.name}
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-400 text-sm mt-1">
            {artist.followers && (
              <span className="text-xs sm:text-sm">{formatFollowers(artist.followers.total)}</span>
            )}

            {artist.genres && artist.genres.length > 0 && (
              <span className="text-gray-500 text-xs sm:text-sm">
                {artist.followers && <span className="hidden sm:inline">• </span>}
                {artist.genres.slice(0, 2).join(', ')}
              </span>
            )}
          </div>

          {/* Indicador de popularidade com estrelas - movido para dentro das informações */}
          {artist.popularity && (
            <div className="mt-2 sm:mt-1">
              <div className="flex items-center justify-center sm:justify-start gap-1">
                <span className="text-xs text-gray-500 hidden sm:inline">Popularidade:</span>
                {Array.from({ length: 5 }, (_, i) => {
                  const starValue = (i + 1) * 20;
                  const isFilled = artist.popularity >= starValue;
                  const isHalfFilled = artist.popularity >= starValue - 10 && artist.popularity < starValue;

                  return (
                    <div key={i} className="relative">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {(isFilled || isHalfFilled) && (
                        <svg
                          className={`absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 ${isFilled ? 'text-green-400' : 'text-green-400'}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={isHalfFilled ? { clipPath: 'inset(0 50% 0 0)' } : {}}
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      )}
                    </div>
                  );
                })}
                <span className="text-xs text-gray-400 ml-1">{artist.popularity}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Área clicável para o card */}
      <div
        onClick={handleClick}
        className="absolute inset-0 cursor-pointer"
      />
    </div>
  );
}
