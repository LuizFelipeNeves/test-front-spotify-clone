import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { spotifyService } from '@/services/spotify.service';
import { AuthService } from '@/services/auth.service';
import SpotifyLogo from '@/components/SpotifyLogo';

const CallbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
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

        // Configurar o token no serviço da API
        localStorage.setItem('spotify_access_token', access_token);
        if (refresh_token) {
          localStorage.setItem('spotify_refresh_token', refresh_token);
        }

        // Buscar dados do usuário
        const userData = await spotifyService.getUserProfile();

        // Fazer login no store
        login(access_token, refresh_token, userData);

        // Redirecionar para a página principal
        window.location.href = '/';
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setLoading(false);
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

        <button
          onClick={() => window.location.href = '/login'}
          className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-8 rounded-full text-lg transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return null;
};

export default CallbackPage;