import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders with default title and message', () => {
    render(<ErrorState message="Test error message" />);

    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(
      <ErrorState title="Custom Error Title" message="Test error message" />
    );

    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders message as JSX element', () => {
    const jsxMessage = (
      <div>
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </div>
    );

    render(<ErrorState message={jsxMessage} />);

    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('renders action element when provided', () => {
    const actionButton = (
      <button data-testid="retry-button">Tentar Novamente</button>
    );

    render(<ErrorState message="Test error message" action={actionButton} />);

    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
  });

  it('does not render action when not provided', () => {
    render(<ErrorState message="Test error message" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ErrorState message="Test error message" className="custom-error-class" />
    );

    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toHaveClass('custom-error-class');
  });

  it('has correct accessibility attributes', () => {
    render(<ErrorState message="Test error message" />);

    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toHaveAttribute('role', 'alert');
    expect(errorContainer).toHaveAttribute('aria-live', 'assertive');
  });

  it('has error icon with correct accessibility attributes', () => {
    render(<ErrorState message="Test error message" />);

    const iconContainer = screen
      .getByRole('alert')
      .querySelector('[aria-hidden="true"]');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders title as h2 element', () => {
    render(<ErrorState title="Error Title" message="Test error message" />);

    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Error Title');
  });

  it('renders message in paragraph element', () => {
    render(<ErrorState message="Test error message" />);

    const message = screen.getByText('Test error message');
    expect(message.tagName).toBe('P');
  });

  it('has correct CSS classes for styling', () => {
    render(<ErrorState message="Test error message" />);

    const container = screen.getByRole('alert');
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'text-center'
    );
  });

  it('renders SVG icon with correct attributes', () => {
    render(<ErrorState message="Test error message" />);

    const svg = screen.getByRole('alert').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('fill', 'currentColor');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('handles empty string message', () => {
    render(<ErrorState message="" />);

    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
    // Message paragraph should still exist but be empty
    const messageElement = screen.getByRole('alert').querySelector('p');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveTextContent('');
  });

  it('handles complex JSX message with links', () => {
    const complexMessage = (
      <div>
        <p>Erro de conexão com o Spotify.</p>
        <p>
          <a href="/help" className="text-green-400 underline">
            Precisa de ajuda?
          </a>
        </p>
      </div>
    );

    render(<ErrorState message={complexMessage} />);

    expect(
      screen.getByText('Erro de conexão com o Spotify.')
    ).toBeInTheDocument();
    expect(screen.getByText('Precisa de ajuda?')).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/help');
    expect(link).toHaveClass('text-green-400', 'underline');
  });

  it('handles multiple action elements', () => {
    const multipleActions = (
      <div className="flex gap-2">
        <button data-testid="retry-button">Tentar Novamente</button>
        <button data-testid="cancel-button">Cancelar</button>
      </div>
    );

    render(
      <ErrorState message="Test error message" action={multipleActions} />
    );

    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  it('maintains responsive classes', () => {
    render(<ErrorState message="Test error message" />);

    const container = screen.getByRole('alert');
    expect(container).toHaveClass('py-12', 'px-4', 'sm:px-8');

    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveClass('text-lg', 'sm:text-xl', 'lg:text-2xl');

    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('w-12', 'h-12', 'sm:w-16', 'sm:h-16');
  });

  it('applies correct text colors', () => {
    render(<ErrorState message="Test error message" />);

    const iconContainer = screen
      .getByRole('alert')
      .querySelector('[aria-hidden="true"]');
    expect(iconContainer).toHaveClass('text-red-500');

    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveClass('text-white');

    const message = screen.getByText('Test error message');
    expect(message).toHaveClass('text-gray-400');
  });

  it('handles very long error messages', () => {
    const longMessage =
      'Este é um erro muito longo que pode acontecer quando há problemas de conectividade ou quando o servidor está indisponível por um período prolongado de tempo e precisamos informar ao usuário sobre todos os detalhes do problema.';

    render(<ErrorState message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();

    const messageElement = screen.getByText(longMessage);
    expect(messageElement).toHaveClass('max-w-md', 'leading-relaxed');
  });

  it('combines custom className with default classes', () => {
    render(
      <ErrorState
        message="Test error message"
        className="bg-red-900 border-red-500"
      />
    );

    const container = screen.getByRole('alert');
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center'
    );
    expect(container).toHaveClass('bg-red-900', 'border-red-500');
  });
});
