import { useAuthStore } from '@/store/authStore';
import { AuthService } from '@/services/auth.service';
import { SpotifyLogo } from '@/components';
import { UI_TEXTS } from '@/constants/ui';

const LoginPage = () => {
  const { isAuthenticated } = useAuthStore();

  const handleSpotifyLogin = () => {
    AuthService.redirectToSpotifyAuth();
  };

  // Se já estiver autenticado, redirecionar para a página principal
  if (isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center px-6">
      <SpotifyLogo size="md" className="mb-8" />

      <p className="text-white text-center mb-8 text-lg">
        {UI_TEXTS.entrarComSpotify}
      </p>

      <button
        onClick={handleSpotifyLogin}
        className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-16 rounded-full text-lg transition-colors"
      >
        {UI_TEXTS.entrar}
      </button>
    </div>
  );
};

export default LoginPage;