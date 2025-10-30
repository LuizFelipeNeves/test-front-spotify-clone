import { render, screen } from '@testing-library/react';
import { MainContent } from './MainContent';

describe('MainContent', () => {
  it('renders with default id', () => {
    render(
      <MainContent>
        <div>Content</div>
      </MainContent>
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('renders with custom id', () => {
    render(
      <MainContent id="custom-id">
        <div>Custom Content</div>
      </MainContent>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'custom-id');
  });

  it('applies custom className correctly', () => {
    render(
      <MainContent className="custom-main-class">
        <div>Styled Content</div>
      </MainContent>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('custom-main-class');
  });

  it('has correct accessibility attributes', () => {
    render(
      <MainContent>
        <p>Test content</p>
      </MainContent>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('role', 'main');
    expect(main).toHaveAttribute('tabIndex', '-1');
  });

  it('renders children correctly', () => {
    render(
      <MainContent>
        <h1>Heading</h1>
        <p>Paragraph</p>
      </MainContent>
    );

    expect(screen.getByRole('heading', { name: /heading/i })).toBeInTheDocument();
    expect(screen.getByText(/paragraph/i)).toBeInTheDocument();
  });

  it('can receive multiple children', () => {
    render(
      <MainContent>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </MainContent>
    );

    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
    expect(screen.getByText('Third child')).toBeInTheDocument();
  });

  it('supports complex nested content', () => {
    render(
      <MainContent>
        <section>
          <h2>Section Title</h2>
          <div>
            <button>Nested Button</button>
            <a href="#">Nested Link</a>
          </div>
        </section>
      </MainContent>
    );

    expect(screen.getByRole('heading', { name: /section title/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nested button/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /nested link/i })).toBeInTheDocument();
  });

  it('can be used with different content types', () => {
    const content = (
      <div>
        <span>Text content</span>
        <button>Button content</button>
        <img src="test.jpg" alt="Test image" />
      </div>
    );

    render(<MainContent>{content}</MainContent>);

    expect(screen.getByText('Text content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /button content/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /test image/i })).toBeInTheDocument();
  });

  it('focus management works correctly', () => {
    render(
      <MainContent>
        <button>First Button</button>
        <button>Second Button</button>
      </MainContent>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('tabIndex', '-1');
  });

  it('maintains semantic HTML structure', () => {
    const { container } = render(
      <MainContent>
        <article>Article content</article>
      </MainContent>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveAttribute('role', 'main');
  });
});