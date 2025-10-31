// contexts/SpotifyPlayerContext.tsx
import React from 'react';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { SpotifyPlayerContext } from './SpotifyPlayerContext.context';

export const SpotifyPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const spotifyPlayer = useSpotifyPlayer();

  return (
    <SpotifyPlayerContext.Provider value={spotifyPlayer}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};
