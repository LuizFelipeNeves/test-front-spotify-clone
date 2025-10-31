import { useAuthStore } from '@/store/authStore';
import { useSpotifyIntegration } from '@/hooks/useSpotifyIntegration';
import { PageHeader, Button } from '@/components';
import { UserAvatar } from '@/components/shared/media/UserAvatar';
import { UI_TEXTS } from '@/constants/ui';

export default function ProfilePage() {
  const { user: authUser } = useAuthStore();
  const { disconnect } = useSpotifyIntegration();

  // Função para obter a URL da imagem do usuário
  const getUserImageUrl = () => {
    if (authUser?.images && authUser.images.length > 0) {
      return authUser.images[0].url;
    }
    return null;
  };

  const handleLogout = () => {
    disconnect();
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <PageHeader title="Perfil" description="Suas informações pessoais" />

      {/* Conteúdo central */}
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          {/* Avatar */}
          <UserAvatar
            imageUrl={getUserImageUrl()}
            displayName={authUser?.display_name}
            size="lg"
          />

          {/* Nome do usuário */}
          <h1 className="text-white text-3xl font-bold mb-8">
            {authUser?.display_name || 'Usuário'}
          </h1>

          {/* Botão de logout */}
          <Button onClick={handleLogout} variant="spotify" size="lg">
            {UI_TEXTS.sair}
          </Button>
        </div>
      </div>
    </div>
  );
}
