import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function MainContent({
  children,
  id = 'main-content',
  className = '',
}: MainContentProps) {
  return (
    <main id={id} className={className} role="main" tabIndex={-1}>
      {children}
    </main>
  );
}
