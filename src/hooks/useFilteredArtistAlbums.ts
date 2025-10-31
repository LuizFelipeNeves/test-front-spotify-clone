import { useMemo } from 'react';
import type { Album } from '@/types';

interface UseFilteredArtistAlbumsProps {
  albums: Album[];
}

export const useFilteredArtistAlbums = ({
  albums,
}: UseFilteredArtistAlbumsProps) => {
  const removeDuplicates = (items: Album[]) => {
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

  const visibleAlbums = useMemo(() => {
    const albumsOnly = albums.filter(album => album.album_type === 'album');
    return removeDuplicates(albumsOnly);
  }, [albums]);

  const visibleSingles = useMemo(() => {
    const singlesOnly = albums.filter(album => album.album_type === 'single');
    return removeDuplicates(singlesOnly);
  }, [albums]);

  const visibleCompilations = useMemo(() => {
    const compilationsOnly = albums.filter(
      album => album.album_type === 'compilation'
    );
    return removeDuplicates(compilationsOnly);
  }, [albums]);

  return { visibleAlbums, visibleSingles, visibleCompilations };
};
