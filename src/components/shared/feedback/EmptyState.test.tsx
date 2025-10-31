import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders with required title', () => {
    render(<EmptyState title="No items found" />);
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders with title and description', () => {
    render(
      <EmptyState 
        title="No playlists" 
        description="You haven't created any playlists yet." 
      />
    );
    
    expect(screen.getByText('No playlists')).toBeInTheDocument();
    expect(screen.getByText("You haven't created any playlists yet.")).toBeInTheDocument();
  });

  it('renders with icon when provided', () => {
    const testIcon = (
      <svg data-testid="test-icon" className="w-12 h-12">
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
    
    render(
      <EmptyState 
        title="No items" 
        icon={testIcon} 
      />
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('does not render icon container when icon is not provided', () => {
    render(<EmptyState title="No items" />);
    
    const container = screen.getByRole('status');
    const iconContainer = container.querySelector('[aria-hidden="true"]');
    expect(iconContainer).not.toBeInTheDocument();
  });

  it('renders action element when provided', () => {
    const actionButton = (
      <button data-testid="create-button">
        Create Playlist
      </button>
    );
    
    render(
      <EmptyState 
        title="No playlists" 
        action={actionButton} 
      />
    );
    
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
    expect(screen.getByText('Create Playlist')).toBeInTheDocument();
  });

  it('does not render action when not provided', () => {
    render(<EmptyState title="No items" />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<EmptyState title="No items" />);
    
    const container = screen.getByRole('status');
    const description = container.querySelector('p');
    expect(description).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <EmptyState 
        title="No items" 
        className="custom-empty-class" 
      />
    );
    
    const container = screen.getByRole('status');
    expect(container).toHaveClass('custom-empty-class');
  });

  it('has correct accessibility attributes', () => {
    render(<EmptyState title="No items" />);
    
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('role', 'status');
    expect(container).toHaveAttribute('aria-live', 'polite');
  });

  it('has icon with correct accessibility attributes when provided', () => {
    const testIcon = <div data-testid="icon">Icon</div>;
    
    render(
      <EmptyState 
        title="No items" 
        icon={testIcon} 
      />
    );
    
    const iconContainer = screen.getByRole('status').querySelector('[aria-hidden="true"]');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders title as h2 element', () => {
    render(<EmptyState title="Empty State Title" />);
    
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Empty State Title');
  });

  it('renders description in paragraph element when provided', () => {
    render(
      <EmptyState 
        title="No items" 
        description="This is a description" 
      />
    );
    
    const description = screen.getByText('This is a description');
    expect(description.tagName).toBe('P');
  });

  it('has correct CSS classes for styling', () => {
    render(<EmptyState title="No items" />);
    
    const container = screen.getByRole('status');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'text-center');
  });

  it('handles empty string description', () => {
    render(
      <EmptyState 
        title="No items" 
        description="" 
      />
    );
    
    // Empty description should still render the paragraph element
    const description = screen.getByRole('status').querySelector('p');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('');
  });

  it('handles complex icon elements', () => {
    const complexIcon = (
      <div className="flex items-center justify-center">
        <svg className="w-16 h-16" data-testid="complex-icon">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
    );
    
    render(
      <EmptyState 
        title="No favorites" 
        icon={complexIcon} 
      />
    );
    
    expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
  });

  it('handles multiple action elements', () => {
    const multipleActions = (
      <div className="flex gap-2">
        <button data-testid="primary-action">Primary Action</button>
        <button data-testid="secondary-action">Secondary Action</button>
      </div>
    );
    
    render(
      <EmptyState 
        title="No items" 
        action={multipleActions} 
      />
    );
    
    expect(screen.getByTestId('primary-action')).toBeInTheDocument();
    expect(screen.getByTestId('secondary-action')).toBeInTheDocument();
  });

  it('maintains responsive classes', () => {
    render(<EmptyState title="No items" />);
    
    const container = screen.getByRole('status');
    expect(container).toHaveClass('py-12', 'px-4', 'sm:px-8');
    
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveClass('text-lg', 'sm:text-xl', 'lg:text-2xl');
  });

  it('applies correct text colors', () => {
    const testIcon = <div data-testid="icon">Icon</div>;
    
    render(
      <EmptyState 
        title="No items" 
        description="No description" 
        icon={testIcon} 
      />
    );
    
    const iconContainer = screen.getByRole('status').querySelector('[aria-hidden="true"]');
    expect(iconContainer).toHaveClass('text-gray-500');
    
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveClass('text-white');
    
    const description = screen.getByText('No description');
    expect(description).toHaveClass('text-gray-400');
  });

  it('handles very long descriptions', () => {
    const longDescription = 'Esta é uma descrição muito longa que pode acontecer quando precisamos explicar detalhadamente por que não há itens para mostrar e quais ações o usuário pode tomar para resolver essa situação.';
    
    render(
      <EmptyState 
        title="No items" 
        description={longDescription} 
      />
    );
    
    expect(screen.getByText(longDescription)).toBeInTheDocument();
    
    const descriptionElement = screen.getByText(longDescription);
    expect(descriptionElement).toHaveClass('max-w-md', 'leading-relaxed');
  });

  it('combines custom className with default classes', () => {
    render(
      <EmptyState 
        title="No items" 
        className="bg-gray-800 border-gray-600" 
      />
    );
    
    const container = screen.getByRole('status');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
    expect(container).toHaveClass('bg-gray-800', 'border-gray-600');
  });

  it('renders all elements in correct order', () => {
    const testIcon = <div data-testid="icon">Icon</div>;
    const testAction = <button data-testid="action">Action</button>;
    
    render(
      <EmptyState 
        title="Test Title" 
        description="Test Description" 
        icon={testIcon} 
        action={testAction} 
      />
    );
    
    const container = screen.getByRole('status');
    const children = Array.from(container.children);
    
    // Icon should be first
    expect(children[0]).toContain(screen.getByTestId('icon'));
    
    // Title should be second
    expect(children[1]).toBe(screen.getByRole('heading', { level: 2 }));
    
    // Description should be third
    expect(children[2]).toBe(screen.getByText('Test Description'));
    
    // Action should be last
    expect(children[3]).toContain(screen.getByTestId('action'));
  });

  it('handles action with links', () => {
    const actionWithLink = (
      <div>
        <a href="/create" data-testid="create-link" className="text-green-400 underline">
          Create your first playlist
        </a>
      </div>
    );
    
    render(
      <EmptyState 
        title="No playlists" 
        action={actionWithLink} 
      />
    );
    
    const link = screen.getByTestId('create-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/create');
    expect(link).toHaveClass('text-green-400', 'underline');
  });

  it('handles icon with custom styling', () => {
    const styledIcon = (
      <div className="p-4 bg-gray-800 rounded-full">
        <svg className="w-8 h-8" data-testid="styled-icon">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
    );
    
    render(
      <EmptyState 
        title="No items" 
        icon={styledIcon} 
      />
    );
    
    const iconContainer = screen.getByRole('status').querySelector('[aria-hidden="true"]');
    expect(iconContainer).toBeInTheDocument();
    expect(screen.getByTestId('styled-icon')).toBeInTheDocument();
  });
});