import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Playlist } from '@/types';

// Mock dos hooks e contextos
vi.mock('@/contexts', () => ({
  useSpotifyPlayerContext: vi.fn(() => ({
    playTrack: vi.fn(),
    isReady: true,
    deviceId: 'test-device-id',
  })),
  SpotifyPlayerProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import { PlaylistCard } from './PlaylistCard';

vi.mock('@/hooks/useSpotifyQueries', () => ({
  usePlaylistTracks: vi.fn(() => ({
    data: {
      items: [
        {
          track: {
            id: 'track1',
            name: 'Test Track 1',
            artists: [{ name: 'Test Artist' }],
          },
        },
        {
          track: {
            id: 'track2',
            name: 'Test Track 2',
            artists: [{ name: 'Test Artist 2' }],
          },
        },
      ],
    },
  })),
}));

vi.mock('@/store/playerStore', () => ({
  usePlayerStore: vi.fn(() => ({
    setCurrentTrack: vi.fn(),
    setQueue: vi.fn(),
    setIsPlaying: vi.fn(),
  })),
}));

vi.mock('@/contexts/SpotifyPlayerContext', () => ({
  useSpotifyPlayerContext: vi.fn(() => ({
    playTrack: vi.fn(),
    isReady: true,
  })),
}));

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

vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((input) => input),
  },
}));

const mockPlaylist: Playlist = {
  id: '1',
  name: 'Test Playlist',
  description: 'A test playlist description',
  images: [
    {
      url: 'https://example.com/playlist-image.jpg',
      height: 300,
      width: 300,
    },
  ],
  owner: {
    id: 'user1',
    display_name: 'Test User',
  },
  tracks: {
    total: 25,
    items: [],
  },
  public: true,
  collaborative: false,
  external_urls: {
    spotify: 'https://open.spotify.com/playlist/1',
  },
  uri: 'spotify:playlist:1',
};

const mockPrivatePlaylist: Playlist = {
  ...mockPlaylist,
  public: false,
  collaborative: true,
};

const mockPlaylistWithoutImage: Playlist = {
  ...mockPlaylist,
  images: [],
};

const mockPlaylistWithoutDescription: Playlist = {
  ...mockPlaylist,
  description: '',
};

describe('PlaylistCard', () => {
  beforeEach(() => {
    mocks.useImageCache.mockReturnValue({
      imageUrl: 'https://example.com/playlist-image.jpg',
      isLoading: false,
    });
  });
 

  it('renders playlist information correctly', () => {
    render(<PlaylistCard playlist={mockPlaylist} />);
    
    expect(screen.getByText('Test Playlist')).toBeInTheDocument();
    expect(screen.getByText('Por Test User')).toBeInTheDocument();
    expect(screen.getByText('25 músicas')).toBeInTheDocument();
    expect(screen.getByText('A test playlist description')).toBeInTheDocument();
  });

  it('renders playlist image with correct alt text', () => {
    render(<PlaylistCard playlist={mockPlaylist} />);
    
    const image = screen.getByAltText('Test Playlist');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/playlist-image.jpg');
  });

  it('calls onClick when card is clicked', () => {
    const mockOnClick = vi.fn();
    render(<PlaylistCard playlist={mockPlaylist} onClick={mockOnClick} />);
    
    const card = screen.getByTestId('playlist-card');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledWith(mockPlaylist);
  });

  it('applies custom className', () => {
    render(<PlaylistCard playlist={mockPlaylist} className="custom-class" />);
    
    const card = screen.getByTestId('playlist-card');
    expect(card).toHaveClass('custom-class');
  });

  it('formats track count correctly for single track', () => {
    const singleTrackPlaylist = {
      ...mockPlaylist,
      tracks: { total: 1, items: [] },
    };
    
    render(<PlaylistCard playlist={singleTrackPlaylist} />);
    expect(screen.getByText('1 música')).toBeInTheDocument();
  });

  it('formats track count correctly for multiple tracks', () => {
    render(<PlaylistCard playlist={mockPlaylist} />);
    expect(screen.getByText('25 músicas')).toBeInTheDocument();
  });

  it('displays public indicator for public playlists', () => {
    render(<PlaylistCard playlist={mockPlaylist} />);
    expect(screen.getByText('Pública')).toBeInTheDocument();
  });

  it('displays private and collaborative indicators correctly', () => {
    render(<PlaylistCard playlist={mockPrivatePlaylist} />);
    expect(screen.getByText('Privada')).toBeInTheDocument();
    expect(screen.getByText('Colaborativa')).toBeInTheDocument();
  });

  it('handles playlist without images', () => {
    render(<PlaylistCard playlist={mockPlaylistWithoutImage} />);
    
    const image = screen.getByAltText('Test Playlist');
    expect(image).toBeInTheDocument();
  });

  it('handles playlist without description', () => {
    render(<PlaylistCard playlist={mockPlaylistWithoutDescription} />);
    
    expect(screen.getByText('Test Playlist')).toBeInTheDocument();
    expect(screen.queryByText('A test playlist description')).not.toBeInTheDocument();
  });

  it('displays play button when playlist has tracks', () => {
    render(<PlaylistCard playlist={mockPlaylist} />);
    
    const playButton = screen.getByLabelText('Reproduzir Test Playlist');
    expect(playButton).toBeInTheDocument();
  });

  it('handles play button click', async () => {
    const mockSetCurrentTrack = vi.fn();
    const mockSetQueue = vi.fn();
    const mockSetIsPlaying = vi.fn();
    const mockPlayTrack = vi.fn();

    const { usePlayerStore } = await import('@/store/playerStore');
    const { useSpotifyPlayerContext } = await import('@/contexts');

    (usePlayerStore as unknown as { mockReturnValue: (value: unknown) => void }).mockReturnValue({
      setCurrentTrack: mockSetCurrentTrack,
      setQueue: mockSetQueue,
      setIsPlaying: mockSetIsPlaying,
    });

    (useSpotifyPlayerContext as unknown as { mockReturnValue: (value: unknown) => void }).mockReturnValue({
      playTrack: mockPlayTrack,
      isReady: true,
    });

    render(<PlaylistCard playlist={mockPlaylist} />);
    
    const playButton = screen.getByLabelText('Reproduzir Test Playlist');
    fireEvent.click(playButton);

    expect(mockSetCurrentTrack).toHaveBeenCalled();
    expect(mockSetQueue).toHaveBeenCalled();
    expect(mockSetIsPlaying).toHaveBeenCalledWith(true);
  });

  it('handles play button click when player is not ready', async () => {
    const mockSetCurrentTrack = vi.fn();
    const mockSetQueue = vi.fn();
    const mockSetIsPlaying = vi.fn();
    const mockPlayTrack = vi.fn();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { usePlayerStore } = await import('@/store/playerStore');
    const { useSpotifyPlayerContext } = await import('@/contexts');

    (usePlayerStore as unknown as { mockReturnValue: (value: unknown) => void }).mockReturnValue({
      setCurrentTrack: mockSetCurrentTrack,
      setQueue: mockSetQueue,
      setIsPlaying: mockSetIsPlaying,
    });

    (useSpotifyPlayerContext as unknown as { mockReturnValue: (value: unknown) => void }).mockReturnValue({
      playTrack: mockPlayTrack,
      isReady: false,
    });

    render(<PlaylistCard playlist={mockPlaylist} />);
    
    const playButton = screen.getByLabelText('Reproduzir Test Playlist');
    fireEvent.click(playButton);

    expect(consoleSpy).toHaveBeenCalledWith('Player não está pronto.');
    consoleSpy.mockRestore();
  });

  it('handles playlist without tracks', async () => {
    const { usePlaylistTracks } = await import('@/hooks/useSpotifyQueries');
    (usePlaylistTracks as any).mockReturnValue({
      data: { items: [] },
    });

    render(<PlaylistCard playlist={mockPlaylist} />);
    
    // Play button should not be visible when there are no tracks
    expect(screen.queryByLabelText('Reproduzir Test Playlist')).not.toBeInTheDocument();
  });

  it('handles image loading state', async () => {
    mocks.useImageCache.mockReturnValue({
      imageUrl: null,
      isLoading: true,
    });

    render(<PlaylistCard playlist={mockPlaylist} />);
    
    // Should show loading skeleton
    const loadingSkeleton = screen.getByRole('status', { name: /loading/i });
    expect(loadingSkeleton).toBeInTheDocument();
  });

  it('handles image error by setting fallback', async () => {
    render(<PlaylistCard playlist={mockPlaylist} />);
    
    const image = await screen.findByTestId(`playlist-image-${mockPlaylist.id}`) as HTMLImageElement;
    
    // Simulate image error
    fireEvent.error(image);
    
    // Should set fallback image
    expect(image.src).toContain('unsplash.com');
  });

  it('sanitizes playlist description', async () => {
    const DOMPurify = (await import('dompurify')).default;
    const playlistWithHtml = {
      ...mockPlaylist,
      description: '<script>alert("xss")</script>Safe description',
    };

    render(<PlaylistCard playlist={playlistWithHtml} />);
    
    expect(DOMPurify.sanitize).toHaveBeenCalledWith('<script>alert("xss")</script>Safe description');
  });

  it('has correct accessibility attributes', () => {
    render(<PlaylistCard playlist={mockPlaylist} />);
    
    const card = screen.getByTestId('playlist-card');
    expect(card).toHaveAttribute('aria-label');
    expect(card.getAttribute('aria-label')).toContain('Playlist Test Playlist');
    expect(card.getAttribute('aria-label')).toContain('Por Test User');
    expect(card.getAttribute('aria-label')).toContain('25 músicas');
  });

  it('does not call onClick when onClick is not provided', () => {
    render(<PlaylistCard playlist={mockPlaylist} />);
    
    const card = screen.getByTestId('playlist-card');
    
    // Should not throw error when clicking without onClick
    expect(() => fireEvent.click(card)).not.toThrow();
  });

  it('stops propagation when play button is clicked', async () => {
    const { usePlaylistTracks } = await import('@/hooks/useSpotifyQueries');
    (usePlaylistTracks as any).mockReturnValue({
      data: { items: [{ track: { id: '1', name: 'Track 1' } }] },
    });

    const mockOnClick = vi.fn();
    render(<PlaylistCard playlist={mockPlaylist} onClick={mockOnClick} />);
    
    const playButton = await screen.findByLabelText('Reproduzir Test Playlist');
    fireEvent.click(playButton);
    
    // onClick should not be called when play button is clicked
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});