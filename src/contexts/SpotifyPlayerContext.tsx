// contexts/SpotifyPlayerContext.tsx
import React, { createContext, useContext } from 'react';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import type { SpotifyPlayer } from '@/types/spotify';

interface SpotifyPlayerContextType {
  player: SpotifyPlayer | null;
  deviceId: string | null;
  isReady: boolean;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlay: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seek: (position: number) => void;
  setVolume: (volume: number) => void;
  playTrack: (trackUri: string, contextUri?: string) => Promise<void>;
  toggleShuffle: (shuffle: boolean) => Promise<void>;
  toggleRepeat: (repeat: 'track' | 'context' | 'off') => Promise<void>;
}

export const SpotifyPlayerContext = createContext<SpotifyPlayerContextType | null>(null);

export const SpotifyPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const spotifyPlayer = useSpotifyPlayer();

  return (
    <SpotifyPlayerContext.Provider value={spotifyPlayer}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};

export const useSpotifyPlayerContext = () => {
  const context = useContext(SpotifyPlayerContext);
  if (!context) {
    throw new Error('useSpotifyPlayerContext must be used within a SpotifyPlayerProvider');
  }
  return context;
};
