import React, { useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useSpotifyPlayerContext } from '@/contexts';
import { formatDuration } from '@/utils/format';
import { useFavorites } from '@/hooks/useFavorites';
import { ProgressBar } from '@/components/ui';
import { VolumeSlider } from '@/components/ui';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
} from 'lucide-react';

const MusicPlayerBar: React.FC = () => {
  const {
    isPlaying,
    currentTrack,
    volume,
    progress,
    duration,
    shuffle,
    repeat,
    setVolume: setStoreVolume,
  } = usePlayerStore();

  // Hook de favoritos com React Query
  const {
    isFavorited,
    toggleFavorite,
    isLoading: isFavoriteLoading,
  } = useFavorites(currentTrack?.id);

  const {
    togglePlay: spotifyTogglePlay,
    nextTrack: spotifyNextTrack,
    previousTrack: spotifyPreviousTrack,
    seek: spotifySeek,
    setVolume: spotifySetVolume,
    isReady,
    toggleShuffle: spotifyToggleShuffle,
    toggleRepeat: spotifyToggleRepeat,
  } = useSpotifyPlayerContext();

  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const handleVolumeChange = (newVolume: number) => {
    setStoreVolume(newVolume);
    if (isReady) {
      spotifySetVolume(newVolume);
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  // Handle volume control

  const toggleMute = () => {
    if (isMuted) {
      setStoreVolume(previousVolume);
      if (isReady) {
        spotifySetVolume(previousVolume);
      }
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setStoreVolume(0);
      if (isReady) {
        spotifySetVolume(0);
      }
      setIsMuted(true);
    }
  };

  const handleToggleRepeat = () => {
    if (repeat === 'off') {
      spotifyToggleRepeat('context');
    } else if (repeat === 'context') {
      spotifyToggleRepeat('track');
    } else {
      spotifyToggleRepeat('off');
    }
  };

  // Don't render if no current track
  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-[3.5rem] left-0 right-0 bg-gray-900 border-t border-gray-700 px-3 py-1.5 sm:px-4 sm:py-3 z-40 md:bottom-0 md:z-50">
      <div className="max-w-screen-2xl mx-auto">
        {/* Layout Mobile - Vertical Stack */}
        <div className="block sm:hidden">
          <div className="flex items-start space-x-3">
            {/* Capa do álbum na lateral esquerda */}
            <div className="w-12 h-12 bg-gray-800 rounded-md overflow-hidden flex-shrink-0 ring-1 ring-white/20">
              {currentTrack.album.images[0] && (
                <img
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.album.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 min-w-0">
              {/* Linha 1: Título da música + Botão adicionar */}
              <div className="flex items-center justify-between mb-0.5">
                <h4 className="text-white text-sm font-medium truncate flex-1">
                  {currentTrack.name}
                </h4>
                <button
                  onClick={toggleFavorite}
                  disabled={isFavoriteLoading}
                  data-testid="favorite-button"
                  className={`ml-2 transition-colors flex-shrink-0 ${
                    isFavorited
                      ? 'text-green-500'
                      : 'text-gray-400 hover:text-white'
                  } ${isFavoriteLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isFavorited ? (
                    <Heart className="w-4 h-4 fill-current" />
                  ) : (
                    <Heart className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Linha 2: Nome do artista */}
              <div className="mb-1.5">
                <p className="text-gray-400 text-xs truncate">
                  {currentTrack.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>

              {/* Linha 3: Barra de progresso com controles do player do lado */}
              <div className="flex items-center justify-between space-x-2 mt-1">
                <div className="flex items-center space-x-1 flex-1 max-w-[70%]">
                  <span className="text-xs text-gray-400 w-8 text-left">
                    {formatDuration(progress)}
                  </span>
                  <ProgressBar
                    progress={progress}
                    duration={duration}
                    onSeek={spotifySeek}
                    className="h-0.5"
                    data-testid="progress-bar"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">
                    {formatDuration(duration)}
                  </span>
                </div>

                {/* Controles do player fixados à direita */}
                <div className="flex items-center space-x-2 flex-shrink-0 mr-2">
                  <button
                    onClick={() => isReady && spotifyPreviousTrack()}
                    className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    disabled={!isReady}
                    data-testid="previous-button"
                  >
                    <SkipBack className="w-6.5 h-6.5" />
                  </button>

                  <button
                    onClick={() => isReady && spotifyTogglePlay()}
                    className="bg-white text-black rounded-full p-2.5 hover:scale-105 transition-transform disabled:opacity-50"
                    disabled={!isReady}
                    data-testid="play-pause-button"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => isReady && spotifyNextTrack()}
                    className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    disabled={!isReady}
                    data-testid="next-button"
                  >
                    <SkipForward className="w-6.5 h-6.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Desktop - Horizontal */}
        <div className="hidden sm:flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-gray-800 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/20">
              {currentTrack.album.images[0] && (
                <img
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.album.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-white text-sm font-medium truncate">
                {currentTrack.name}
              </h4>
              <p className="text-gray-400 text-xs truncate">
                {currentTrack.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
            <button
              onClick={toggleFavorite}
              disabled={isFavoriteLoading}
              data-testid="favorite-button-desktop"
              className={`transition-colors flex-shrink-0 ${
                isFavorited
                  ? 'text-green-500'
                  : 'text-gray-400 hover:text-white'
              } ${isFavoriteLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isFavorited ? (
                <Heart className="w-5 h-5 fill-current" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
            {/* Control Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => spotifyToggleShuffle(!shuffle)}
                data-testid="shuffle-button"
                className={`transition-colors ${
                  shuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={() => isReady && spotifyPreviousTrack()}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                disabled={!isReady}
                data-testid="previous-button-desktop"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => isReady && spotifyTogglePlay()}
                className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform disabled:opacity-50"
                disabled={!isReady}
                data-testid="play-pause-button-desktop"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <button
                onClick={() => isReady && spotifyNextTrack()}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                disabled={!isReady}
                data-testid="next-button-desktop"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={handleToggleRepeat}
                data-testid="repeat-button"
                className={`transition-colors ${
                  repeat !== 'off'
                    ? 'text-green-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {repeat === 'track' ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatDuration(progress)}
              </span>
              <ProgressBar
                progress={progress}
                duration={duration}
                onSeek={spotifySeek}
                data-testid="progress-bar-desktop"
              />
              <span className="text-xs text-gray-400 w-10">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <VolumeSlider
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onToggleMute={toggleMute}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerBar;
