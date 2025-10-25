import type { Artist } from '@/types';

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
  const getArtistImage = () => {
    if (!artist.images || artist.images.length === 0) {
      return fallBackImage;
    }
    
    // Ordena por tamanho e pega a primeira (maior)
    const sortedImages = [...artist.images].sort((a, b) => (b.height || 0) - (a.height || 0));
    return sortedImages[0]?.url || artist.images[0]?.url;
  };

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
      onClick={handleClick}
      className={`flex items-center gap-5 hover:bg-gray-900 p-4 rounded-lg cursor-pointer transition-colors group ${className}`}
    >
      {/* Imagem do Artista */}
      <div className="relative">
        <img
          src={getArtistImage()}
          alt={artist.name}
          className="w-16 h-16 rounded-full object-cover"
          onError={(e) => {
            // Fallback para imagem padrão se a imagem falhar
            const target = e.target as HTMLImageElement;
            target.src = fallBackImage;
          }}
        />
        
        {/* Indicador de popularidade */}
        {artist.popularity && artist.popularity > 70 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">★</span>
          </div>
        )}
      </div>

      {/* Informações do Artista */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white text-lg font-medium group-hover:text-green-500 transition-colors truncate">
          {artist.name}
        </h3>
        
        {/* Informações adicionais */}
        <div className="flex items-center gap-3 mt-1">
          {artist.followers && (
            <span className="text-gray-400 text-sm">
              {formatFollowers(artist.followers.total)}
            </span>
          )}
          
          {artist.genres && artist.genres.length > 0 && (
            <span className="text-gray-500 text-sm">
              • {artist.genres.slice(0, 2).join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Botão de Play (aparece no hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black ml-1">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export type { Artist };