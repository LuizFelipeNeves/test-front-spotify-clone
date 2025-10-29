import React, { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useSpotifyPlayerContext } from '@/contexts/SpotifyPlayerContext';
import { formatDuration } from '@/utils/format';
import { useFavorites } from '@/hooks/useFavorites';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
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
  const { isFavorited, toggleFavorite, isLoading: isFavoriteLoading } = useFavorites(currentTrack?.id);

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

  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(progress);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeSliderRef = useRef<HTMLDivElement>(null);

  // Update local progress when not dragging
  useEffect(() => {
    if (!isDragging) {
      setLocalProgress(progress);
    }
  }, [progress, isDragging]);

  // Handle progress bar click and drag
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration || isDragging) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * duration;

    setLocalProgress(newProgress);

    if (isReady) {
      spotifySeek(newProgress);
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * duration;

    setLocalProgress(newProgress);
    setIsDragging(true);
  };

  const handleProgressMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(duration, (clickX / rect.width) * duration));
    
    setLocalProgress(newProgress);
  };

  const handleProgressMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);

      if (isReady && localProgress !== progress) {
        spotifySeek(localProgress);

        // Small delay to allow Spotify API to update before we resume syncing
        setTimeout(() => {
          // Force a re-sync after seek completes
        }, 100);
      }
    }
  };

  // Handle volume control
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeSliderRef.current) return;

    const rect = volumeSliderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
    
    setStoreVolume(newVolume);
    if (isReady) {
      spotifySetVolume(newVolume);
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

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

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleProgressMouseMove);
      document.addEventListener('mouseup', handleProgressMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleProgressMouseMove);
        document.removeEventListener('mouseup', handleProgressMouseUp);
      };
    }
  }, [isDragging]);

  // Don't render if no current track
  if (!currentTrack) {
    return null;
  }

  const progressPercentage = duration ? (localProgress / duration) * 100 : 0;
  const volumePercentage = volume * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-4 py-3 z-50">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-14 h-14 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
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
            className={`transition-colors ${
              isFavorited ? 'text-green-500' : 'text-gray-400 hover:text-white'
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
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => isReady && spotifyTogglePlay()}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform disabled:opacity-50"
              disabled={!isReady}
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
            >
              <SkipForward className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleToggleRepeat}
              className={`transition-colors ${
                repeat !== 'off' ? 'text-green-500' : 'text-gray-400 hover:text-white'
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
              {formatDuration(localProgress)}
            </span>
            <div
              ref={progressBarRef}
              className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group"
              onMouseDown={handleProgressMouseDown}
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
                style={{ width: `${progressPercentage}%` }}
              >
                <div
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDragging ? 'opacity-100' : ''
                  }`}
                />
              </div>
            </div>
            <span className="text-xs text-gray-400 w-10">
              {formatDuration(duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <div className="relative">
            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            
            {showVolumeSlider && (
              <div
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 p-2 rounded-md"
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <div
                  ref={volumeSliderRef}
                  className="w-20 h-1 bg-gray-600 rounded-full cursor-pointer group"
                  onClick={handleVolumeClick}
                >
                  <div
                    className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
                    style={{ width: `${volumePercentage}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerBar;