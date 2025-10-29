import type { ReactNode } from 'react';
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

interface ContentListProps<T> {
  items: T[];
  loading?: boolean;
  error?: string | React.ReactNode | null;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
  onRetry?: () => void;
  renderItem: (item: T, index: number) => ReactNode;
}

function ContentList<T>({
  items,
  loading = false,
  error = null,
  emptyMessage = 'Nenhum item encontrado',
  emptyDescription = 'Não há itens para exibir no momento.',
  className = '',
  onRetry,
  renderItem
}: ContentListProps<T>) {
  // Loading State
  if (loading) {
    return <LoadingSpinner />;
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
      <ErrorState
        message={typeof error === 'string' ? error : 'Ocorreu um erro inesperado'}
        action={retryButton}
      />
    );
  }

  // Empty State
  if (!items || items.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  // For now, we'll use regular rendering instead of virtual scrolling
  // until we can properly implement react-window
  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

export { ContentList };