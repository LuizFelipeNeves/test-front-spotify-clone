import type { ReactNode } from 'react';
import { PageHeader } from '@/components';

export interface PageContentProps {
  title: string | ReactNode;
  description?: string;
  actionButton?: ReactNode;
  showSpotifyStatus?: boolean;
  headerClassName?: string;
  contentClassName?: string;
  className?: string;
  children: ReactNode;
}

export function PageContent({
  title,
  description,
  actionButton,
  showSpotifyStatus = true,
  headerClassName = '',
  contentClassName = '',
  className = '',
  children
}: PageContentProps) {
  return (
    <div className={`p-4 sm:p-8 lg:p-12 ${className}`}>
      <PageHeader
        title={title}
        description={description}
        actionButton={actionButton}
        showSpotifyStatus={showSpotifyStatus}
        className={headerClassName}
      />

      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
}