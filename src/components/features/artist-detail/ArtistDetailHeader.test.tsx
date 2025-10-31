import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ArtistDetailHeader } from './ArtistDetailHeader';
import type { Artist } from '@/types';

// Mock do react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock do ícone do lucide-react
vi.mock('lucide-react', () => ({
  ArrowLeft: vi.fn(({ className, ...props }) => (
    <svg data-testid="arrow-left-icon" className={className} {...props}>
      <title>ArrowLeft</title>
    </svg>
  )),
}));

// Wrapper para o Router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ArtistDetailHeader', () => {
  const mockArtist: Artist = {
    id: '1',
    name: 'Test Artist',
    uri: 'spotify:artist:1',
    images: [
      {
        url: 'https://example.com/artist-image.jpg',
        height: 640,
        width: 640,
      },
    ],
    genres: ['rock', 'alternative', 'indie'],
    popularity: 85,
    followers: {
      total: 1234567,
    },
    external_urls: {
      spotify: 'https://open.spotify.com/artist/1',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with artist data', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    expect(screen.getByRole('heading', { name: 'Test Artist' })).toBeInTheDocument();
    expect(screen.getByText('1,234,567 seguidores')).toBeInTheDocument();
    expect(screen.getByText('rock, alternative, indie')).toBeInTheDocument();
  });

  it('displays artist image when available', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    const image = screen.getByAltText('Test Artist');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/artist-image.jpg');
    expect(image).toHaveClass('w-24', 'h-24', 'rounded-full', 'object-cover', 'mr-6');
  });

  it('does not display image when not available', () => {
    const artistWithoutImage = {
      ...mockArtist,
      images: [],
    };
    
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={artistWithoutImage} />
      </RouterWrapper>
    );
    
    expect(screen.queryByAltText('Test Artist')).not.toBeInTheDocument();
  });

  it('navigates back to artists page when back button is clicked', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/artists');
  });

  it('displays arrow left icon in back button', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    const arrowIcon = screen.getByTestId('arrow-left-icon');
    expect(arrowIcon).toBeInTheDocument();
    expect(arrowIcon).toHaveClass('w-6', 'h-6', 'mr-2');
  });

  it('displays artist name in back button', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    const backButton = screen.getByRole('button');
    expect(backButton).toHaveTextContent('Test Artist');
  });

  it('displays artist name as main heading', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Test Artist');
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'mb-2');
  });

  it('formats followers count correctly', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('1,234,567 seguidores')).toBeInTheDocument();
  });

  it('handles zero followers', () => {
    const artistWithZeroFollowers = {
      ...mockArtist,
      followers: {
        total: 0,
      },
    };
    
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={artistWithZeroFollowers} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('0 seguidores')).toBeInTheDocument();
  });

  it('handles undefined followers', () => {
    const artistWithoutFollowers = {
      ...mockArtist,
    };
    delete (artistWithoutFollowers as any).followers;
    
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={artistWithoutFollowers as Artist} />
      </RouterWrapper>
    );
    
    // Deve renderizar sem erro, mas não mostrar seguidores
    expect(screen.getByRole('heading', { name: 'Test Artist' })).toBeInTheDocument();
    expect(screen.queryByText(/seguidores/)).not.toBeInTheDocument();
  });

  it('displays genres when available', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('rock, alternative, indie')).toBeInTheDocument();
  });

  it('limits genres display to first 3', () => {
    const artistWithManyGenres = {
      ...mockArtist,
      genres: ['rock', 'alternative', 'indie', 'pop', 'electronic', 'metal'],
    };
    
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={artistWithManyGenres} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('rock, alternative, indie')).toBeInTheDocument();
    expect(screen.queryByText(/pop/)).not.toBeInTheDocument();
    expect(screen.queryByText(/electronic/)).not.toBeInTheDocument();
  });

  it('does not display genres when empty', () => {
    const artistWithoutGenres = {
      ...mockArtist,
      genres: [],
    };
    
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={artistWithoutGenres} />
      </RouterWrapper>
    );
    
    expect(screen.queryByText('rock, alternative, indie')).not.toBeInTheDocument();
  });

  it('does not display genres when undefined', () => {
    const artistWithoutGenres = {
      ...mockArtist,
    };
    delete (artistWithoutGenres as any).genres;
    
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={artistWithoutGenres as Artist} />
      </RouterWrapper>
    );
    
    expect(screen.queryByText('rock, alternative, indie')).not.toBeInTheDocument();
  });

  it('has correct styling classes for back button', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    const backButton = screen.getByRole('button');
    expect(backButton).toHaveClass(
      'flex',
      'items-center',
      'text-white',
      'hover:text-green-500',
      'transition-colors',
      'mr-4'
    );
  });

  it('has correct styling for followers text', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    const followersText = screen.getByText('1,234,567 seguidores');
    expect(followersText).toHaveClass('text-gray-400', 'text-sm');
  });

  it('has correct styling for genres text', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    const genresText = screen.getByText('rock, alternative, indie');
    expect(genresText).toHaveClass('text-gray-400', 'text-sm', 'mt-1');
  });

  it('handles artist with single genre', () => {
    const artistWithSingleGenre = {
      ...mockArtist,
      genres: ['rock'],
    };
    
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={artistWithSingleGenre} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('rock')).toBeInTheDocument();
  });

  it('handles artist with two genres', () => {
    const artistWithTwoGenres = {
      ...mockArtist,
      genres: ['rock', 'alternative'],
    };
    
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={artistWithTwoGenres} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('rock, alternative')).toBeInTheDocument();
  });

  it('handles large follower numbers', () => {
    const artistWithManyFollowers = {
      ...mockArtist,
      followers: {
        total: 50000000,
      },
    };
    
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={artistWithManyFollowers} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('50,000,000 seguidores')).toBeInTheDocument();
  });

  it('has proper component structure', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    // Verifica se existe um container principal
    const mainContainer = screen.getByRole('button').closest('div')?.parentElement;
    expect(mainContainer).toBeInTheDocument();
    
    // Verifica se existe um container para o botão de voltar
    const buttonContainer = screen.getByRole('button').closest('div');
    expect(buttonContainer).toHaveClass('flex', 'items-center', 'p-6', 'pb-0');
    
    // Verifica se existe um container para as informações do artista
    const infoContainer = screen.getByRole('heading').closest('div')?.parentElement;
    expect(infoContainer).toHaveClass('flex', 'items-center', 'p-6', 'pt-4');
  });

  it('handles artist name in both button and heading', () => {
    render(
      <RouterWrapper>
        <ArtistDetailHeader artist={mockArtist} />
      </RouterWrapper>
    );
    
    // Verifica se o nome aparece no botão
    const backButton = screen.getByRole('button');
    expect(backButton).toHaveTextContent('Test Artist');
    
    // Verifica se o nome aparece no heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Test Artist');
  });
});