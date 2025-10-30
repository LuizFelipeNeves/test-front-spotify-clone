import { Home, Users, Play, User, Download, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SpotifyLogo } from '@/components';
import { ROUTES } from '@/utils/constants';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const { isInstallable, isInstalled, isInstalling, isLoading, install, error } = usePWAInstall();

  const navItems = [
    { label: 'Home', icon: Home, route: ROUTES.HOME },
    { label: 'Artistas', icon: Users, route: ROUTES.ARTISTS },
    { label: 'Playlists', icon: Play, route: ROUTES.PLAYLISTS },
    { label: 'Perfil', icon: User, route: ROUTES.PROFILE },
  ];

  const isActiveRoute = (route: string) => location.pathname === route;

  return (
    <aside
      className={cn(
        'w-64 bg-black border-r border-gray-900 p-6 flex flex-col h-full fixed md:static top-0 left-0 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-12 py-4">
        <SpotifyLogo size="lg" showText />
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-6">
        {navItems.map(({ label, icon: Icon, route }) => (
          <Link
            key={route}
            to={route}
            onClick={onClose}
            data-testid={`nav-${label.toLowerCase()}`}
            className={cn(
              'flex items-center gap-4 cursor-pointer transition-colors text-base font-medium',
              isActiveRoute(route)
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            <Icon size={24} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Botão de instalação do PWA */}
      {!isLoading && isInstallable && !isInstalled && (
        <div className="mt-6">
          <button
            onClick={install}
            disabled={isInstalling}
            aria-label={isInstalling ? 'Instalando PWA...' : 'Instalar PWA'}
            className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              {isInstalling ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </div>
            <span className="text-base font-medium">
              {isInstalling ? 'Instalando...' : 'Instalar PWA'}
            </span>
          </button>

          {error && (
            <p className="text-red-400 text-sm mt-2 px-2" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
