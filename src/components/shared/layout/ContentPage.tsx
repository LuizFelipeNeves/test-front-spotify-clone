import React from 'react';
import { PageContent } from '@/components/ui/Layout/PageContent';
import { InfiniteScrollList } from '@/components/shared/infinite/InfiniteScrollList';
import { LoadingSpinner } from '@/components/shared/feedback/LoadingSpinner';

interface ContentPageProps<T> {
  title: string;
  description: string;
  items: T[];
  loading: boolean;
  error: string | null;
  emptyMessage?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  loadingText?: string;
  gridClassName?: string;
  actionButton?: React.ReactNode;
}

export function ContentPage<T>({
  title,
  description,
  items,
  loading,
  error,
  emptyMessage,
  emptyDescription,
  onRetry,
  renderItem,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  loadingText,
  gridClassName = "grid grid-cols-2 gap-4 md:gap-6",
  actionButton
}: ContentPageProps<T>) {
  if (loading && items.length === 0) {
    return (
      <PageContent title={title} description={description} actionButton={actionButton}>
        <LoadingSpinner message="Carregando..." />
      </PageContent>
    );
  }

  if (error && items.length === 0) {
    return (
      <PageContent title={title} description={description} actionButton={actionButton}>
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-full transition-colors"
            >
              Tentar novamente
            </button>
          )}
        </div>
      </PageContent>
    );
  }

  return (
    <PageContent title={title} description={description} actionButton={actionButton}>
      <InfiniteScrollList
        items={items}
        loading={loading}
        error={error}
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
        onRetry={onRetry}
        gridClassName={gridClassName}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        loadingText={loadingText}
        renderItem={renderItem}
      />
    </PageContent>
  );
}