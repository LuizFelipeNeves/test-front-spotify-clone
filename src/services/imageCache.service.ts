interface CachedImage {
  id: string;
  url: string;
  blob: Blob;
  timestamp: number;
  type: 'artist' | 'playlist' | 'user';
  expiresAt: number;
}

class ImageCacheService {
  private dbName = 'spotify-image-cache';
  private dbVersion = 1;
  private storeName = 'images';
  private db: IDBDatabase | null = null;
  private maxCacheSize = 100 * 1024 * 1024; // 100MB
  private cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 7 dias

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  private generateCacheKey(url: string, type: string): string {
    return `${type}_${btoa(url).replace(/[^a-zA-Z0-9]/g, '')}`;
  }

  async cacheImage(url: string, type: 'artist' | 'playlist' | 'user'): Promise<string> {
    if (!this.db) await this.init();

    const cacheKey = this.generateCacheKey(url, type);
    
    // Verificar se já está em cache e não expirou
    const cached = await this.getCachedImage(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return URL.createObjectURL(cached.blob);
    }

    try {
      // Fazer download da imagem
      const response = await fetch(url, {
        mode: 'cors',
        cache: 'force-cache'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Verificar se é uma imagem válida
      if (!blob.type.startsWith('image/')) {
        throw new Error('Invalid image type');
      }

      const now = Date.now();
      const cachedImage: CachedImage = {
        id: cacheKey,
        url,
        blob,
        timestamp: now,
        type,
        expiresAt: now + this.cacheExpiry
      };

      // Salvar no cache
      await this.saveCachedImage(cachedImage);
      
      // Limpar cache se necessário
      await this.cleanupCache();

      return URL.createObjectURL(blob);
    } catch (error) {
      console.warn('Failed to cache image:', url, error);
      return url; // Fallback para URL original
    }
  }

  private async getCachedImage(id: string): Promise<CachedImage | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  private async saveCachedImage(cachedImage: CachedImage): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(cachedImage);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getCachedImageUrl(url: string, type: 'artist' | 'playlist' | 'user'): Promise<string | null> {
    if (!this.db) await this.init();

    const cacheKey = this.generateCacheKey(url, type);
    const cached = await this.getCachedImage(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return URL.createObjectURL(cached.blob);
    }

    return null;
  }

  async preloadImages(urls: Array<{ url: string; type: 'artist' | 'playlist' | 'user' }>): Promise<void> {
    const promises = urls.map(({ url, type }) => 
      this.cacheImage(url, type).catch(error => 
        console.warn('Failed to preload image:', url, error)
      )
    );

    await Promise.allSettled(promises);
  }

  private async cleanupCache(): Promise<void> {
    if (!this.db) return;

    const now = Date.now();
    
    // Remover imagens expiradas
    await this.removeExpiredImages(now);
    
    // Verificar tamanho do cache
    const cacheSize = await this.getCacheSize();
    
    if (cacheSize > this.maxCacheSize) {
      await this.removeOldestImages();
    }
  }

  private async removeExpiredImages(now: number): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('expiresAt');
      const range = IDBKeyRange.upperBound(now);
      const request = index.openCursor(range);

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  private async getCacheSize(): Promise<number> {
    if (!this.db) return 0;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const images = request.result as CachedImage[];
        const totalSize = images.reduce((size, img) => size + img.blob.size, 0);
        resolve(totalSize);
      };
    });
  }

  private async removeOldestImages(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      const request = index.openCursor();

      let removedSize = 0;
      const targetRemoval = this.maxCacheSize * 0.2; // Remove 20% do cache

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && removedSize < targetRemoval) {
          const image = cursor.value as CachedImage;
          removedSize += image.blob.size;
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  async clearCache(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getCacheStats(): Promise<{
    totalImages: number;
    totalSize: number;
    sizeByType: Record<string, number>;
  }> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const images = request.result as CachedImage[];
        const stats = {
          totalImages: images.length,
          totalSize: 0,
          sizeByType: {} as Record<string, number>
        };

        images.forEach(img => {
          stats.totalSize += img.blob.size;
          stats.sizeByType[img.type] = (stats.sizeByType[img.type] || 0) + img.blob.size;
        });

        resolve(stats);
      };
    });
  }
}

export const imageCacheService = new ImageCacheService();