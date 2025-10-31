import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResponsiveGrid } from './ResponsiveGrid';

// Mock do UI_CONFIG
vi.mock('@/constants/ui', () => ({
  UI_CONFIG: {
    grids: {
      artistas: 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4',
      albuns: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4',
      playlists: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    },
  },
}));

describe('ResponsiveGrid Component', () => {
  const TestChild = ({ text }: { text: string }) => (
    <div data-testid="grid-item">{text}</div>
  );

  it('should render children correctly', () => {
    render(
      <ResponsiveGrid>
        <TestChild text="Item 1" />
        <TestChild text="Item 2" />
        <TestChild text="Item 3" />
      </ResponsiveGrid>
    );

    const items = screen.getAllByTestId('grid-item');
    expect(items).toHaveLength(3);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('should apply default grid type (artistas)', () => {
    const { container } = render(
      <ResponsiveGrid>
        <TestChild text="Item 1" />
      </ResponsiveGrid>
    );

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4', 'lg:grid-cols-6', 'gap-4');
  });

  it('should apply artistas grid type', () => {
    const { container } = render(
      <ResponsiveGrid type="artistas">
        <TestChild text="Item 1" />
      </ResponsiveGrid>
    );

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4', 'lg:grid-cols-6', 'gap-4');
  });

  it('should apply albuns grid type', () => {
    const { container } = render(
      <ResponsiveGrid type="albuns">
        <TestChild text="Item 1" />
      </ResponsiveGrid>
    );

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-5', 'gap-4');
  });

  it('should apply playlists grid type', () => {
    const { container } = render(
      <ResponsiveGrid type="playlists">
        <TestChild text="Item 1" />
      </ResponsiveGrid>
    );

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
  });

  it('should apply custom grid when type is custom and customGrid is provided', () => {
    const customGridClasses = 'grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2';
    const { container } = render(
      <ResponsiveGrid type="custom" customGrid={customGridClasses}>
        <TestChild text="Item 1" />
      </ResponsiveGrid>
    );

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-3', 'md:grid-cols-6', 'lg:grid-cols-9', 'gap-2');
  });

  it('should fallback to artistas grid when type is custom but no customGrid provided', () => {
    const { container } = render(
      <ResponsiveGrid type="custom">
        <TestChild text="Item 1" />
      </ResponsiveGrid>
    );

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4', 'lg:grid-cols-6', 'gap-4');
  });

  it('should apply custom className along with grid classes', () => {
    const customClass = 'custom-grid-class';
    const { container } = render(
      <ResponsiveGrid className={customClass}>
        <TestChild text="Item 1" />
      </ResponsiveGrid>
    );

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass(customClass);
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4', 'lg:grid-cols-6', 'gap-4');
  });

  it('should prioritize customGrid over type when both are provided', () => {
    const customGridClasses = 'flex flex-wrap gap-8';
    const { container } = render(
      <ResponsiveGrid type="albuns" customGrid={customGridClasses}>
        <TestChild text="Item 1" />
      </ResponsiveGrid>
    );

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass('flex', 'flex-wrap', 'gap-8');
    expect(gridContainer).not.toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-5');
  });

  it('should handle empty children', () => {
    const { container } = render(<ResponsiveGrid children={undefined} />);

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('grid');
    expect(gridContainer.children).toHaveLength(0);
  });

  it('should handle single child', () => {
    render(
      <ResponsiveGrid>
        <TestChild text="Single Item" />
      </ResponsiveGrid>
    );

    const item = screen.getByTestId('grid-item');
    expect(item).toBeInTheDocument();
    expect(screen.getByText('Single Item')).toBeInTheDocument();
  });

  it('should handle multiple different child types', () => {
    render(
      <ResponsiveGrid>
        <div data-testid="div-child">Div Child</div>
        <span data-testid="span-child">Span Child</span>
        <TestChild text="Component Child" />
      </ResponsiveGrid>
    );

    expect(screen.getByTestId('div-child')).toBeInTheDocument();
    expect(screen.getByTestId('span-child')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item')).toBeInTheDocument();
  });

  it('should fallback to artistas grid for unknown type', () => {
    const { container } = render(
      <ResponsiveGrid type={'unknown' as any}>
        <TestChild text="Item 1" />
      </ResponsiveGrid>
    );

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4', 'lg:grid-cols-6', 'gap-4');
  });

  it('should maintain grid structure with complex children', () => {
    render(
      <ResponsiveGrid type="playlists">
        <div className="complex-child">
          <h3>Title</h3>
          <p>Description</p>
          <button>Action</button>
        </div>
        <div className="another-complex-child">
          <img src="test.jpg" alt="test" />
          <span>Caption</span>
        </div>
      </ResponsiveGrid>
    );

    expect(screen.getByRole('heading', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /test/i })).toBeInTheDocument();
    expect(screen.getByText('Caption')).toBeInTheDocument();
  });
});