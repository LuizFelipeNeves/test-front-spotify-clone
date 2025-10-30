import { useState, useEffect, useCallback } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UI_TEXTS } from '@/constants/ui';

interface PWAUpdateNotificationProps {
  onUpdate?: () => void;
}

export function PWAUpdateNotification({ onUpdate }: PWAUpdateNotificationProps) {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleControllerChange = () => window.location.reload();

    const handleUpdateFound = (registration: ServiceWorkerRegistration) => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          setShowUpdate(true);
        }
      });
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => handleUpdateFound(registration));
    });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const handleUpdate = useCallback(async () => {
    setIsUpdating(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      onUpdate?.();
    } catch (error) {
      console.error('Erro ao atualizar PWA:', error);
      setIsUpdating(false);
    }
  }, [onUpdate]);

  const handleDismiss = useCallback(() => {
    setShowUpdate(false);
  }, []);

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-green-400 flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white">{UI_TEXTS.novaVersaoDisponivel}</h3>
            <p className="text-sm text-gray-300 mt-1">
              {UI_TEXTS.novaVersaoDescricao}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium text-white transition-colors',
                  'bg-green-600 hover:bg-green-700 disabled:bg-green-800'
                )}
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {UI_TEXTS.atualizando}
                  </>
                ) : (
                  UI_TEXTS.atualizar
                )}
              </button>

              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {UI_TEXTS.depois}
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Fechar notificação"
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
