import { render, screen, fireEvent } from '@testing-library/react';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  const defaultProps = {
    href: '#main-content',
    children: 'Pular para conteúdo principal',
  };

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<SkipLink {...defaultProps} />);

      const link = screen.getByTestId('skip-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '#main-content');
      expect(link).toHaveTextContent('Pular para conteúdo principal');
    });

    it('renders with custom href', () => {
      render(<SkipLink href="#navigation" children="Pular para navegação" />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveAttribute('href', '#navigation');
      expect(link).toHaveTextContent('Pular para navegação');
    });

    it('renders with custom children content', () => {
      render(<SkipLink href="#search" children="Ir para busca" />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveTextContent('Ir para busca');
    });

    it('renders with React element as children', () => {
      render(
        <SkipLink href="#content">
          <span>
            Pular para <strong>conteúdo</strong>
          </span>
        </SkipLink>
      );

      const link = screen.getByTestId('skip-link');
      expect(link).toContainHTML(
        '<span>Pular para <strong>conteúdo</strong></span>'
      );
    });
  });

  describe('Styling and Classes', () => {
    it('applies default CSS classes', () => {
      render(<SkipLink {...defaultProps} />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveClass('sr-only');
      expect(link).toHaveClass('focus:not-sr-only');
      expect(link).toHaveClass('focus:absolute');
      expect(link).toHaveClass('focus:top-4');
      expect(link).toHaveClass('focus:left-4');
      expect(link).toHaveClass('bg-green-500');
      expect(link).toHaveClass('text-black');
      expect(link).toHaveClass('px-4');
      expect(link).toHaveClass('py-2');
      expect(link).toHaveClass('rounded-md');
      expect(link).toHaveClass('font-semibold');
      expect(link).toHaveClass('z-50');
      expect(link).toHaveClass('focus:outline-none');
      expect(link).toHaveClass('focus:ring-2');
      expect(link).toHaveClass('focus:ring-green-300');
      expect(link).toHaveClass('focus:ring-offset-2');
      expect(link).toHaveClass('focus:ring-offset-black');
    });

    it('applies custom className', () => {
      render(<SkipLink {...defaultProps} className="custom-class" />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveClass('custom-class');
      expect(link).toHaveClass('sr-only'); // Should still have default classes
    });

    it('handles empty className', () => {
      render(<SkipLink {...defaultProps} className="" />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveClass('sr-only'); // Should have default classes
    });

    it('handles undefined className', () => {
      render(<SkipLink {...defaultProps} className={undefined} />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveClass('sr-only'); // Should have default classes
    });

    it('combines multiple custom classes', () => {
      render(<SkipLink {...defaultProps} className="custom-1 custom-2" />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveClass('custom-1');
      expect(link).toHaveClass('custom-2');
      expect(link).toHaveClass('sr-only');
    });
  });

  describe('Accessibility', () => {
    it('has proper link semantics', () => {
      render(<SkipLink {...defaultProps} />);

      const link = screen.getByTestId('skip-link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '#main-content');
    });

    it('is accessible by screen readers', () => {
      render(<SkipLink {...defaultProps} />);

      const link = screen.getByRole('link', {
        name: 'Pular para conteúdo principal',
      });
      expect(link).toBeInTheDocument();
    });

    it('has proper focus management attributes', () => {
      render(<SkipLink {...defaultProps} />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveClass('focus:outline-none');
      expect(link).toHaveClass('focus:ring-2');
    });

    it('is keyboard accessible', () => {
      render(<SkipLink {...defaultProps} />);

      const link = screen.getByTestId('skip-link');

      // Focus the link
      link.focus();
      expect(link).toHaveFocus();

      // Should be able to activate with Enter
      fireEvent.keyDown(link, { key: 'Enter', code: 'Enter' });
      // Note: We can't test actual navigation in jsdom, but we can test that the link receives the event
    });

    it('supports multiple skip links on the same page', () => {
      render(
        <div>
          <SkipLink href="#main" children="Pular para principal" />
          <SkipLink href="#nav" children="Pular para navegação" />
          <SkipLink href="#search" children="Pular para busca" />
        </div>
      );

      const links = screen.getAllByTestId('skip-link');
      expect(links).toHaveLength(3);

      expect(links[0]).toHaveAttribute('href', '#main');
      expect(links[1]).toHaveAttribute('href', '#nav');
      expect(links[2]).toHaveAttribute('href', '#search');
    });
  });

  describe('Interaction', () => {
    it('handles click events', () => {
      render(<SkipLink {...defaultProps} />);

      const link = screen.getByTestId('skip-link');

      // Test that click events can be fired (even if we don't have a handler)
      fireEvent.click(link);

      // Link should still be in the document after click
      expect(link).toBeInTheDocument();
    });

    it('handles focus events', () => {
      render(<SkipLink {...defaultProps} />);

      const link = screen.getByTestId('skip-link');

      // Focus the link using focus() method
      link.focus();
      expect(link).toHaveFocus();

      // Blur the link using blur() method
      link.blur();
      expect(link).not.toHaveFocus();
    });

    it('handles keyboard navigation', () => {
      render(<SkipLink {...defaultProps} />);

      const link = screen.getByTestId('skip-link');

      // Tab to focus
      fireEvent.keyDown(link, { key: 'Tab', code: 'Tab' });

      // Enter to activate
      fireEvent.keyDown(link, { key: 'Enter', code: 'Enter' });

      // Space to activate
      fireEvent.keyDown(link, { key: ' ', code: 'Space' });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty href', () => {
      render(<SkipLink href="" children="Empty href" />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveAttribute('href', '');
    });

    it('handles special characters in href', () => {
      render(
        <SkipLink
          href="#content-with-special-chars_123"
          children="Special chars"
        />
      );

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveAttribute('href', '#content-with-special-chars_123');
    });

    it('handles long text content', () => {
      const longText =
        'Este é um texto muito longo para o skip link que pode quebrar em múltiplas linhas';

      render(<SkipLink href="#content" children={longText} />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveTextContent(longText);
    });

    it('handles empty children', () => {
      render(<SkipLink href="#content" children="" />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveTextContent('');
    });

    it('handles null children gracefully', () => {
      render(<SkipLink href="#content" children={null} />);

      const link = screen.getByTestId('skip-link');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('maintains consistent DOM structure', () => {
      const { container } = render(<SkipLink {...defaultProps} />);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders as a single anchor element', () => {
      const { container } = render(<SkipLink {...defaultProps} />);

      expect(container.children).toHaveLength(1);
      expect(container.firstChild?.nodeName).toBe('A');
    });

    it('preserves data-testid attribute', () => {
      render(<SkipLink {...defaultProps} />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveAttribute('data-testid', 'skip-link');
    });
  });

  describe('Integration with UI Texts', () => {
    it('works with UI_TEXTS constants', () => {
      // Simulate using UI_TEXTS
      const UI_TEXTS = {
        pularParaConteudoPrincipal: 'Pular para conteúdo principal',
        irParaConteudoPrincipal: 'Ir para conteúdo principal',
      };

      render(
        <SkipLink href="#main" children={UI_TEXTS.pularParaConteudoPrincipal} />
      );

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveTextContent(UI_TEXTS.pularParaConteudoPrincipal);
    });
  });

  describe('Performance', () => {
    it('renders efficiently with minimal re-renders', () => {
      const { rerender } = render(<SkipLink {...defaultProps} />);

      // Re-render with same props
      rerender(<SkipLink {...defaultProps} />);

      const link = screen.getByTestId('skip-link');
      expect(link).toBeInTheDocument();
    });

    it('handles prop changes correctly', () => {
      const { rerender } = render(<SkipLink {...defaultProps} />);

      // Change href
      rerender(<SkipLink href="#new-content" children="New content" />);

      const link = screen.getByTestId('skip-link');
      expect(link).toHaveAttribute('href', '#new-content');
      expect(link).toHaveTextContent('New content');
    });
  });
});
