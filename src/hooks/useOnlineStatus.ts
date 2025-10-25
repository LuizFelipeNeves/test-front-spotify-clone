import { useState, useEffect } from 'react';

/**
 * Hook para verificar o status de conectividade com a internet
 * @returns boolean - true se estiver online, false se estiver offline
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Adiciona listeners para eventos de mudança de conectividade
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup: remove listeners quando o componente for desmontado
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}