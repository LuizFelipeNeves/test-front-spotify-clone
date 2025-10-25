import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface SpotifyConnectionStatusProps {
  className?: string;
}

export function SpotifyConnectionStatus({ className = '' }: SpotifyConnectionStatusProps) {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-400 text-sm font-medium">Online</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      <span className="text-red-400 text-sm">Offline</span>
    </div>
  );
}