import type { ReactNode } from 'react';

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
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-lg">{loadingMessage}</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className="text-center mb-6">
          <h3 className="text-white text-xl font-semibold mb-2">Ops! Algo deu errado</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 transition-colors"
            >
              Tentar Novamente
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty State
  if (!loading && !error && items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <h3 className="text-white text-xl font-semibold mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-400">
          {emptyDescription}
        </p>
      </div>
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
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center">
            {footerMessage}
          </p>
        </div>
      )}
    </div>
  );
}