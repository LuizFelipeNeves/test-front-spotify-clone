import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { spotifyService } from '@/services/spotify.service';

// Query keys para organização
export const spotifyQueryKeys = {
  topArtists: (limit?: number, offset?: number) =>
    ['topArtists', limit, offset] as const,
  userPlaylists: (limit?: number, offset?: number) =>
    ['userPlaylists', limit, offset] as const,
  artist: (artistId: string) => ['artist', artistId] as const,
  artistAlbums: (artistId: string, limit?: number, offset?: number) =>
    ['artistAlbums', artistId, limit, offset] as const,
  artistTopTracks: (artistId: string) => ['artistTopTracks', artistId] as const,
  playlist: (playlistId: string) => ['playlist', playlistId] as const,
  playlistTracks: (playlistId: string, limit?: number, offset?: number) =>
    ['playlistTracks', playlistId, limit, offset] as const,
};

// Hook para buscar top artists
export function useTopArtists(limit = 20, offset = 0) {
  return useQuery({
    queryKey: spotifyQueryKeys.topArtists(limit, offset),
    queryFn: () => spotifyService.getTopArtists(limit, offset),
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
}

// Hook para infinite scroll de top artists
export function useInfiniteTopArtists(limit = 20) {
  return useInfiniteQuery({
    queryKey: ['topArtists', 'infinite', limit],
    queryFn: ({ pageParam = 0 }) =>
      spotifyService.getTopArtists(limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit;
      return lastPage.next ? nextOffset : undefined;
    },
    initialPageParam: 0,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// Hook para buscar playlists do usuário
export function useUserPlaylists(limit = 50, offset = 0) {
  return useQuery({
    queryKey: spotifyQueryKeys.userPlaylists(limit, offset),
    queryFn: () => spotifyService.getUserPlaylists(limit, offset),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 20 * 60 * 1000, // 20 minutos
  });
}

// Hook para infinite scroll de playlists
export function useInfiniteUserPlaylists(limit = 50) {
  return useInfiniteQuery({
    queryKey: ['userPlaylists', 'infinite', limit],
    queryFn: ({ pageParam = 0 }) =>
      spotifyService.getUserPlaylists(limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit;
      return lastPage.next ? nextOffset : undefined;
    },
    initialPageParam: 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}

// Hook para buscar dados de um artista específico
export function useArtist(artistId: string) {
  return useQuery({
    queryKey: spotifyQueryKeys.artist(artistId),
    queryFn: () => spotifyService.getArtist(artistId),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 20 * 60 * 1000, // 20 minutos
    enabled: !!artistId, // Só executa se artistId existir
  });
}

// Hook para buscar álbuns de um artista
export function useArtistAlbums(artistId: string, limit = 20, offset = 0) {
  return useQuery({
    queryKey: spotifyQueryKeys.artistAlbums(artistId, limit, offset),
    queryFn: () => spotifyService.getArtistAlbums(artistId, limit, offset),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    enabled: !!artistId,
  });
}

// Hook para infinite scroll de álbuns de artista
export function useInfiniteArtistAlbums(artistId: string, limit = 20) {
  return useInfiniteQuery({
    queryKey: ['artistAlbums', 'infinite', artistId, limit],
    queryFn: ({ pageParam = 0 }) =>
      spotifyService.getArtistAlbums(artistId, limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit;
      return lastPage.next ? nextOffset : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!artistId,
  });
}

// Hook para buscar uma playlist específica
export function usePlaylist(playlistId: string) {
  return useQuery({
    queryKey: spotifyQueryKeys.playlist(playlistId),
    queryFn: () => spotifyService.getPlaylist(playlistId),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    enabled: !!playlistId,
  });
}

// Hook para buscar top tracks de um artista
export function useArtistTopTracks(artistId: string) {
  return useQuery({
    queryKey: spotifyQueryKeys.artistTopTracks(artistId),
    queryFn: () => spotifyService.getArtistTopTracks(artistId),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 20 * 60 * 1000, // 20 minutos
    enabled: !!artistId,
  });
}

// Hook para buscar tracks de uma playlist
export function usePlaylistTracks(playlistId: string, limit = 50, offset = 0) {
  return useQuery({
    queryKey: spotifyQueryKeys.playlistTracks(playlistId, limit, offset),
    queryFn: () => spotifyService.getPlaylistTracks(playlistId, limit, offset),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    enabled: !!playlistId,
  });
}
