import React from 'react';
import { cn } from '@/lib/utils';
import { UI_CONFIG } from '@/constants/ui';

interface ResponsiveGridProps {
  children: React.ReactNode;
  type?: 'artistas' | 'albuns' | 'playlists' | 'custom';
  className?: string;
  customGrid?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  type = 'artistas',
  className = '',
  customGrid,
}) => {
  const getGridClass = () => {
    if (customGrid) return customGrid;
    if (type === 'custom') return customGrid || UI_CONFIG.grids.artistas;
    return UI_CONFIG.grids[type] || UI_CONFIG.grids.artistas;
  };

  return (
    <div className={cn(getGridClass(), className)}>
      {children}
    </div>
  );
};