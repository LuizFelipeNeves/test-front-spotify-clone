import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateButton } from './CreateButton';

describe('CreateButton', () => {
  it('renders correctly with default props', () => {
    const mockOnClick = vi.fn();
    render(<CreateButton text="Criar" onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Criar')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<CreateButton text="Criar" onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant by default', () => {
    render(<CreateButton text="Criar" onClick={vi.fn()} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-green-500', 'text-black');
  });

  it('applies secondary variant correctly', () => {
    render(<CreateButton text="Criar" variant="secondary" onClick={vi.fn()} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-700', 'text-white');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<CreateButton text="Criar" size="sm" onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-2', 'text-sm');

    rerender(<CreateButton text="Criar" size="md" onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-3', 'text-base');

    rerender(<CreateButton text="Criar" size="lg" onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-4', 'text-lg');
  });

  it('renders custom icon when provided', () => {
    const CustomIcon = () => <span data-testid="custom-icon">ICON</span>;
    render(<CreateButton text="Criar" icon={<CustomIcon />} onClick={vi.fn()} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders default icon when none provided', () => {
    render(<CreateButton text="Criar" onClick={vi.fn()} />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('applies custom className', () => {
    render(
      <CreateButton
        text="Criar"
        className="custom-class another-class"
        onClick={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class', 'another-class');
  });

  it('sets title and aria-label attributes', () => {
    render(
      <CreateButton
        text="Criar"
        title="Criar novo item"
        ariaLabel="Criar novo item acessível"
        onClick={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Criar novo item');
    expect(button).toHaveAttribute('aria-label', 'Criar novo item acessível');
  });

  it('hides text on small screens', () => {
    const { container } = render(<CreateButton text="Criar" onClick={vi.fn()} />);

    const textSpan = container.querySelector('span.hidden.sm\\:inline');
    expect(textSpan).toBeInTheDocument();
  });

  it('has proper button structure with icon and text', () => {
    render(<CreateButton text="Criar" onClick={vi.fn()} />);

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    const span = button.querySelector('span');

    expect(svg).toBeInTheDocument();
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('Criar');
  });

  it('has correct focus and hover styles', () => {
    render(<CreateButton text="Criar" onClick={vi.fn()} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-green-400', 'focus:outline-none', 'focus:ring-2');
  });
});