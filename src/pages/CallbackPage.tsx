import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { spotifyService } from '@/services/spotify.service';
import { AuthService } from '@/services/auth.service';
import SpotifyLogo from '@/components/SpotifyLogo';
import { Button } from '@/components/ui/Button';

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
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center px-6">
        <div className="animate-pulse">
          <SpotifyLogo size="md" className="mb-8" />
        </div>

        <p className="text-white text-center text-lg">
          Processando autenticação...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center px-6">
        <SpotifyLogo size="md" className="mb-8" />

        <p className="text-red-400 text-center text-lg mb-4">
          Erro na autenticação: {error}
        </p>

        <Button
          onClick={() => window.location.href = '/login'}
          className="font-bold py-3 px-8 rounded-full text-lg"
          variant="spotify"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return null;
};

export default CallbackPage;