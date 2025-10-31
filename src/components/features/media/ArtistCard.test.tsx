import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ArtistCard } from './ArtistCard';
import type { Artist } from '@/types';

const mocks = vi.hoisted(() => {
  return {
    useImageCache: vi.fn(),
  };
});

vi.mock('@/hooks/useImageCache', () => {
  return {
    useImageCache: mocks.useImageCache,
  };
});

const mockArtist: Artist = {
  id: '1',
  name: 'Test Artist',
  external_urls: {
    spotify: 'https://open.spotify.com/artist/1',
  },
  images: [
    {
      url: 'https://example.com/artist-image.jpg',
      height: 640,
      width: 640,
    },
  ],
  followers: {
    total: 1500000,
  },
  genres: ['rock', 'alternative'],
  popularity: 85,
  uri: 'artist',
};

const mockArtistWithoutImage: Artist = {
  ...mockArtist,
  images: [],
};

const mockArtistLowPopularity: Artist = {
  ...mockArtist,
  popularity: 45,
  followers: {
    total: 500,
  },
};

describe('ArtistCard', () => {
  beforeEach(() => {
    mocks.useImageCache.mockReturnValue({
      imageUrl: 'https://example.com/artist-image.jpg',
      isLoading: false,
    });
  });

  it('renders artist information correctly', () => {
    render(<ArtistCard artist={mockArtist} />);

    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('1.5M seguidores')).toBeInTheDocument();
    expect(screen.getByText('rock, alternative')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders artist image with correct alt text', () => {
    render(<ArtistCard artist={mockArtist} />);

    const image = screen.getByAltText('Test Artist');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'https://example.com/artist-image.jpg'
    );
  });

  it('calls onClick when card is clicked', () => {
    const mockOnClick = vi.fn();
    render(<ArtistCard artist={mockArtist} onClick={mockOnClick} />);

    const clickableArea = screen.getByTestId('artist-card-clickable-area');
    fireEvent.click(clickableArea);

    expect(mockOnClick).toHaveBeenCalledWith(mockArtist);
  });

  it('applies custom className', () => {
    const { container } = render(
      <ArtistCard artist={mockArtist} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('formats followers count correctly for millions', () => {
    render(<ArtistCard artist={mockArtist} />);
    expect(screen.getByText('1.5M seguidores')).toBeInTheDocument();
  });

  it('formats followers count correctly for thousands', () => {
    const artistWithThousands = {
      ...mockArtist,
      followers: { href: null, total: 5500 },
    };

    render(<ArtistCard artist={artistWithThousands} />);
    expect(screen.getByText('5.5K seguidores')).toBeInTheDocument();
  });

  it('formats followers count correctly for small numbers', () => {
    render(<ArtistCard artist={mockArtistLowPopularity} />);
    expect(screen.getByText('500 seguidores')).toBeInTheDocument();
  });

  it('displays high popularity indicator for artists with popularity > 80', () => {
    render(<ArtistCard artist={mockArtist} />);

    // Verifica se o ícone de estrela está presente (indicador de alta popularidade)
    const popularityIndicator = screen
      .getByRole('img', { name: 'Test Artist' })
      .closest('div')
      ?.querySelector('.absolute.-top-1.-right-1');
    expect(popularityIndicator).toBeInTheDocument();
  });

  it('does not display high popularity indicator for artists with popularity <= 80', () => {
    render(<ArtistCard artist={mockArtistLowPopularity} />);

    // Verifica se o indicador de alta popularidade não está presente
    const popularityIndicator = screen
      .getByRole('img', { name: 'Test Artist' })
      .closest('div')
      ?.querySelector('.absolute.-top-1.-right-1');
    expect(popularityIndicator).not.toBeInTheDocument();
  });

  it('displays popularity stars correctly', () => {
    render(<ArtistCard artist={mockArtist} />);

    // Verifica se as estrelas de popularidade estão presentes
    const starsContainer = screen.getByText(/Popularidade:/).parentElement;
    const stars = starsContainer?.querySelectorAll('svg[viewBox="0 0 24 24"]');

    // Deve ter 5 estrelas (base) + estrelas preenchidas
    expect(stars?.length).toBeGreaterThan(5);
  });

  it('handles artist without images', () => {
    render(<ArtistCard artist={mockArtistWithoutImage} />);

    const image = screen.getByAltText('Test Artist');
    expect(image).toBeInTheDocument();
  });

  it('handles artist with zero followers', () => {
    const artistWithZeroFollowers = {
      ...mockArtist,
      followers: {
        total: 0,
      },
    };

    render(<ArtistCard artist={artistWithZeroFollowers} />);
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('0 seguidores')).toBeInTheDocument();
  });

  it('handles artist without genres', () => {
    const artistWithoutGenres = {
      ...mockArtist,
      genres: [],
    };

    render(<ArtistCard artist={artistWithoutGenres} />);
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.queryByText('rock, alternative')).not.toBeInTheDocument();
  });

  it('limits genres display to first 2', () => {
    const artistWithManyGenres = {
      ...mockArtist,
      genres: ['rock', 'alternative', 'indie', 'pop', 'electronic'],
    };

    render(<ArtistCard artist={artistWithManyGenres} />);
    expect(screen.getByText('rock, alternative')).toBeInTheDocument();
    expect(screen.queryByText('indie')).not.toBeInTheDocument();
  });

  it('handles image loading state', async () => {
    mocks.useImageCache.mockReturnValue({
      imageUrl: null,
      isLoading: true,
    });

    render(<ArtistCard artist={mockArtist} />);

    // Verifica se o skeleton de loading está presente
    const loadingSkeleton = screen.getByLabelText(/loading/i);
    expect(loadingSkeleton).toBeInTheDocument();
  });

  it('handles image error by setting fallback', async () => {
    vi.doMock('@/hooks/useImageCache', () => ({
      useImageCache: vi.fn(() => ({
        imageUrl: 'https://example.com/artist-image.jpg',
        isLoading: false,
      })),
    }));

    render(<ArtistCard artist={mockArtist} />);

    const image = (await screen.findByTestId(
      `artist-image-${mockArtist.id}`
    )) as HTMLImageElement;

    // Simula erro na imagem
    fireEvent.error(image);

    // Verifica se a imagem de fallback foi definida
    expect(image.src).toContain('unsplash.com');
  });

  it('does not call onClick when onClick is not provided', () => {
    render(<ArtistCard artist={mockArtist} />);

    const clickableArea = screen.getByTestId('artist-card-clickable-area');

    // Não deve gerar erro ao clicar sem onClick
    expect(() => fireEvent.click(clickableArea)).not.toThrow();
  });
});
