import { Home, Users, Play, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SpotifyLogo from './SpotifyLogo';
import { ROUTES } from '@/utils/constants';

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className = '', isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();

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
      <div className="mt-6">
        <button className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <span className="text-base font-medium">Instalar PWA</span>
        </button>
      </div>
    </div>
  );
}