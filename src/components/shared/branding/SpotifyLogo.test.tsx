import { render, screen } from '@testing-library/react';
import SpotifyLogo from './SpotifyLogo';

describe('SpotifyLogo Component', () => {
  it('should render with default props', () => {
    render(<SpotifyLogo />);
    
    const logo = screen.getByRole('img', { name: /spotify/i });
    expect(logo).toBeInTheDocument();
    
    const text = screen.getByText('Spotify');
    expect(text).toBeInTheDocument();
  });

  it('should render without text when showText is false', () => {
    render(<SpotifyLogo showText={false} />);
    
    const logo = screen.getByRole('img', { name: /spotify/i });
    expect(logo).toBeInTheDocument();
    
    const text = screen.queryByText('Spotify');
    expect(text).not.toBeInTheDocument();
  });

  it('should apply correct size classes for small size', () => {
    const { container } = render(<SpotifyLogo size="sm" />);
    
    const logoContainer = container.querySelector('[role="img"]');
    expect(logoContainer).toBeInTheDocument();
    
    const iconContainer = logoContainer?.querySelector('div');
    expect(iconContainer).toHaveClass('w-6', 'h-6');
    
    const text = screen.getByText('Spotify');
    expect(text).toHaveClass('text-lg');
  });

  it('should apply correct size classes for medium size', () => {
    const { container } = render(<SpotifyLogo size="md" />);
    
    const logoContainer = container.querySelector('[role="img"]');
    const iconContainer = logoContainer?.querySelector('div');
    expect(iconContainer).toHaveClass('w-12', 'h-12');
    
    const text = screen.getByText('Spotify');
    expect(text).toHaveClass('text-4xl');
  });

  it('should apply correct size classes for large size', () => {
    const { container } = render(<SpotifyLogo size="lg" />);
    
    const logoContainer = container.querySelector('[role="img"]');
    const iconContainer = logoContainer?.querySelector('div');
    expect(iconContainer).toHaveClass('w-16', 'h-16');
    
    const text = screen.getByText('Spotify');
    expect(text).toHaveClass('text-5xl');
  });

  it('should apply correct size classes for extra large size', () => {
    const { container } = render(<SpotifyLogo size="xl" />);
    
    const logoContainer = container.querySelector('[role="img"]');
    const iconContainer = logoContainer?.querySelector('div');
    expect(iconContainer).toHaveClass('w-20', 'h-20');
    
    const text = screen.getByText('Spotify');
    expect(text).toHaveClass('text-6xl');
  });

  it('should apply custom className', () => {
    const customClass = 'custom-logo-class';
    const { container } = render(<SpotifyLogo className={customClass} />);
    
    const logoContainer = container.querySelector('[role="img"]');
    expect(logoContainer).toHaveClass(customClass);
  });

  it('should have proper accessibility attributes', () => {
    render(<SpotifyLogo />);
    
    const logo = screen.getByRole('img', { name: /spotify/i });
    expect(logo).toHaveAttribute('aria-label', 'Spotify');
    
    // Verifica se o ícone SVG tem aria-hidden
    const svgIcon = logo.querySelector('div[aria-hidden="true"]');
    expect(svgIcon).toBeInTheDocument();
    
    // Verifica se o texto tem aria-hidden quando presente
    const text = screen.getByText('Spotify');
    expect(text).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render SVG icon correctly', () => {
    const { container } = render(<SpotifyLogo />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    
    const path = svg?.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('fill', 'black');
  });

  it('should have correct structure with icon and text', () => {
    const { container } = render(<SpotifyLogo />);
    
    const logoContainer = container.querySelector('[role="img"]');
    expect(logoContainer).toHaveClass('flex', 'items-center', 'gap-2');
    
    const iconContainer = logoContainer?.querySelector('div');
    expect(iconContainer).toHaveClass('bg-white', 'rounded-full', 'flex', 'items-center', 'justify-center');
    
    const text = screen.getByText('Spotify');
    expect(text).toHaveClass('text-white', 'font-bold');
  });

  it('should handle all size combinations with and without text', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    
    sizes.forEach(size => {
      const { unmount } = render(<SpotifyLogo size={size} showText={true} />);
      expect(screen.getByText('Spotify')).toBeInTheDocument();
      unmount();
      
      render(<SpotifyLogo size={size} showText={false} />);
      expect(screen.queryByText('Spotify')).not.toBeInTheDocument();
      unmount();
    });
  });

  it('should maintain aspect ratio for icon', () => {
    const { container } = render(<SpotifyLogo size="md" />);
    
    const svg = container.querySelector('svg');
    const iconContainer = container.querySelector('div[aria-hidden="true"]');
    
    expect(iconContainer).toHaveClass('w-12', 'h-12'); // Container size for md
    expect(svg).toHaveClass('w-8', 'h-8'); // Icon size for md
  });
});