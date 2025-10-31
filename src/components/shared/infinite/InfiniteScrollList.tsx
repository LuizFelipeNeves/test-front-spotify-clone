import React from 'react';
import type { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

export interface InfiniteScrollListProps<T> {
  items: T[] | null;
  loading?: boolean;
  error?: string | React.ReactNode | null;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
  gridClassName?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  onRetry?: () => void;
  renderItem: (item: T, index: number) => ReactNode;
  loadingText?: string;
}

export function InfiniteScrollList<T>({
  items,
  loading = false,
  error = null,
  emptyMessage = 'Nenhum item encontrado',
  emptyDescription = 'Não há itens para exibir no momento.',
  className = '',
  gridClassName = '',
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  onRetry,
  renderItem,
  loadingText = 'Carregando mais itens...',
}: InfiniteScrollListProps<T>) {
  // Infinite scroll with intersection observer
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Trigger fetchNextPage when in view and has more pages
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading State
  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Error State
  if (error) {
    const retryButton = onRetry ? (
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Tentar carregar novamente"
      >
        Tentar Novamente
      </button>
    ) : undefined;

    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center px-4">
        <div className="text-red-400 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <h3 className="text-white text-lg font-semibold mb-2">
          {typeof error === 'string' ? error : 'Ocorreu um erro inesperado'}
        </h3>
        {retryButton}
      </div>
    );
  }

  // Empty State
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center px-4">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        </div>
        <h3 className="text-white text-lg font-semibold mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-400 text-sm">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className={className} data-testid="infinite-scroll">
      <div className={gridClassName}>
        {items.map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="h-10 flex justify-center items-center mt-6"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">{loadingText}</span>
        </div>
      )}
    </div>
  );
}
