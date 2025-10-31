import React from 'react';
import { AlbumCard } from '@/components';
import type { Album } from '@/types';

interface AlbumGridProps {
  title: string;
  albums: Album[];
  onPlay: (album: Album) => void;
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  title,
  albums,
  onPlay,
}) => {
  if (albums.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-6">
        {title} ({albums.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {albums.map((album: Album) => (
          <AlbumCard
            key={`${title}-${album.id}`}
            item={album}
            onPlay={onPlay}
            data-testid={`album-card-${album.id}`} // facilita o teste
          />
        ))}
      </div>
    </div>
  );
};
