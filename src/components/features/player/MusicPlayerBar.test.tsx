import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

// 🔧 Mock do contexto do Spotify Player
const mockTogglePlay = vi.fn();
const mockNextTrack = vi.fn();
const mockPreviousTrack = vi.fn();
const mockSeek = vi.fn();
const mockSetVolume = vi.fn();
const mockToggleShuffle = vi.fn();
const mockToggleRepeat = vi.fn();

vi.mock('@/contexts', () => ({
  useSpotifyPlayerContext: vi.fn(() => ({
    togglePlay: mockTogglePlay,
    nextTrack: mockNextTrack,
    previousTrack: mockPreviousTrack,
    seek: mockSeek,
    setVolume: mockSetVolume,
    toggleShuffle: mockToggleShuffle,
    toggleRepeat: mockToggleRepeat,
    isReady: true,
    deviceId: 'test-device-id',
  })),
}));

// 🔧 Mock da store do player
import MusicPlayerBar from './MusicPlayerBar';

vi.mock('@/store/playerStore', () => ({
  usePlayerStore: vi.fn(() => ({
    isPlaying: false,
    currentTrack: {
      id: 'track123',
      name: 'Test Song',
      artists: [{ name: 'Test Artist' }],
      album: { name: 'Test Album', images: [{ url: 'cover.jpg' }] },
    },
    volume: 50,
    progress: 45,
    duration: 120,
    shuffle: false,
    repeat: 'off',
    setVolume: vi.fn(),
  })),
}));

// 🔧 Mock do hook de favoritos
const mockToggleFavorite = vi.fn();

vi.mock('@/hooks/useFavorites', () => ({
  useFavorites: vi.fn(() => ({
    isFavorited: false,
    toggleFavorite: mockToggleFavorite,
    isLoading: false,
  })),
}));

// 🔧 Mock do utilitário formatDuration
vi.mock('@/utils/format', () => ({
  formatDuration: (seconds: number) => `${seconds}s`,
}));

describe('MusicPlayerBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders track information correctly', () => {
    render(<MusicPlayerBar />);
    expect(screen.getAllByText('Test Song')).toHaveLength(2); // Mobile + Desktop
    expect(screen.getAllByText('Test Artist')).toHaveLength(2); // Mobile + Desktop
  });

  it('calls Spotify controls when buttons are clicked', () => {
    render(<MusicPlayerBar />);

    fireEvent.click(screen.getByTestId('play-pause-button-desktop'));
    fireEvent.click(screen.getByTestId('next-button-desktop'));
    fireEvent.click(screen.getByTestId('previous-button-desktop'));

    expect(mockTogglePlay).toHaveBeenCalledTimes(1);
    expect(mockNextTrack).toHaveBeenCalledTimes(1);
    expect(mockPreviousTrack).toHaveBeenCalledTimes(1);
  });

  it('toggles shuffle and repeat modes', () => {
    render(<MusicPlayerBar />);

    fireEvent.click(screen.getByTestId('shuffle-button'));
    expect(mockToggleShuffle).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByTestId('repeat-button'));
    expect(mockToggleRepeat).toHaveBeenCalledTimes(1);
  });

  it('handles favorite button click', () => {
    render(<MusicPlayerBar />);
    const favoriteButton = screen.getByTestId('favorite-button');
    fireEvent.click(favoriteButton);
    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('displays shuffle and repeat active states when enabled', async () => {
    const { usePlayerStore } = await import('@/store/playerStore');
    (
      usePlayerStore as unknown as {
        mockReturnValueOnce: (value: unknown) => void;
      }
    ).mockReturnValueOnce({
      isPlaying: true,
      currentTrack: {
        id: 'track123',
        name: 'Active Song',
        artists: [{ name: 'Active Artist' }],
        album: { name: 'Active Album', images: [{ url: 'cover.jpg' }] },
      },
      volume: 80,
      progress: 20,
      duration: 100,
      shuffle: true,
      repeat: 'track',
      setVolume: vi.fn(),
    });

    render(<MusicPlayerBar />);

    const shuffleButton = screen.getByTestId('shuffle-button');
    const repeatButton = screen.getByTestId('repeat-button');

    expect(shuffleButton).toHaveClass('text-green-500');
    expect(repeatButton).toHaveClass('text-green-500');
  });

  it('renders repeat-one icon when repeat mode is "track"', async () => {
    const { usePlayerStore } = await import('@/store/playerStore');
    (
      usePlayerStore as unknown as {
        mockReturnValueOnce: (value: unknown) => void;
      }
    ).mockReturnValueOnce({
      isPlaying: true,
      currentTrack: {
        id: 'track123',
        name: 'Repeat Test Song',
        artists: [{ name: 'Repeat Artist' }],
        album: { name: 'Repeat Album', images: [{ url: 'cover.jpg' }] },
      },
      volume: 60,
      progress: 0,
      duration: 120,
      shuffle: false,
      repeat: 'track',
      setVolume: vi.fn(),
    });

    render(<MusicPlayerBar />);

    expect(
      screen.getByTestId('repeat-button').querySelector('svg')
    ).toBeInTheDocument();
  });
});
