import type { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface ContentListProps<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  emptyMessage?: string;
  emptyDescription?: string;
  loadingMessage?: string;
  renderItem: (item: T) => ReactNode;
  onRetry?: () => void;
  footerMessage?: string;
  className?: string;
}

export function ContentList<T>({
  items,
  loading,
  error,
  emptyMessage = "Nenhum item encontrado",
  emptyDescription = "Comece a usar o Spotify para ver conteúdo aqui!",
  loadingMessage = "Carregando...",
  renderItem,
  onRetry,
  footerMessage,
  className = ''
}: ContentListProps<T>) {
  // Loading State
  if (loading) {
    return (
      <LoadingSpinner 
        size="lg" 
        message={loadingMessage} 
        className={className} 
      />
    );
  }

  // Error State
  if (error && !loading) {
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
        message={error} 
        action={retryButton} 
        className={className} 
      />
    );
  }

  // Empty State
  if (!loading && !error && items.length === 0) {
    return (
      <EmptyState 
        title={emptyMessage} 
        description={emptyDescription} 
        className={className} 
      />
    );
  }

  // Content List
  return (
    <div className={className}>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            {renderItem(item)}
          </div>
        ))}
      </div>

      {/* Footer */}
      {!loading && !error && items.length > 0 && footerMessage && (
        <footer className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center" role="status" aria-live="polite">
            {footerMessage}
          </p>
        </footer>
      )}
    </div>
  );
}