import { render, screen } from '@testing-library/react';
import { vi, type MockedFunction } from 'vitest';
import { UserAvatar } from '../media/UserAvatar';
import { useImageCache } from '@/hooks/useImageCache';

// Mock do useImageCache hook
vi.mock('@/hooks/useImageCache', () => ({
  useImageCache: vi.fn(),
}));

const mockUseImageCache = useImageCache as MockedFunction<typeof useImageCache>;

const createMockReturn = (overrides: Partial<ReturnType<typeof useImageCache>> = {}) => ({
  imageUrl: 'https://example.com/avatar.jpg',
  isLoading: false,
  error: null,
  retry: vi.fn(),
  preloadImage: vi.fn(),
  ...overrides,
});

describe('UserAvatar Component', () => {
  const defaultProps = {
    imageUrl: 'https://example.com/avatar.jpg',
    displayName: 'John Doe',
  };

  beforeEach(() => {
    mockUseImageCache.mockReturnValue(createMockReturn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render user avatar with image', () => {
    render(<UserAvatar {...defaultProps} />);

    const img = screen.getByRole('img', { name: /john doe/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(img).toHaveAttribute('alt', 'John Doe');
  });

  it('should apply default size (lg)', () => {
    const { container } = render(<UserAvatar {...defaultProps} />);

    const img = container.querySelector('img');
    expect(img).toHaveClass('w-32', 'h-32');
  });

  it('should apply small size', () => {
    const { container } = render(<UserAvatar {...defaultProps} size="sm" />);

    const img = container.querySelector('img');
    expect(img).toHaveClass('w-16', 'h-16');
  });

  it('should apply medium size', () => {
    const { container } = render(<UserAvatar {...defaultProps} size="md" />);

    const img = container.querySelector('img');
    expect(img).toHaveClass('w-24', 'h-24');
  });

  it('should apply custom className', () => {
    const { container } = render(<UserAvatar {...defaultProps} className="custom-class" />);

    const avatarContainer = container.firstChild as HTMLElement;
    expect(avatarContainer).toHaveClass('custom-class');
  });

  it('should show loading state when isLoading prop is true', () => {
    mockUseImageCache.mockReturnValue(createMockReturn({
      imageUrl: 'https://example.com/avatar.jpg',
      isLoading: false,
    }));

    const { container } = render(<UserAvatar {...defaultProps} isLoading={true} />);

    const loadingContainer = container.querySelector('.animate-pulse');
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveClass('animate-pulse');
  });

  it('should show loading state when image is loading', () => {
    mockUseImageCache.mockReturnValue(createMockReturn({
      imageUrl: null,
      isLoading: true,
    }));

    const { container } = render(<UserAvatar {...defaultProps} />);

    const loadingContainer = container.querySelector('.animate-pulse');
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveClass('animate-pulse');
  });

  it('should show loading state when no image URL and loading', () => {
    mockUseImageCache.mockReturnValue(createMockReturn({
      imageUrl: null,
      isLoading: true,
    }));

    const { container } = render(<UserAvatar {...defaultProps} />);

    const loadingContainer = container.querySelector('.animate-pulse');
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveClass('animate-pulse');
  });

  it('should handle null imageUrl prop', () => {
    render(<UserAvatar imageUrl={null} displayName="John Doe" />);

    const img = screen.getByRole('img', { name: /john doe/i });
    expect(img).toBeInTheDocument();
  });

  it('should handle undefined imageUrl prop', () => {
    render(<UserAvatar displayName="John Doe" />);

    const img = screen.getByRole('img', { name: /john doe/i });
    expect(img).toBeInTheDocument();
  });

  it('should handle empty display name', () => {
    mockUseImageCache.mockReturnValue(createMockReturn({
      imageUrl: 'https://example.com/avatar.jpg',
      isLoading: false,
    }));

    const { container } = render(<UserAvatar imageUrl="https://example.com/avatar.jpg" displayName="" />);

    const img = container.querySelector('img[src="https://example.com/avatar.jpg"]');
    expect(img).toHaveAttribute('alt', '');
  });

  it('should handle undefined display name', () => {
    mockUseImageCache.mockReturnValue(createMockReturn({
      imageUrl: 'https://example.com/avatar.jpg',
      isLoading: false,
    }));

    const { container } = render(<UserAvatar imageUrl="https://example.com/avatar.jpg" />);

    const img = container.querySelector('img[src="https://example.com/avatar.jpg"]');
    expect(img).toHaveAttribute('alt', '');
  });

  it('should show fallback when no image available', () => {
    mockUseImageCache.mockReturnValue(createMockReturn({
      imageUrl: null,
      isLoading: false,
    }));

    const { container } = render(<UserAvatar {...defaultProps} />);

    const fallbackContainer = container.querySelector('.bg-gradient-to-br');
    expect(fallbackContainer).toBeInTheDocument();
    expect(fallbackContainer).toHaveClass('from-yellow-400', 'to-orange-500');
  });

  it('should use cached image from hook', () => {
    const cachedUrl = 'https://cached.example.com/avatar.jpg';
    mockUseImageCache.mockReturnValue(createMockReturn({
      imageUrl: cachedUrl,
      isLoading: false,
    }));

    render(<UserAvatar {...defaultProps} />);

    const img = screen.getByRole('img', { name: /john doe/i });
    expect(img).toHaveAttribute('src', cachedUrl);
  });

  it('should have proper accessibility attributes', () => {
    render(<UserAvatar {...defaultProps} />);

    const img = screen.getByRole('img', { name: /john doe/i });
    expect(img).toHaveAttribute('alt', 'John Doe');
  });

  it('should have proper container structure for image', () => {
    render(<UserAvatar {...defaultProps} />);

    const img = screen.getByRole('img', { name: /john doe/i });
    expect(img).toHaveClass('rounded-full', 'mx-auto', 'object-cover');
  });

  it('should show fallback design when no cached image', () => {
    mockUseImageCache.mockReturnValue(createMockReturn({
      imageUrl: null,
      isLoading: false,
    }));

    const { container } = render(<UserAvatar displayName="No Image User" />);

    const fallbackContainer = container.querySelector('.bg-gradient-to-br');
    expect(fallbackContainer).toBeInTheDocument();
    expect(fallbackContainer).toHaveClass('from-yellow-400', 'to-orange-500');
  });

  it('should maintain aspect ratio with object-cover', () => {
    render(<UserAvatar {...defaultProps} />);

    const img = screen.getByRole('img', { name: /john doe/i });
    expect(img).toHaveClass('object-cover');
  });

  it('should call useImageCache with correct parameters', () => {
    render(<UserAvatar {...defaultProps} />);

    expect(mockUseImageCache).toHaveBeenCalledWith(
      'https://example.com/avatar.jpg',
      'user',
      { fallbackUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' }
    );
  });

  it('should handle different image URLs', () => {
    const specialUrl = 'https://example.com/avatar%20with%20spaces.jpg?param=value';
    mockUseImageCache.mockReturnValue(createMockReturn({
      imageUrl: specialUrl,
      isLoading: false,
    }));

    render(<UserAvatar imageUrl={specialUrl} displayName="Special User" />);

    const img = screen.getByRole('img', { name: /special user/i });
    expect(img).toHaveAttribute('src', specialUrl);
  });

  it('should show loading skeleton with proper styling', () => {
    mockUseImageCache.mockReturnValue(createMockReturn({
      imageUrl: null,
      isLoading: true,
    }));

    const { container } = render(<UserAvatar {...defaultProps} isLoading={true} size="md" />);

    const loadingContainer = container.querySelector('.animate-pulse');
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveClass('w-28', 'h-28', 'bg-gray-700', 'rounded-full', 'animate-pulse');
  });
});