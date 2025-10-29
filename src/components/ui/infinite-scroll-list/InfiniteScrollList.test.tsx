import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InfiniteScrollList } from './InfiniteScrollList';

vi.mock('react-intersection-observer', () => ({
  useInView: vi.fn()
}));

const mockUseInView = vi.mocked(vi.fn());

describe('InfiniteScrollList', () => {
  const mockItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  const mockRenderItem = (item: { id: number; name: string }) => (
    <div data-testid={`item-${item.id}`}>{item.name}</div>
  );

  beforeEach(() => {
    mockUseInView.mockReturnValue({
      ref: vi.fn(),
      inView: false
    });
  });

  it('renders items correctly', () => {
    render(<InfiniteScrollList items={mockItems} renderItem={mockRenderItem} />);

    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders loading state when loading is true and no items', () => {
    render(<InfiniteScrollList items={[]} loading={true} renderItem={mockRenderItem} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty state when no items', () => {
    render(
      <InfiniteScrollList
        items={[]}
        emptyMessage="No items found"
        emptyDescription="Try adding some items"
        renderItem={mockRenderItem}
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try adding some items')).toBeInTheDocument();
  });

  it('renders error state with retry button', () => {
    const mockRetry = vi.fn();

    render(
      <InfiniteScrollList
        items={[]}
        error="Failed to load"
        onRetry={mockRetry}
        renderItem={mockRenderItem}
      />
    );

    expect(screen.getByText('Failed to load')).toBeInTheDocument();

    const retryButton = screen.getByText('Tentar Novamente');
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('renders custom error message as string and ReactNode', () => {
    render(
      <InfiniteScrollList
        items={[]}
        error="Custom error message"
        renderItem={mockRenderItem}
      />
    );
    expect(screen.getByText('Custom error message')).toBeInTheDocument();

    const errorNode = <div data-testid="custom-error">Custom React error</div>;
    render(
      <InfiniteScrollList
        items={[]}
        error={errorNode}
        renderItem={mockRenderItem}
      />
    );
    expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    expect(screen.getByText('Custom React error')).toBeInTheDocument();
  });

  it('renders infinite scroll trigger and custom loading text', () => {
    render(
      <InfiniteScrollList
        items={mockItems}
        hasNextPage={true}
        fetchNextPage={vi.fn()}
        loadingText="Loading more..."
        renderItem={mockRenderItem}
      />
    );

    expect(screen.getByText('Loading more...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies custom className and gridClassName', () => {
    const { container } = render(
      <InfiniteScrollList
        items={mockItems}
        className="custom-class"
        gridClassName="grid grid-cols-2 gap-4"
        renderItem={mockRenderItem}
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
    const gridContainer = screen.getByTestId('item-1').parentElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'gap-4');
  });

  it('handles infinite scroll fetchNextPage logic', async () => {
    const mockFetchNextPage = vi.fn();

    mockUseInView.mockReturnValue({
      ref: vi.fn(),
      inView: true
    });

    render(
      <InfiniteScrollList
        items={mockItems}
        hasNextPage={true}
        isFetchingNextPage={false}
        fetchNextPage={mockFetchNextPage}
        renderItem={mockRenderItem}
      />
    );

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });

    mockFetchNextPage.mockClear();

    render(
      <InfiniteScrollList
        items={mockItems}
        hasNextPage={true}
        isFetchingNextPage={true}
        fetchNextPage={mockFetchNextPage}
        renderItem={mockRenderItem}
      />
    );

    await waitFor(() => {
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });

    render(
      <InfiniteScrollList
        items={mockItems}
        hasNextPage={false}
        fetchNextPage={mockFetchNextPage}
        renderItem={mockRenderItem}
      />
    );

    await waitFor(() => {
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });
  });

  it('handles empty items array with default messages', () => {
    render(<InfiniteScrollList items={[]} renderItem={mockRenderItem} />);

    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
    expect(screen.getByText('Não há itens para exibir no momento.')).toBeInTheDocument();
  });

  it('renders items with correct keys', () => {
    render(
      <InfiniteScrollList
        items={mockItems}
        renderItem={(item: { id: number; name: string }, index: number) => (
          <div data-testid={`item-index-${index}`}>{item.name}</div>
        )}
      />
    );

    expect(screen.getByTestId('item-index-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-index-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-index-2')).toBeInTheDocument();
  });
});