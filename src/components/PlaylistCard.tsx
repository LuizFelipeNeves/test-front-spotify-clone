import type { Playlist } from '@/types';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick?: (playlist: Playlist) => void;
  className?: string;
}

export function PlaylistCard({ playlist, onClick, className = '' }: PlaylistCardProps) {
  const fallbackImage = 'https://via.placeholder.com/300x300/1f2937/9ca3af?text=Playlist';

  const getBestImage = (images: { url: string; height: number | null; width: number | null }[]) => {
    if (!images || images.length === 0) return fallbackImage;
    
    // Procura por uma imagem de tamanho médio (entre 200-400px)
    const mediumImage = images.find(img => 
      img.height && img.height >= 200 && img.height <= 400
    );
    
    if (mediumImage) return mediumImage.url;
    
    // Se não encontrar, pega a primeira disponível
    return images[0]?.url || fallbackImage;
  };

  const formatTrackCount = (count: number) => {
    if (count === 1) return '1 música';
    return `${count.toLocaleString()} músicas`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(playlist);
    }
  };

  const handlePlayClick = handleClick;

  return (
    <div
      className={`group relative bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        {/* Playlist Image */}
        <div className="relative flex-shrink-0">
          <img
            src={getBestImage(playlist.images)}
            alt={playlist.name}
            className="w-16 h-16 rounded-lg object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImage;
            }}
          />
          
          {/* Play Button - Visible on hover */}
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70"
            aria-label={`Reproduzir ${playlist.name}`}
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors shadow-lg">
              <svg 
                className="w-4 h-4 text-black ml-0.5" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Playlist Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate group-hover:text-green-400 transition-colors">
            {playlist.name}
          </h3>
          
          {playlist.description && (
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
              {playlist.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
            <span>Por {playlist.owner.display_name}</span>
            <span>•</span>
            <span>{formatTrackCount(playlist.tracks.total)}</span>
          </div>
        </div>

        {/* Playlist Type Indicator */}
        <div className="flex flex-col items-end gap-2">
          {playlist.public ? (
            <div className="flex items-center gap-1 text-gray-400 text-xs" title="Playlist Pública">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="hidden sm:inline">Pública</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-400 text-xs" title="Playlist Privada">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <span className="hidden sm:inline">Privada</span>
            </div>
          )}
          
          {playlist.collaborative && (
            <div className="flex items-center gap-1 text-green-400 text-xs" title="Playlist Colaborativa">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v-6.5c0-1.38-1.12-2.5-2.5-2.5H13V9.5c0-1.38-1.12-2.5-2.5-2.5S8 8.12 8 9.5V18H4z"/>
              </svg>
              <span className="hidden sm:inline">Colaborativa</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}