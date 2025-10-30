import React from 'react';
import SpotifyLogo from '@/components/shared/branding/SpotifyLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showLogo?: boolean;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  showLogo = true,
  className = ''
}: AuthLayoutProps) {
  return (
    <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center px-6 ${className}`}>
      {showLogo && (
        <div className="mb-8">
          <SpotifyLogo size="lg" />
        </div>
      )}

      {(title || description) && (
        <div className="text-center mb-8 max-w-md">
          {title && (
            <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-gray-400 text-lg sm:text-xl">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}