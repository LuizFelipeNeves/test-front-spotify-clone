import { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';

interface PWAUpdateNotificationProps {
  onUpdate?: () => void;
}

export function PWAUpdateNotification({ onUpdate }: PWAUpdateNotificationProps) {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Verifica se há um service worker registrado
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Recarrega a página quando um novo service worker assume o controle
        window.location.reload();
      });

      // Escuta por atualizações do service worker
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nova versão disponível
                setShowUpdate(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration.waiting) {
          // Envia mensagem para o service worker para pular a espera
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }
      
      onUpdate?.();
    } catch (error) {
      console.error('Erro ao atualizar PWA:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <RefreshCw className="w-5 h-5 text-green-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white">
              Nova versão disponível
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              Uma nova versão do app está disponível. Atualize para obter as últimas funcionalidades.
            </p>
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white text-sm font-medium rounded transition-colors"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  'Atualizar'
                )}
              </button>
              
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Depois
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            aria-label="Fechar notificação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}