import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { spotifyService } from '@/services/spotify.service';

export const useFavorites = (trackId?: string) => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  // Query para verificar se a faixa está favoritada
  const {
    data: isFavorited = false,
    isLoading: isCheckingFavorite,
    error: favoriteError,
  } = useQuery({
    queryKey: ['track-favorite', trackId],
    queryFn: async () => {
      if (!trackId || !accessToken) return false;

      const [isFavorited] = await spotifyService.checkTracksFavorites([trackId]);
      return isFavorited;
    },
    enabled: !!trackId && !!accessToken,
    staleTime: 30000, // 30 segundos
    gcTime: 300000, // 5 minutos (gcTime é o novo nome para cacheTime)
  });

  // Mutation para adicionar/remover favoritos
  const favoriteMutation = useMutation({
    mutationFn: async (isCurrentlyFavorited: boolean) => {
      if (!trackId || !accessToken) {
        throw new Error('Track ID or access token missing');
      }

      if (isCurrentlyFavorited) {
        await spotifyService.removeTracksFavorites([trackId]);
        return false;
      } else {
        await spotifyService.addTracksFavorites([trackId]);
        return true;
      }
    },
    onMutate: async (isCurrentlyFavorited) => {
      // Cancelar qualquer query em andamento
      await queryClient.cancelQueries({ queryKey: ['track-favorite', trackId] });

      // Snapshot do estado anterior
      const previousState = queryClient.getQueryData(['track-favorite', trackId]);

      // Update otimista
      queryClient.setQueryData(['track-favorite', trackId], !isCurrentlyFavorited);

      return { previousState };
    },
    onError: (error, _isCurrentlyFavorited, context) => {
      // Reverter para estado anterior em caso de erro
      if (context?.previousState !== undefined) {
        queryClient.setQueryData(['track-favorite', trackId], context.previousState);
      }
      console.error('❌ Error toggling favorite:', error);
    },
    onSuccess: (newState) => {
      console.log(`✅ Successfully ${newState ? 'added to' : 'removed from'} favorites`);

      // Atualizar o cache com o novo estado
      queryClient.setQueryData(['track-favorite', trackId], newState);

      // Invalidar queries relacionadas para sincronizar outras instâncias
      queryClient.invalidateQueries({
        queryKey: ['track-favorite'],
        refetchType: 'active'
      });
    },
  });

  const toggleFavorite = () => {
    if (isFavorited !== undefined) {
      console.log('🔄 Toggle favorite called - current state:', isFavorited);
      favoriteMutation.mutate(isFavorited);
    }
  };

  // Debug: monitor state changes
  useEffect(() => {
    console.log('🎯 useFavorites - isFavorited changed to:', isFavorited);
  }, [isFavorited]);

  return {
    isFavorited,
    isLoading: isCheckingFavorite || favoriteMutation.isPending,
    error: favoriteError || favoriteError,
    toggleFavorite,
    isPending: favoriteMutation.isPending,
  };
};