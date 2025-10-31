import { useState, useEffect, useCallback, useRef } from 'react';

// Type para setTimeout no Node.js vs browser
type Timeout = ReturnType<typeof setTimeout>;
import { imageCacheService } from '../services/imageCache.service';

interface UseImageCacheOptions {
  fallbackUrl?: string;
  preload?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseImageCacheReturn {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
  preloadImage: () => Promise<void>;
}

export function useImageCache(
  originalUrl: string | null | undefined,
  type: 'artist' | 'playlist' | 'user',
  options: UseImageCacheOptions = {}
): UseImageCacheReturn {
  const {
    fallbackUrl,
    preload = false,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<Timeout | null>(null);

  const loadImage = useCallback(async (url: string, attempt = 0): Promise<void> => {
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      // Cancelar requisição anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      // Primeiro, tentar obter da cache
      const cachedUrl = await imageCacheService.getCachedImageUrl(url, type);
      
      if (cachedUrl) {
        setImageUrl(cachedUrl);
        setIsLoading(false);
        return;
      }

      // Se não estiver em cache, fazer cache da imagem
      const newCachedUrl = await imageCacheService.cacheImage(url, type);
      
      // Verificar se a operação não foi cancelada
      if (!abortControllerRef.current?.signal.aborted) {
        setImageUrl(newCachedUrl);
        setIsLoading(false);
      }
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return; // Operação cancelada, não fazer nada
      }

      console.warn('Failed to load/cache image:', url, err);
      
      if (attempt < retryAttempts) {
        // Retry com delay exponencial
        const delay = retryDelay * Math.pow(2, attempt);
        timeoutRef.current = setTimeout(() => {
          loadImage(url, attempt + 1);
        }, delay);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load image');
        setImageUrl(fallbackUrl || url); // Fallback para URL original
        setIsLoading(false);
      }
    }
  }, [type, retryAttempts, retryDelay, fallbackUrl]);

  const retry = useCallback(() => {
    if (originalUrl) {
      loadImage(originalUrl);
    }
  }, [originalUrl, loadImage]);

  const preloadImage = useCallback(async (): Promise<void> => {
    if (!originalUrl) return;
    
    try {
      await imageCacheService.cacheImage(originalUrl, type);
    } catch (err) {
      console.warn('Failed to preload image:', originalUrl, err);
    }
  }, [originalUrl, type]);

  useEffect(() => {
    if (originalUrl) {
      if (preload) {
        // Para preload, não atualizar o estado, apenas fazer cache
        preloadImage();
      } else {
        loadImage(originalUrl);
      }
    } else {
      setImageUrl(null);
      setIsLoading(false);
      setError(null);
    }

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [originalUrl, loadImage, preload, preloadImage]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Revogar URLs de blob para liberar memória
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return {
    imageUrl,
    isLoading,
    error,
    retry,
    preloadImage
  };
}

// Hook para preload em lote
export function useImagePreloader() {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  const preloadImages = useCallback(async (
    images: Array<{ url: string; type: 'artist' | 'playlist' | 'user' }>
  ): Promise<void> => {
    if (images.length === 0) return;

    setIsPreloading(true);
    setPreloadProgress(0);

    try {
      const promises = images.map(async ({ url, type }, index) => {
        try {
          await imageCacheService.cacheImage(url, type);
          setPreloadProgress((index + 1) / images.length * 100);
        } catch (error) {
          console.warn('Failed to preload image:', url, error);
        }
      });

      await Promise.allSettled(promises);
    } finally {
      setIsPreloading(false);
      setPreloadProgress(100);
    }
  }, []);

  return {
    preloadImages,
    isPreloading,
    preloadProgress
  };
}

// Hook para estatísticas do cache
export function useImageCacheStats() {
  const [stats, setStats] = useState<{
    totalImages: number;
    totalSize: number;
    sizeByType: Record<string, number>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const cacheStats = await imageCacheService.getCacheStats();
      setStats(cacheStats);
    } catch (error) {
      console.error('Failed to get cache stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(async () => {
    try {
      await imageCacheService.clearCache();
      await refreshStats();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }, [refreshStats]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    stats,
    isLoading,
    refreshStats,
    clearCache
  };
}