import { useAuthStore } from '@/store/authStore';
import { AuthService } from '@/services/auth.service';
import { AuthLayout, Button } from '@/components';
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
    <AuthLayout description={UI_TEXTS.entrarComSpotify}>
      <Button
        onClick={handleSpotifyLogin}
        variant="spotify"
        size="lg"
        className="w-full"
      >
        {UI_TEXTS.entrar}
      </Button>
    </AuthLayout>
  );
};

export default LoginPage;