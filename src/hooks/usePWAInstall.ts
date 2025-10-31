import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  isLoading: boolean;
  error: string | null;
}

interface PWAInstallActions {
  install: () => Promise<void>;
  checkInstallStatus: () => void;
}

export function usePWAInstall(): PWAInstallState & PWAInstallActions {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [state, setState] = useState<PWAInstallState>({
    isInstallable: false,
    isInstalled: false,
    isInstalling: false,
    isLoading: true,
    error: null,
  });

  // Verifica se o PWA já está instalado
  const checkInstallStatus = useCallback(() => {
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    const isInWebAppiOS =
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true;
    const isInstalled = isStandalone || isInWebAppiOS;

    setState(prev => ({ ...prev, isInstalled, isLoading: false }));
  }, []);

  useEffect(() => {
    // Adiciona um pequeno delay para evitar flickering inicial
    const timer = setTimeout(() => {
      checkInstallStatus();
    }, 100);

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setState(prev => ({
        ...prev,
        isInstallable: true,
        isLoading: false,
        error: null,
      }));
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setState(prev => ({
        ...prev,
        isInstallable: false,
        isInstalled: true,
        isInstalling: false,
        error: null,
      }));
    };

    // Listener para mudanças no display mode
    const handleDisplayModeChange = () => {
      checkInstallStatus();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Monitora mudanças no display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [checkInstallStatus]);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      setState(prev => ({
        ...prev,
        error:
          'Instalação não disponível. O PWA pode já estar instalado ou o navegador não suporta instalação.',
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isInstalling: true, error: null }));

      // Mostra o prompt de instalação
      await deferredPrompt.prompt();

      // Aguarda a escolha do usuário
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('PWA instalado com sucesso!');
      } else {
        console.log('Instalação do PWA cancelada pelo usuário');
        setState(prev => ({ ...prev, isInstalling: false }));
      }

      setDeferredPrompt(null);
      setState(prev => ({ ...prev, isInstallable: false }));
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      setState(prev => ({
        ...prev,
        isInstalling: false,
        error:
          error instanceof Error ? error.message : 'Erro ao instalar o PWA',
      }));
    }
  }, [deferredPrompt]);

  return {
    ...state,
    install,
    checkInstallStatus,
  };
}
