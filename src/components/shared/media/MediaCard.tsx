import React from 'react';
import { Play } from 'lucide-react';
import type { MediaItemBase, MediaType } from '@/constants/ui';
import { UI_CONFIG, UI_TEXTS } from '@/constants/ui';
import { formatReleaseDate, formatArtists } from '@/utils/format';
import type { Album, Playlist } from '@/types';

interface MediaCardProps<T extends MediaItemBase> {
  item: T;
  type: MediaType;
  isLoading?: boolean;
  onPlay?: (item: T) => void;
  onClick?: (item: T) => void;
  className?: string;
  // Props específicas por tipo
  subtitle?: string;
  metadata?: string;
}

// Componente genérico para cards de mídia (Artista, Álbum, Playlist)
interface MediaCardExtraProps {
  'data-testid'?: string;
  id?: string;
  // outros atributos que você realmente quer repassar
}

export function MediaCard<T extends MediaItemBase>({
  item,
  type,
  isLoading = false,
  onPlay,
  onClick,
  className = '',
  subtitle,
  metadata,
  ...extraProps // só props extras seguras
}: MediaCardProps<T> & MediaCardExtraProps) {
  const getFallbackImage = () => {
    switch (type) {
      case 'artist':
        return UI_CONFIG.imagens.artistaFallback;
      case 'album':
        return UI_CONFIG.imagens.albumFallback;
      case 'playlist':
        return UI_CONFIG.imagens.playlistFallback;
      default:
        return UI_CONFIG.imagens.playlistFallback;
    }
  };

  const handleCardClick = () => {
    if (!isLoading && onClick) onClick(item);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoading && onPlay) onPlay(item);
  };

  if (isLoading) {
    return (
      <div
        className={`group relative bg-gray-800 rounded-md overflow-hidden transition-all duration-300 hover:bg-gray-700 cursor-pointer ${className}`}
        {...extraProps} // só repassa data-testid ou id
      >
        <div className="aspect-square w-full bg-gray-700 animate-pulse" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-gray-700 rounded animate-pulse" />
          <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse" />
          {metadata && <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />}
        </div>
      </div>
    );
  }

  const imageUrl = item.images?.[0]?.url || getFallbackImage();

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-gray-800 rounded-md overflow-hidden transition-all duration-300 hover:bg-gray-700 cursor-pointer ring-1 ring-white/10 hover:ring-white/20 ${className}`}
      {...extraProps} // repassa só props seguras
    >
      <div className="aspect-square relative">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackImage();
          }}
        />
        {onPlay && (
          <div
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30"
          >
            <button
              className="bg-green-500 text-white rounded-full p-3 shadow-lg hover:scale-105 transition-transform duration-200"
              aria-label={`Play ${item.name}`}
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-3 space-y-1">
        <h3 className="text-white text-sm font-medium truncate" title={item.name}>
          {item.name}
        </h3>
        {subtitle && (
          <p className="text-gray-400 text-xs truncate" title={subtitle}>
            {subtitle}
          </p>
        )}
        {metadata && (
          <p className="text-gray-400 text-xs truncate" title={metadata}>
            {metadata}
          </p>
        )}
      </div>
    </div>
  );
}


export const AlbumCard = (props: Omit<MediaCardProps<Album>, 'type' | 'subtitle' | 'metadata'>) => (
  <MediaCard
    {...props}
    type="album"
    subtitle={formatArtists(props.item.artists)}
    metadata={formatReleaseDate(props.item.release_date)}
  />
);

export const PlaylistCard = (props: Omit<MediaCardProps<Playlist>, 'type' | 'subtitle' | 'metadata'>) => (
  <MediaCard
    {...props}
    type="playlist"
    subtitle={props.item.description || ''}
    metadata={`${props.item.tracks.total} ${UI_TEXTS.faixas}`}
  />
);