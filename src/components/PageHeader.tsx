import type { ReactNode } from 'react';
import { SpotifyConnectionStatus } from './SpotifyConnectionStatus';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: ReactNode;
  showSpotifyStatus?: boolean;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  actionButton, 
  showSpotifyStatus = true,
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={`mb-8 px-2 sm:px-0 ${className}`}>
      {/* Spotify Connection Status */}
      {showSpotifyStatus && (
        <div className="mb-4 flex justify-end px-2 sm:px-0">
          <SpotifyConnectionStatus />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3">{title}</h1>
          {description && (
            <p className="text-gray-400 text-xs sm:text-sm lg:text-base xl:text-lg">{description}</p>
          )}
        </div>
        
        {actionButton && (
          <div className="flex-shrink-0 self-start mt-1">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}