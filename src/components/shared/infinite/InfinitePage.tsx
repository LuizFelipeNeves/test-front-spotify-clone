import { useNavigate } from 'react-router-dom';
import { PageContent } from '@/components/ui';
import { InfiniteScrollList } from '@/components';
import { useContentPage } from '@/hooks/content-page';
import { UI_CONFIG } from '@/constants/ui';

interface InfinitePageProps<T> {
  title: string;
  description: string;
  loadingText: string;
  data: {
    pages?: Array<{ items: T[] }>;
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  getNavigationPath: (item: T) => string;
  renderCard: (item: T, onClick: () => void) => React.ReactNode;
  gridClassName?: string;
}

export function InfinitePage<T>({
  title,
  description,
  loadingText,
  data,
  isLoading,
  isError,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  getNavigationPath,
  renderCard,
  gridClassName = UI_CONFIG.grids.artistas,
}: InfinitePageProps<T>) {
  const navigate = useNavigate();
  const { getEmptyState, handleRetry } = useContentPage({
    contentType: title.toLowerCase() as any
  });

  // Flatten all pages into a single array
  const items = data?.pages?.flatMap(page => page.items) ?? [];

  const handleItemClick = (item: T) => {
    const path = getNavigationPath(item);
    navigate(path);
  };

  return (
    <PageContent title={title} description={description}>
      <InfiniteScrollList
        items={items}
        loading={isLoading}
        error={isError ? error?.message || `Erro ao carregar ${title.toLowerCase()}` : null}
        emptyMessage={getEmptyState().message}
        emptyDescription={getEmptyState().description}
        onRetry={handleRetry}
        gridClassName={gridClassName}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        loadingText={loadingText}
        renderItem={(item) => (
          <div onClick={() => handleItemClick(item)}>
            {renderCard(item, () => handleItemClick(item))}
          </div>
        )}
      />
    </PageContent>
  );
}