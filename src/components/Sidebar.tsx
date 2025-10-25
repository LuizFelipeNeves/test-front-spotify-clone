import { Home, Users, Play, User, Download, Check, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SpotifyLogo from './SpotifyLogo';
import { ROUTES } from '@/utils/constants';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className = '', isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const { isInstallable, isInstalled, isInstalling, install, error } = usePWAInstall();

  // Função para determinar se a rota está ativa
  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };

  // Função para obter classes CSS baseadas no estado ativo
  const getNavItemClasses = (route: string) => {
    const baseClasses = "flex items-center gap-4 cursor-pointer transition-colors";
    const activeClasses = "text-white";
    const inactiveClasses = "text-gray-400 hover:text-gray-300";
    
    return `${baseClasses} ${isActiveRoute(route) ? activeClasses : inactiveClasses}`;
  };

  // Função para lidar com cliques nos links em mobile
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`
      w-64 bg-black border-r border-gray-900 p-6 flex flex-col h-full
      fixed md:static top-0 left-0 
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
      ${className}
    `}>
      {/* Logo e Navigation */}
      <div className="flex-1">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12 py-4">
          <SpotifyLogo size="lg" showText />
        </div>

        {/* Navigation */}
        <nav className="space-y-6">
          <Link 
            to={ROUTES.HOME} 
            className={getNavItemClasses(ROUTES.HOME)}
            onClick={handleLinkClick}
          >
            <Home size={24} />
            <span className="text-base font-medium">Home</span>
          </Link>
          
          <Link 
            to={ROUTES.ARTISTS} 
            className={getNavItemClasses(ROUTES.ARTISTS)}
            onClick={handleLinkClick}
          >
            <Users size={24} />
            <span className="text-base font-medium">Artistas</span>
          </Link>
          
          <Link 
            to={ROUTES.PLAYLISTS} 
            className={getNavItemClasses(ROUTES.PLAYLISTS)}
            onClick={handleLinkClick}
          >
            <Play size={24} />
            <span className="text-base font-medium">Playlists</span>
          </Link>
          
          <Link 
            to={ROUTES.PROFILE} 
            className={getNavItemClasses(ROUTES.PROFILE)}
            onClick={handleLinkClick}
          >
            <User size={24} />
            <span className="text-base font-medium">Perfil</span>
          </Link>
        </nav>
      </div>

      {/* PWA Install Button - Fixo no final */}
      {(isInstallable || isInstalled) && (
        <div className="mt-6">
          <button 
            onClick={install}
            disabled={isInstalling || isInstalled}
            className={`flex items-center gap-3 transition-colors ${
              isInstalled 
                ? 'text-green-400 cursor-default' 
                : isInstalling 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-white hover:text-gray-300'
            }`}
            aria-label={
              isInstalled 
                ? 'PWA já instalado' 
                : isInstalling 
                  ? 'Instalando PWA...' 
                  : 'Instalar PWA'
            }
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isInstalled 
                ? 'bg-green-900/50' 
                : 'bg-gray-800'
            }`}>
              {isInstalling ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isInstalled ? (
                <Check className="w-5 h-5" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </div>
            <span className="text-base font-medium">
              {isInstalled 
                ? 'PWA Instalado' 
                : isInstalling 
                  ? 'Instalando...' 
                  : 'Instalar PWA'
              }
            </span>
          </button>
          {error && (
            <p className="text-red-400 text-sm mt-2 px-2" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}