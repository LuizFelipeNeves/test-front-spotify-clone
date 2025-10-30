import React from 'react';
import SpotifyLogo from '@/components/shared/branding/SpotifyLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export function AuthLayout({ children, className = '', description }: AuthLayoutProps) {
  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-black text-white ${className}`}>
      <div className="flex flex-col items-center space-y-6">
        <SpotifyLogo size="md" />
        {description && (
            <p className="text-sm sm:text-base text-center font-medium">
              {description}
            </p>
          )}

        <div>{children}</div>
      </div>
    </div>
  );
}
