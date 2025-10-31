import { createContext } from 'react';
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