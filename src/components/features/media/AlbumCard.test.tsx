import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { AlbumCard } from './AlbumCard';
import type { Album } from '@/types';

// Mock do hook useImageCache
vi.mock('@/hooks/useImageCache', () => ({
  useImageCache: vi.fn(() => ({
    imageUrl: 'https://example.com/album-image.jpg',
    isLoading: false
  }))
}));

// Mock do componente Button
vi.mock('@/components/ui', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}));

const mockAlbum: Album = {
  id: '1',
  name: 'Test Album',
  images: [
    {
      url: 'https://example.com/album-image.jpg',
      height: 640,
      width: 640
    }
  ],
  artists: [
    {
      id: 'artist1',
      name: 'Test Artist',
      images: [],
      genres: [],
      popularity: 80,
      followers: { total: 1000 },
      external_urls: { spotify: 'https://open.spotify.com/artist/artist1' },
      uri: 'artist:1'
    }
  ],
  release_date: '2023-01-15',
  total_tracks: 12,
  album_type: 'album',
  external_urls: {
    spotify: 'https://open.spotify.com/album/1'
  },
  uri: 'artist:1'
};

describe('AlbumCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders album information correctly', () => {
    render(<AlbumCard album={mockAlbum} />);
    
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('12 faixas')).toBeInTheDocument();
  });

  it('renders album image with correct alt text', () => {
    render(<AlbumCard album={mockAlbum} />);
    
    const image = screen.getByAltText('Capa do álbum Test Album');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/album-image.jpg');
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn();
    render(<AlbumCard album={mockAlbum} onClick={handleClick} />);
    
    const card = screen.getByRole('article');
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockAlbum);
  });

  it('calls onPlay when play button is clicked', () => {
    const handlePlay = vi.fn();
    render(<AlbumCard album={mockAlbum} onPlay={handlePlay} />);
    
    const playButton = screen.getByLabelText('Reproduzir Test Album');
    fireEvent.click(playButton);
    
    expect(handlePlay).toHaveBeenCalledTimes(1);
    expect(handlePlay).toHaveBeenCalledWith(mockAlbum);
  });

  it('prevents card click when play button is clicked', () => {
    const handleClick = vi.fn();
    const handlePlay = vi.fn();
    render(<AlbumCard album={mockAlbum} onClick={handleClick} onPlay={handlePlay} />);
    
    const playButton = screen.getByLabelText('Reproduzir Test Album');
    fireEvent.click(playButton);
    
    expect(handlePlay).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('opens Spotify link when play button is clicked without onPlay handler', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<AlbumCard album={mockAlbum} />);
    
    const playButton = screen.getByLabelText('Reproduzir Test Album');
    fireEvent.click(playButton);
    
    expect(windowOpenSpy).toHaveBeenCalledWith('https://open.spotify.com/album/1', '_blank');
    
    windowOpenSpy.mockRestore();
  });

  it('applies custom className', () => {
    render(<AlbumCard album={mockAlbum} className="custom-album-class" />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass('custom-album-class');
  });

  it('handles album without images', () => {
    const albumWithoutImages = { ...mockAlbum, images: [] };
    render(<AlbumCard album={albumWithoutImages} />);
    
    const image = screen.getByAltText('Capa do álbum Test Album');
    expect(image).toBeInTheDocument();
  });

  it('handles multiple artists correctly', () => {
    const albumWithMultipleArtists = {
      ...mockAlbum,
      artists: [
        ...mockAlbum.artists,
        {
          id: 'artist2',
          name: 'Second Artist',
          images: [],
          genres: [],
          popularity: 75,
          followers: { total: 500 },
          external_urls: { spotify: 'https://open.spotify.com/artist/artist2' },
          uri: 'artist:2'
        }
      ]
    };
    
    render(<AlbumCard album={albumWithMultipleArtists} />);
    
    expect(screen.getByText('Test Artist, Second Artist')).toBeInTheDocument();
  });

  it('formats release date correctly for full date', () => {
    const albumWithFullDate = { ...mockAlbum, release_date: '2023-12-25' };
    render(<AlbumCard album={albumWithFullDate} />);
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('formats release date correctly for year only', () => {
    const albumWithYearOnly = { ...mockAlbum, release_date: '2022' };
    render(<AlbumCard album={albumWithYearOnly} />);
    expect(screen.getByText('2022')).toBeInTheDocument();
  });

  it('formats release date correctly for different date formats', () => {
    render(<AlbumCard album={mockAlbum} />);
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<AlbumCard album={mockAlbum} />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('aria-label', 'Álbum Test Album por Test Artist');
    
    const playButton = screen.getByLabelText('Reproduzir Test Album');
    expect(playButton).toHaveAttribute('aria-label', 'Reproduzir Test Album');
  });
});