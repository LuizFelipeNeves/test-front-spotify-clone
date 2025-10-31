import { useContext } from 'react';
import { SpotifyPlayerContext } from './SpotifyPlayerContext.context';

export const useSpotifyPlayerContext = () => {
  const context = useContext(SpotifyPlayerContext);
  if (!context) {
    throw new Error(
      'useSpotifyPlayerContext must be used within a SpotifyPlayerProvider'
    );
  }
  return context;
};
