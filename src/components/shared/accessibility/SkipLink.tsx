import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <a
      href={href}
      data-testid="skip-link"
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
        bg-green-500 text-black px-4 py-2 rounded-md font-semibold
        z-50 focus:outline-none focus:ring-2 focus:ring-green-300
        focus:ring-offset-2 focus:ring-offset-black
        ${className}
      `}
    >
      {children}
    </a>
  );
}
