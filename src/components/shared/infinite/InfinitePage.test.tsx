import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { InfinitePage } from './InfinitePage';

// Mock dependencies
vi.mock('@/components/ui', () => ({
  PageContent: ({ title, description, children }: any) => (
    <div data-testid="page-content">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

vi.mock('@/components', () => ({
  InfiniteScrollList: ({
    items,
    loading,
    error,
    emptyMessage,
    emptyDescription,
    onRetry,
    gridClassName,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loadingText,
    renderItem,
  }: any) => (
    <div data-testid="infinite-scroll-list">
      <div data-testid="grid-class">{gridClassName}</div>
      {loading && <div data-testid="loading">Loading...</div>}
      {error && (
        <div data-testid="error">
          {error}
          {onRetry && (
            <button onClick={onRetry} data-testid="retry-button">
              Retry
            </button>
          )}
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <div data-testid="empty-state">
          <div data-testid="empty-message">{emptyMessage}</div>
          <div data-testid="empty-description">{emptyDescription}</div>
        </div>
      )}
      {items.map((item: any, index: number) => (
        <div key={index} data-testid={`item-${index}`}>
          {renderItem(item)}
        </div>
      ))}
      {hasNextPage && (
        <div data-testid="load-more">
          <button onClick={fetchNextPage} data-testid="fetch-next-page">
            {isFetchingNextPage ? 'Loading more...' : 'Load more'}
          </button>
          <span data-testid="loading-text">{loadingText}</span>
        </div>
      )}
    </div>
  ),
}));

vi.mock('@/hooks/content-page', () => ({
  useContentPage: vi.fn(() => ({
    getEmptyState: () => ({
      message: 'Nenhum item encontrado',
      description: 'Descrição do estado vazio',
    }),
    handleRetry: vi.fn(),
  })),
}));

vi.mock('@/constants/ui', () => ({
  UI_CONFIG: {
    grids: {
      artistas: 'grid-cols-2 gap-4',
    },
  },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Mock data
const mockItems = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
];

const mockData = {
  pages: [{ items: mockItems.slice(0, 2) }, { items: mockItems.slice(2) }],
};

const defaultProps = {
  title: 'Test Page',
  description: 'Test description',
  loadingText: 'Carregando mais...',
  data: mockData,
  isLoading: false,
  isError: false,
  error: null,
  fetchNextPage: vi.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
  getNavigationPath: (item: any) => `/test/${item.id}`,
  renderCard: (item: any, onClick: () => void) => (
    <div onClick={onClick} data-testid={`card-${item.id}`}>
      {item.name}
    </div>
  ),
};

describe('InfinitePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page content with title and description', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByTestId('page-content')).toBeInTheDocument();
    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders infinite scroll list with correct props', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByTestId('infinite-scroll-list')).toBeInTheDocument();
    expect(screen.getByTestId('grid-class')).toHaveTextContent(
      'grid-cols-2 gap-4'
    );
  });

  it('flattens pages data correctly', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} />
      </TestWrapper>
    );

    // Should render all items from all pages
    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
  });

  it('handles navigation when item is clicked', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} />
      </TestWrapper>
    );

    const firstCard = screen.getByTestId('card-1');
    fireEvent.click(firstCard);

    expect(mockNavigate).toHaveBeenCalledWith('/test/1');
  });

  it('shows loading state', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} isLoading={true} />
      </TestWrapper>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('shows error state with retry functionality', () => {
    const mockError = new Error('Test error');
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} isError={true} error={mockError} />
      </TestWrapper>
    );

    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} data={{ pages: [] }} />
      </TestWrapper>
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('empty-message')).toHaveTextContent(
      'Nenhum item encontrado'
    );
    expect(screen.getByTestId('empty-description')).toHaveTextContent(
      'Descrição do estado vazio'
    );
  });

  it('handles pagination correctly', () => {
    const mockFetchNextPage = vi.fn();
    render(
      <TestWrapper>
        <InfinitePage
          {...defaultProps}
          hasNextPage={true}
          fetchNextPage={mockFetchNextPage}
        />
      </TestWrapper>
    );

    expect(screen.getByTestId('load-more')).toBeInTheDocument();
    expect(screen.getByTestId('loading-text')).toHaveTextContent(
      'Carregando mais...'
    );

    const fetchButton = screen.getByTestId('fetch-next-page');
    fireEvent.click(fetchButton);

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('shows fetching next page state', () => {
    render(
      <TestWrapper>
        <InfinitePage
          {...defaultProps}
          hasNextPage={true}
          isFetchingNextPage={true}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Loading more...')).toBeInTheDocument();
  });

  it('uses custom grid className when provided', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} gridClassName="custom-grid-class" />
      </TestWrapper>
    );

    expect(screen.getByTestId('grid-class')).toHaveTextContent(
      'custom-grid-class'
    );
  });

  it('handles undefined data gracefully', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} data={undefined} />
      </TestWrapper>
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('handles data without pages gracefully', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} data={{}} />
      </TestWrapper>
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders items with correct click handlers', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} />
      </TestWrapper>
    );

    // Click on the second item
    const secondCard = screen.getByTestId('card-2');
    fireEvent.click(secondCard);

    expect(mockNavigate).toHaveBeenCalledWith('/test/2');
  });

  it('passes error message correctly when error is null', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} isError={true} error={null} />
      </TestWrapper>
    );

    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByText('Erro ao carregar test page')).toBeInTheDocument();
  });

  it('handles complex navigation paths', () => {
    const complexGetNavigationPath = (item: any) =>
      `/complex/path/${item.id}/details`;

    render(
      <TestWrapper>
        <InfinitePage
          {...defaultProps}
          getNavigationPath={complexGetNavigationPath}
        />
      </TestWrapper>
    );

    const firstCard = screen.getByTestId('card-1');
    fireEvent.click(firstCard);

    expect(mockNavigate).toHaveBeenCalledWith('/complex/path/1/details');
  });

  it('renders custom card components correctly', () => {
    const customRenderCard = (item: any, onClick: () => void) => (
      <button onClick={onClick} data-testid={`custom-card-${item.id}`}>
        Custom: {item.name}
      </button>
    );

    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} renderCard={customRenderCard} />
      </TestWrapper>
    );

    expect(screen.getByTestId('custom-card-1')).toBeInTheDocument();
    expect(screen.getByText('Custom: Item 1')).toBeInTheDocument();
  });

  it('maintains component structure and accessibility', () => {
    render(
      <TestWrapper>
        <InfinitePage {...defaultProps} />
      </TestWrapper>
    );

    // Check that the main structure is maintained
    const pageContent = screen.getByTestId('page-content');
    const infiniteScrollList = screen.getByTestId('infinite-scroll-list');

    expect(pageContent).toContainElement(infiniteScrollList);
  });
});
