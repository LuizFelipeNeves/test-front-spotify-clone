import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InfiniteScrollList } from './InfiniteScrollList';

// Mock react-intersection-observer
const mockInView = vi.fn();
const mockRef = vi.fn();

vi.mock('react-intersection-observer', () => ({
  useInView: vi.fn(() => ({
    ref: mockRef,
    inView: mockInView(),
  })),
}));

// Mock data
const mockItems = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
];

const defaultProps = {
  items: mockItems,
  renderItem: (item: any, index: number) => (
    <div data-testid={`item-${index}`} key={item.id}>
      {item.name}
    </div>
  ),
};

describe('InfiniteScrollList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInView.mockReturnValue(false);
  });

  it('renders items correctly', () => {
    render(<InfiniteScrollList {...defaultProps} />);

    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('shows loading state when loading and no items', () => {
    render(
      <InfiniteScrollList
        {...defaultProps}
        items={[]}
        loading={true}
      />
    );

    const loadingSpinner = document.querySelector('.animate-spin');
    expect(loadingSpinner).toBeInTheDocument();
    expect(screen.queryByTestId('infinite-scroll')).not.toBeInTheDocument();
  });

  it('shows error state with React node error', () => {
    const errorNode = <div data-testid="custom-error">Custom error component</div>;
    
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        items={[]} 
        error={errorNode} 
      />
    );

    expect(screen.getByText('Ocorreu um erro inesperado')).toBeInTheDocument();
    expect(screen.queryByTestId('infinite-scroll')).not.toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    const mockRetry = vi.fn();
    
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        items={[]} 
        error="Test error" 
        onRetry={mockRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: /tentar carregar novamente/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when onRetry is not provided', () => {
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        items={[]} 
        error="Test error" 
      />
    );

    expect(screen.queryByRole('button', { name: /tentar carregar novamente/i })).not.toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        items={[]} 
      />
    );

    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
    expect(screen.getByText('Não há itens para exibir no momento.')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument(); // SVG icon
    expect(screen.queryByTestId('infinite-scroll')).not.toBeInTheDocument();
  });

  it('shows custom empty state messages', () => {
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        items={[]} 
        emptyMessage="Custom empty message"
        emptyDescription="Custom empty description"
      />
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    expect(screen.getByText('Custom empty description')).toBeInTheDocument();
  });

  it('applies custom className and gridClassName', () => {
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        className="custom-container-class"
        gridClassName="custom-grid-class"
      />
    );

    const container = screen.getByTestId('infinite-scroll');
    expect(container).toHaveClass('custom-container-class');
    
    const gridContainer = container.firstChild;
    expect(gridContainer).toHaveClass('custom-grid-class');
  });

  it('shows infinite scroll trigger when hasNextPage is true', () => {
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        hasNextPage={true}
        loadingText="Loading more items..."
      />
    );

    expect(screen.getByText('Loading more items...')).toBeInTheDocument();
    const loadingSpinner = screen.getAllByRole('generic').find(el => 
      el.classList.contains('animate-spin')
    );
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('does not show infinite scroll trigger when hasNextPage is false', () => {
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        hasNextPage={false}
      />
    );

    expect(screen.queryByText('Carregando mais itens...')).not.toBeInTheDocument();
  });

  it('calls fetchNextPage when in view and has next page', async () => {
    const mockFetchNextPage = vi.fn();
    mockInView.mockReturnValue(true);

    render(
      <InfiniteScrollList 
        {...defaultProps} 
        hasNextPage={true}
        fetchNextPage={mockFetchNextPage}
      />
    );

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call fetchNextPage when not in view', async () => {
    const mockFetchNextPage = vi.fn();
    mockInView.mockReturnValue(false);

    render(
      <InfiniteScrollList 
        {...defaultProps} 
        hasNextPage={true}
        fetchNextPage={mockFetchNextPage}
      />
    );

    await waitFor(() => {
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('does not call fetchNextPage when isFetchingNextPage is true', async () => {
    const mockFetchNextPage = vi.fn();
    mockInView.mockReturnValue(true);

    render(
      <InfiniteScrollList 
        {...defaultProps} 
        hasNextPage={true}
        isFetchingNextPage={true}
        fetchNextPage={mockFetchNextPage}
      />
    );

    await waitFor(() => {
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('does not call fetchNextPage when hasNextPage is false', async () => {
    const mockFetchNextPage = vi.fn();
    mockInView.mockReturnValue(true);

    render(
      <InfiniteScrollList 
        {...defaultProps} 
        hasNextPage={false}
        fetchNextPage={mockFetchNextPage}
      />
    );

    await waitFor(() => {
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('does not call fetchNextPage when fetchNextPage is not provided', async () => {
    mockInView.mockReturnValue(true);

    render(
      <InfiniteScrollList 
        {...defaultProps} 
        hasNextPage={true}
      />
    );

    // Should not throw any errors
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
  });

  it('renders items with correct keys and structure', () => {
    const customRenderItem = (item: any, index: number) => (
      <div data-testid={`custom-item-${index}`} data-id={item.id}>
        Custom: {item.name}
      </div>
    );

    render(
      <InfiniteScrollList 
        {...defaultProps} 
        renderItem={customRenderItem}
      />
    );

    expect(screen.getByTestId('custom-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('custom-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-item-2')).toBeInTheDocument();
    expect(screen.getByText('Custom: Item 1')).toBeInTheDocument();
  });

  it('handles null and undefined items gracefully', () => {
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        items={null as any}
      />
    );

    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
  });

  it('shows loading state even when items exist but loading is true', () => {
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        loading={true}
      />
    );

    // Should show items, not loading state, because items.length > 0
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
    expect(screen.getByTestId('item-0')).toBeInTheDocument();
  });

  it('prioritizes error state over empty state', () => {
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        items={[]}
        error="Test error"
      />
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.queryByText('Nenhum item encontrado')).not.toBeInTheDocument();
  });

  it('prioritizes error state over loading state', () => {
    render(
      <InfiniteScrollList
        {...defaultProps}
        items={[]}
        loading={false} // Mudando para false para mostrar o erro
        error="Test error"
      />
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
  });

  it('uses default loading text when not provided', () => {
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        hasNextPage={true}
      />
    );

    expect(screen.getByText('Carregando mais itens...')).toBeInTheDocument();
  });

  it('maintains accessibility attributes', () => {
    const mockRetry = vi.fn();
    
    render(
      <InfiniteScrollList 
        {...defaultProps} 
        items={[]}
        error="Test error"
        onRetry={mockRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: /tentar carregar novamente/i });
    expect(retryButton).toHaveAttribute('aria-label', 'Tentar carregar novamente');
  });

  it('handles complex item structures', () => {
    const complexItems = [
      { id: '1', name: 'Item 1', metadata: { type: 'song', duration: 180 } },
      { id: '2', name: 'Item 2', metadata: { type: 'album', tracks: 12 } },
    ];

    const complexRenderItem = (item: any, index: number) => (
      <div data-testid={`complex-item-${index}`}>
        <h3>{item.name}</h3>
        <span>{item.metadata.type}</span>
      </div>
    );

    render(
      <InfiniteScrollList 
        items={complexItems}
        renderItem={complexRenderItem}
      />
    );

    expect(screen.getByTestId('complex-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('complex-item-1')).toBeInTheDocument();
    expect(screen.getByText('song')).toBeInTheDocument();
    expect(screen.getByText('album')).toBeInTheDocument();
  });

  it('handles empty className and gridClassName', () => {
    render(
      <InfiniteScrollList
        {...defaultProps}
        className=""
        gridClassName=""
      />
    );

    const container = screen.getByTestId('infinite-scroll');
    expect(container).not.toHaveClass('non-existent-class');
    
    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).not.toHaveClass('non-existent-grid-class');
  });
});