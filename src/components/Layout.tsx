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

const mobileNavItems = [
  { to: ROUTES.HOME, label: 'Home', icon: Home },
  { to: ROUTES.ARTISTS, label: 'Artistas', icon: Users },
  { to: ROUTES.PLAYLISTS, label: 'Playlists', icon: Play },
  { to: ROUTES.PROFILE, label: 'Perfil', icon: User },
];

export function Layout({ children, className = '' }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`flex h-screen bg-black text-white ${className}`}>
      {/* Sidebar (Desktop only) */}
      <Sidebar className="hidden md:flex" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:ml-0">
        <div className="pt-4 md:pt-0 pb-[8.5rem] md:pb-20">
          {children}
        </div>
      </main>

      {/* Music Player */}
      <MusicPlayerBar />

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-3 py-1.5 z-50 md:hidden">
        <div className="flex items-center justify-around">
          {mobileNavItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-colors ${
                isActive(to)
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={19} />
              <span className="text-[10px] leading-none">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Layout;
