import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/lib/utils'; // opcional, se você já usa shadcn/ui

interface SpotifyConnectionStatusProps {
  className?: string;
}

export function SpotifyConnectionStatus({ className }: SpotifyConnectionStatusProps) {
  const isOnline = useOnlineStatus();

  const color = isOnline ? 'green' : 'red';
  const statusText = isOnline ? 'Online' : 'Offline';
  const pulseClass = isOnline ? 'animate-pulse' : '';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(`w-3 h-3 rounded-full bg-${color}-500`, pulseClass)} />
      <span className={cn(`text-sm font-medium text-${color}-400`)}>{statusText}</span>
    </div>
  );
}
