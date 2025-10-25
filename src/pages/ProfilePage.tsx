import { useAuthStore } from '@/store/authStore';
import { useSpotifyIntegration } from '@/hooks/useSpotifyIntegration';
import { PageHeader } from '@/components/PageHeader';
import { useImageCache } from '@/hooks/useImageCache';

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

  // Use o hook de cache de imagens
  const { imageUrl, isLoading } = useImageCache(
    getUserImageUrl(),
    'user'
  );

  const handleLogout = () => {
    disconnect();
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <PageHeader 
        title="Perfil" 
        description="Suas informações pessoais"
      />

      {/* Conteúdo central */}
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          {/* Avatar */}
          <div className="mb-8">
            {isLoading ? (
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto animate-pulse flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={authUser?.display_name}
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Nome do usuário */}
          <h1 className="text-white text-3xl font-bold mb-8">
            {authUser?.display_name || 'Usuário'}
          </h1>

          {/* Botão de logout */}
          <button
            onClick={handleLogout}
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}