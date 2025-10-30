import { useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
import type { Playlist } from '@/types';
import { useImageCache } from '@/hooks/useImageCache';
import { usePlaylistTracks } from '@/hooks/useSpotifyQueries';
import { usePlayerStore } from '@/store/playerStore';
import { useSpotifyPlayerContext } from '@/contexts/SpotifyPlayerContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { Indicator } from '@/components/ui';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick?: (playlist: Playlist) => void;
  className?: string;
}

export function PlaylistCard({ playlist, onClick, className }: PlaylistCardProps) {
  const fallbackImage = 'https://via.placeholder.com/300x300/1f2937/9ca3af?text=Playlist';

  const bestImageUrl = useMemo(() => {
    if (!playlist.images?.length) return null;
    const medium = playlist.images.find((img) => img.height && img.height >= 200 && img.height <= 400);
    return medium?.url ?? playlist.images[0]?.url ?? null;
  }, [playlist.images]);

  const { imageUrl, isLoading } = useImageCache(bestImageUrl, 'playlist', { fallbackUrl: fallbackImage });
  const { data: playlistTracksData } = usePlaylistTracks(playlist.id);
  const { setCurrentTrack, setQueue, setIsPlaying } = usePlayerStore();
  const { playTrack, isReady } = useSpotifyPlayerContext();

  const handlePlay = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const tracks = playlistTracksData?.items?.map((i) => i.track).filter(Boolean) ?? [];
      if (!tracks.length) return console.warn('Nenhuma faixa disponível na playlist.');
      const firstTrack = tracks[0];
      setCurrentTrack(firstTrack);
      setQueue(tracks);
      setIsPlaying(true);
      if (!isReady) return console.warn('Player não está pronto.');
      const trackUri = `spotify:track:${firstTrack.id}`;
      const playlistUri = `spotify:playlist:${playlist.id}`;
      try {
        await playTrack(trackUri, playlistUri);
      } catch {
        try {
          await playTrack(trackUri);
        } catch (err) {
          console.error('Erro ao tentar tocar a faixa:', err);
        }
      }
    },
    [playlist.id, playlistTracksData, isReady, setCurrentTrack, setQueue, setIsPlaying, playTrack]
  );

  const handleClick = useCallback(() => onClick?.(playlist), [onClick, playlist]);
  const formatTrackCount = useCallback(
    (count: number) => (count === 1 ? '1 música' : `${count.toLocaleString()} músicas`),
    []
  );

  const hasTracks = Boolean(playlistTracksData?.items?.length);
  const safeDescription = playlist.description ? DOMPurify.sanitize(playlist.description) : '';

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300 cursor-pointer h-24 flex flex-col',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          {isLoading ? (
            <div className="w-16 h-16 rounded-lg bg-gray-700 animate-pulse flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          ) : (
            <img
              src={imageUrl ?? fallbackImage}
              alt={playlist.name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => ((e.target as HTMLImageElement).src = fallbackImage)}
            />
          )}

          {hasTracks && (
            <Button
              onClick={handlePlay}
              aria-label={`Reproduzir ${playlist.name}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              variant="spotify"
              size="icon"
            >
              <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </Button>
          )}
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="text-white font-semibold text-sm truncate group-hover:text-green-400 transition-colors">
            {playlist.name}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
            <span>Por {playlist.owner.display_name}</span>
            <span>•</span>
            <span>{formatTrackCount(playlist.tracks.total)}</span>
          </div>

          {playlist.description && (
            <p
              className="text-gray-400 text-xs mt-1 line-clamp-1 leading-tight"
              dangerouslySetInnerHTML={{ __html: safeDescription }}
            />
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {playlist.public ? (
            <Indicator label="Pública" color="gray" icon="check" />
          ) : (
            <Indicator label="Privada" color="gray" icon="lock" />
          )}
          {playlist.collaborative && <Indicator label="Colaborativa" color="green" icon="group" />}
        </div>
      </div>
    </div>
  );
}
