import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Play, User } from 'lucide-react';
import { Sidebar } from './Sidebar';
import MusicPlayerBar from './MusicPlayerBar';
import { ROUTES } from '@/utils/constants';

interface LayoutProps {
  children?: ReactNode;
  className?: string;
}

export function Layout({ children, className = '' }: LayoutProps) {
  const location = useLocation();

  return (
    <div className={`flex h-screen bg-black text-white ${className}`}>
      {/* Sidebar - Apenas desktop */}
      <Sidebar className="hidden md:flex" />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto md:ml-0">
        <div className="pt-4 md:pt-0 pb-[8.5rem] md:pb-20">
          {children}
        </div>
      </main>

      {/* Music Player Bar */}
      <MusicPlayerBar />

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-3 py-1.5 z-50 md:hidden">
        <div className="flex items-center justify-around">
          <Link
            to={ROUTES.HOME}
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-colors ${
              location.pathname === ROUTES.HOME
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home size={19} />
            <span className="text-[10px] leading-none">Home</span>
          </Link>

          <Link
            to={ROUTES.ARTISTS}
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-colors ${
              location.pathname === ROUTES.ARTISTS
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users size={19} />
            <span className="text-[10px] leading-none">Artistas</span>
          </Link>

          <Link
            to={ROUTES.PLAYLISTS}
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-colors ${
              location.pathname === ROUTES.PLAYLISTS
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Play size={19} />
            <span className="text-[10px] leading-none">Playlists</span>
          </Link>

          <Link
            to={ROUTES.PROFILE}
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-colors ${
              location.pathname === ROUTES.PROFILE
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User size={19} />
            <span className="text-[10px] leading-none">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Layout;