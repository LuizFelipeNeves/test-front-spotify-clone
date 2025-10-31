import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SpotifyPlayerContext } from '@/contexts/SpotifyPlayerContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error: any) => {
        // Não tenta novamente se for erro de rede (offline)
        if (error?.message?.includes('Failed to fetch') || !navigator.onLine) {
          return false;
        }
        // Não tenta novamente se for erro 401 (não autorizado)
        if (error?.status === 401) {
          return false;
        }
        // Tenta até 3 vezes para outros erros
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      // Reativa queries quando volta online
      refetchOnReconnect: true,
      // Não faz retry automático quando offline
      networkMode: 'online',
    },
  },
})

export const MockSpotifyPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockContext = {
    player: null,
    deviceId: null,
    isReady: true,
    play: async () => {},
    pause: async () => {},
    togglePlay: async () => {},
    nextTrack: async () => {},
    previousTrack: async () => {},
    seek: () => {},
    setVolume: () => {},
    playTrack: async () => {},
    toggleShuffle: async () => {},
    toggleRepeat: async () => {},
  };

  return (
    <QueryClientProvider client={queryClient}>
    <SpotifyPlayerContext.Provider value={mockContext}>
      {children}
    </SpotifyPlayerContext.Provider>
    </QueryClientProvider>
  );
};
