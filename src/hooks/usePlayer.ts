import { useState, useRef, useEffect } from 'react';
import type { PlayerState, Track } from '@/types';

/**
 * Custom hook for music player management
 */
export const usePlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTrack: null,
    volume: 0.5,
    progress: 0,
    duration: 0,
    shuffle: false,
    repeat: 'off',
  });

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: audio.duration,
      }));
    };

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        progress: audio.currentTime,
      }));
    };

    const handleEnded = () => {
      setPlayerState(prev => ({
        ...prev,
        isPlaying: false,
        progress: 0,
      }));
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playTrack = (track: Track) => {
    if (!audioRef.current || !track.preview_url) return;

    const audio = audioRef.current;

    if (playerState.currentTrack?.id !== track.id) {
      audio.src = track.preview_url;
      setPlayerState(prev => ({
        ...prev,
        currentTrack: track,
        progress: 0,
      }));
    }

    audio.play();
    setPlayerState(prev => ({
      ...prev,
      isPlaying: true,
    }));
  };

  const pauseTrack = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  };

  const togglePlay = () => {
    if (playerState.isPlaying) {
      pauseTrack();
    } else if (playerState.currentTrack) {
      playTrack(playerState.currentTrack);
    }
  };

  const setVolume = (volume: number) => {
    if (!audioRef.current) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;

    setPlayerState(prev => ({
      ...prev,
      volume: clampedVolume,
    }));
  };

  const seekTo = (time: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    setPlayerState(prev => ({
      ...prev,
      progress: time,
    }));
  };

  const toggleShuffle = () => {
    setPlayerState(prev => ({
      ...prev,
      shuffle: !prev.shuffle,
    }));
  };

  const toggleRepeat = () => {
    setPlayerState(prev => ({
      ...prev,
      repeat:
        prev.repeat === 'off'
          ? 'context'
          : prev.repeat === 'context'
            ? 'track'
            : 'off',
    }));
  };

  return {
    ...playerState,
    playTrack,
    pauseTrack,
    togglePlay,
    setVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
  };
};
