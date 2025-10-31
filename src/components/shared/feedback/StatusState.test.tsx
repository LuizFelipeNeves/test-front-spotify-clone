import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusState, EmptyState, ErrorState, LoadingState } from './StatusState';

// Mock dos ícones do lucide-react
vi.mock('lucide-react', () => ({
  AlertCircle: ({ className, ...props }: any) => (
    <div data-testid="alert-circle-icon" className={className} {...props} />
  ),
  RefreshCw: ({ className, ...props }: any) => (
    <div data-testid="refresh-icon" className={className} {...props} />
  ),
  Loader2: ({ className, ...props }: any) => (
    <div data-testid="loader-icon" className={className} {...props} />
  ),
}));

describe('StatusState Component', () => {
  describe('Basic Rendering', () => {
    it('should render loading state with default messages', () => {
      render(<StatusState type="loading" />);
      
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo sendo carregado, aguarde...')).toBeInTheDocument();
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('should render error state with default messages', () => {
      render(<StatusState type="error" />);
      
      expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
      expect(screen.getByText('Ocorreu um erro ao carregar o conteúdo. Tente novamente.')).toBeInTheDocument();
      expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
    });

    it('should render empty state with default messages', () => {
      render(<StatusState type="empty" />);
      
      expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
      expect(screen.getByText('Não há itens para exibir no momento.')).toBeInTheDocument();
      expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
    });
  });

  describe('Custom Messages', () => {
    it('should render custom message and description', () => {
      render(
        <StatusState 
          type="loading" 
          message="Custom loading message"
          description="Custom loading description"
        />
      );
      
      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
      expect(screen.getByText('Custom loading description')).toBeInTheDocument();
    });

    it('should render only custom message when description is not provided', () => {
      render(
        <StatusState 
          type="error" 
          message="Custom error message"
        />
      );
      
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      // Should still show default description
      expect(screen.getByText('Ocorreu um erro ao carregar o conteúdo. Tente novamente.')).toBeInTheDocument();
    });

    it('should render only custom description when message is not provided', () => {
      render(
        <StatusState 
          type="empty" 
          description="Custom empty description"
        />
      );
      
      expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
      expect(screen.getByText('Custom empty description')).toBeInTheDocument();
    });
  });

  describe('Icon Rendering', () => {
    it('should render loading icon with correct classes', () => {
      render(<StatusState type="loading" />);
      
      const icon = screen.getByTestId('loader-icon');
      expect(icon).toHaveClass('w-12', 'h-12', 'animate-spin', 'text-white');
    });

    it('should render error icon with correct classes', () => {
      render(<StatusState type="error" />);
      
      const icon = screen.getByTestId('alert-circle-icon');
      expect(icon).toHaveClass('w-12', 'h-12', 'text-red-500');
    });

    it('should render empty icon with correct classes', () => {
      render(<StatusState type="empty" />);
      
      const icon = screen.getByTestId('alert-circle-icon');
      expect(icon).toHaveClass('w-12', 'h-12', 'text-gray-400');
    });
  });

  describe('Icon Sizes', () => {
    it('should render small icon size', () => {
      render(<StatusState type="loading" iconSize="sm" />);
      
      const icon = screen.getByTestId('loader-icon');
      expect(icon).toHaveClass('w-8', 'h-8');
    });

    it('should render medium icon size (default)', () => {
      render(<StatusState type="loading" iconSize="md" />);
      
      const icon = screen.getByTestId('loader-icon');
      expect(icon).toHaveClass('w-12', 'h-12');
    });

    it('should render large icon size', () => {
      render(<StatusState type="loading" iconSize="lg" />);
      
      const icon = screen.getByTestId('loader-icon');
      expect(icon).toHaveClass('w-16', 'h-16');
    });

    it('should use medium size as default when iconSize is not provided', () => {
      render(<StatusState type="loading" />);
      
      const icon = screen.getByTestId('loader-icon');
      expect(icon).toHaveClass('w-12', 'h-12');
    });
  });

  describe('Retry Functionality', () => {
    it('should render retry button for error state when onRetry is provided', () => {
      const mockOnRetry = vi.fn();
      
      render(<StatusState type="error" onRetry={mockOnRetry} />);
      
      const retryButton = screen.getByRole('button', { name: /tentar novamente/i });
      expect(retryButton).toBeInTheDocument();
      expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
    });

    it('should not render retry button for error state when onRetry is not provided', () => {
      render(<StatusState type="error" />);
      
      const retryButton = screen.queryByRole('button', { name: /tentar novamente/i });
      expect(retryButton).not.toBeInTheDocument();
    });

    it('should not render retry button for loading state even with onRetry', () => {
      const mockOnRetry = vi.fn();
      
      render(<StatusState type="loading" onRetry={mockOnRetry} />);
      
      const retryButton = screen.queryByRole('button', { name: /tentar novamente/i });
      expect(retryButton).not.toBeInTheDocument();
    });

    it('should not render retry button for empty state even with onRetry', () => {
      const mockOnRetry = vi.fn();
      
      render(<StatusState type="empty" onRetry={mockOnRetry} />);
      
      const retryButton = screen.queryByRole('button', { name: /tentar novamente/i });
      expect(retryButton).not.toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', () => {
      const mockOnRetry = vi.fn();
      
      render(<StatusState type="error" onRetry={mockOnRetry} />);
      
      const retryButton = screen.getByRole('button', { name: /tentar novamente/i });
      fireEvent.click(retryButton);
      
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling and Layout', () => {
    it('should apply custom className', () => {
      const customClass = 'custom-test-class';
      
      const { container } = render(<StatusState type="loading" className={customClass} />);
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass(customClass);
    });

    it('should have correct base styling', () => {
      const { container } = render(<StatusState type="loading" />);
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'text-center', 'p-8');
    });

    it('should render message as h3 element with correct styling', () => {
      render(<StatusState type="loading" message="Test message" />);
      
      const message = screen.getByRole('heading', { level: 3 });
      expect(message).toHaveTextContent('Test message');
      expect(message).toHaveClass('text-white', 'text-lg', 'font-medium', 'mb-2');
    });

    it('should render description as paragraph with correct styling', () => {
      render(<StatusState type="loading" description="Test description" />);
      
      const description = screen.getByText('Test description');
      expect(description.tagName).toBe('P');
      expect(description).toHaveClass('text-gray-400', 'text-sm', 'mb-4', 'max-w-md');
    });

    it('should render retry button with correct styling', () => {
      const mockOnRetry = vi.fn();
      
      render(<StatusState type="error" onRetry={mockOnRetry} />);
      
      const retryButton = screen.getByRole('button', { name: /tentar novamente/i });
      expect(retryButton).toHaveClass(
        'flex', 'items-center', 'space-x-2', 'text-white', 'bg-green-500', 
        'hover:bg-green-600', 'px-4', 'py-2', 'rounded-full', 'transition-colors'
      );
    });
  });

  describe('Conditional Rendering', () => {
    it('should not render message when empty string is provided', () => {
      render(<StatusState type="loading" message="" />);
      
      const message = screen.queryByRole('heading', { level: 3 });
      expect(message).not.toBeInTheDocument();
    });

    it('should not render description when empty string is provided', () => {
      render(<StatusState type="loading" description="" />);
      
      // Should not render description paragraph
      const { container } = render(<StatusState type="loading" description="" />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs).toHaveLength(0);
    });

    it('should render both message and description when both are provided', () => {
      render(
        <StatusState 
          type="loading" 
          message="Test message"
          description="Test description"
        />
      );
      
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });

  describe('Specialized Components', () => {
    it('should render EmptyState correctly', () => {
      render(<EmptyState message="No items" description="Empty list" />);
      
      expect(screen.getByText('No items')).toBeInTheDocument();
      expect(screen.getByText('Empty list')).toBeInTheDocument();
      expect(screen.getByTestId('alert-circle-icon')).toHaveClass('text-gray-400');
    });

    it('should render ErrorState correctly', () => {
      const mockOnRetry = vi.fn();
      
      render(<ErrorState message="Error occurred" onRetry={mockOnRetry} />);
      
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
      expect(screen.getByTestId('alert-circle-icon')).toHaveClass('text-red-500');
      expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
    });

    it('should render LoadingState correctly', () => {
      render(<LoadingState message="Loading data" />);
      
      expect(screen.getByText('Loading data')).toBeInTheDocument();
      expect(screen.getByTestId('loader-icon')).toHaveClass('animate-spin', 'text-white');
    });

    it('should pass all props to specialized components', () => {
      const customClass = 'custom-class';

      const { container } = render(<EmptyState className={customClass} iconSize="lg" />);
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass(customClass);

      const icon = screen.getByTestId('alert-circle-icon');
      expect(icon).toHaveClass('w-16', 'h-16');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined className gracefully', () => {
      const { container } = render(<StatusState type="loading" className={undefined} />);
      
      const component = container.firstChild as HTMLElement;
      expect(component).toBeInTheDocument();
    });

    it('should handle empty className', () => {
      const { container } = render(<StatusState type="loading" className="" />);
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'text-center', 'p-8');
    });

    it('should handle multiple onRetry calls', () => {
      const mockOnRetry = vi.fn();
      
      render(<StatusState type="error" onRetry={mockOnRetry} />);
      
      const retryButton = screen.getByRole('button', { name: /tentar novamente/i });
      
      fireEvent.click(retryButton);
      fireEvent.click(retryButton);
      fireEvent.click(retryButton);
      
      expect(mockOnRetry).toHaveBeenCalledTimes(3);
    });

    it('should maintain layout structure with all elements', () => {
      const mockOnRetry = vi.fn();
      
      const { container } = render(
        <StatusState 
          type="error" 
          message="Test message"
          description="Test description"
          onRetry={mockOnRetry}
        />
      );
      
      const component = container.firstChild as HTMLElement;
      const children = component.children;
      
      // Should have: icon container, message, description, retry button
      expect(children).toHaveLength(4);
    });
  });
});