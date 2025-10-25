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
    <div className={`mb-8 ${className}`}>
      {/* Spotify Connection Status */}
      {showSpotifyStatus && (
        <div className="mb-4 flex justify-end">
          <SpotifyConnectionStatus />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-4xl font-bold mb-3">{title}</h1>
          {description && (
            <p className="text-gray-400 text-lg">{description}</p>
          )}
        </div>
        
        {actionButton && (
          <div className="flex-shrink-0">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}