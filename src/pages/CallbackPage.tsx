import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { spotifyService } from '@/services/spotify.service';
import { AuthService } from '@/services/auth.service';
import { AuthLayout, Button } from '@/components';
import { LoadingSpinner } from '@/components';
import { UI_TEXTS } from '@/constants/ui';

const CallbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevenir execução dupla (React StrictMode em desenvolvimento)
      if (hasProcessed.current) {
        return;
      }
      hasProcessed.current = true;

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`Spotify authentication error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Spotify');
        }

        // Trocar o código por tokens de acesso
        const tokenData = await AuthService.exchangeCodeForTokens(code);
        const { access_token, refresh_token } = tokenData;

        // Primeiro configurar os tokens no store para que o apiClient possa usá-los
        const { setTokens } = useAuthStore.getState();
        setTokens(access_token, refresh_token);

        // Agora buscar dados do usuário (com o token já configurado)
        const userData = await spotifyService.getUserProfile();

        // Fazer login completo no store (que automaticamente salva no localStorage)
        login(access_token, refresh_token, userData);

        // Redirecionar para a página principal
        window.location.href = '/';
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setLoading(false);
        // Reset em caso de erro para permitir nova tentativa
        hasProcessed.current = false;
      }
    };

    handleCallback();
  }, [login]);

  if (loading) {
    return (
      <AuthLayout description={UI_TEXTS.processandoAutenticacao}>
        <LoadingSpinner message="" />
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout>
        <div className="text-center">
          <p className="text-red-400 text-lg mb-6">
            {UI_TEXTS.erroNaAutenticacao} {error}
          </p>

          <Button
            onClick={() => window.location.href = '/login'}
            variant="spotify"
            size="lg"
            className="w-full"
          >
            {UI_TEXTS.tentarNovamente}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return null;
};

export default CallbackPage;