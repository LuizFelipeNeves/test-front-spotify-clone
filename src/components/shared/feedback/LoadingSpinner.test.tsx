import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-live', 'polite');
    expect(spinner).toHaveAttribute('aria-label', 'Carregando...');

    const message = screen.getByText('Carregando...');
    expect(message).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const customMessage = 'Processando dados...';
    render(<LoadingSpinner message={customMessage} />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', customMessage);

    const message = screen.getByText(customMessage);
    expect(message).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);

    // Small size
    let spinnerDiv = document.querySelector('.animate-spin');
    expect(spinnerDiv).toHaveClass('w-4', 'h-4');

    let message = screen.getByText('Carregando...');
    expect(message).toHaveClass('text-sm');

    // Medium size (default)
    rerender(<LoadingSpinner size="md" />);
    spinnerDiv = document.querySelector('.animate-spin');
    expect(spinnerDiv).toHaveClass('w-8', 'h-8');

    message = screen.getByText('Carregando...');
    expect(message).toHaveClass('text-base');

    // Large size
    rerender(<LoadingSpinner size="lg" />);
    spinnerDiv = document.querySelector('.animate-spin');
    expect(spinnerDiv).toHaveClass('w-12', 'h-12');

    message = screen.getByText('Carregando...');
    expect(message).toHaveClass('text-lg');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-spinner-class" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-spinner-class');
  });

  it('has correct accessibility features', () => {
    render(<LoadingSpinner message="Loading content" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
    expect(spinner).toHaveAttribute('aria-label', 'Loading content');

    const srOnlyText = screen.getByText('Conteúdo sendo carregado, aguarde...');
    expect(srOnlyText).toHaveClass('sr-only');

    const spinnerIcon = document.querySelector('.animate-spin');
    expect(spinnerIcon).toHaveAttribute('aria-hidden', 'true');
  });

  it('has correct styling classes', () => {
    render(<LoadingSpinner />);

    const container = screen.getByRole('status');
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'py-8',
      'px-4'
    );

    const spinnerDiv = document.querySelector('.animate-spin');
    expect(spinnerDiv).toHaveClass(
      'border-2',
      'border-gray-600',
      'border-t-green-500',
      'rounded-full',
      'animate-spin',
      'mb-4'
    );

    const message = screen.getByText('Carregando...');
    expect(message).toHaveClass('text-gray-400', 'text-center');
  });

  it('renders with all size and message combinations', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
    const customMessage = 'Custom loading message';

    sizes.forEach(size => {
      const { unmount } = render(
        <LoadingSpinner size={size} message={customMessage} />
      );

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-label', customMessage);

      const message = screen.getByText(customMessage);
      expect(message).toBeInTheDocument();

      unmount();
    });
  });
});
