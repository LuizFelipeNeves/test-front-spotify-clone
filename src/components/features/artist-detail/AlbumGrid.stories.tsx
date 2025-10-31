import { render, screen, fireEvent } from '@testing-library/react';
import { AlbumGrid } from './AlbumGrid';
import type { Album } from '@/types';

const mockAlbum: Album = {
  id: '1',
  name: 'Album Title',
  artists: [
    {
      id: 'a1',
      name: 'Artist Name',
      images: [
        { url: 'https://via.placeholder.com/50', height: 50, width: 50 },
      ],
      followers: { total: 1000, href: null },
      genres: ['pop'],
      external_urls: { spotify: '' },
      href: '',
      popularity: 70,
      type: 'artist',
      uri: '',
    },
  ],
  images: [{ url: 'https://via.placeholder.com/150', height: 150, width: 150 }],
  release_date: '2023-01-01',
  album_type: 'album',
  external_urls: { spotify: '' },
  total_tracks: 10,
  uri: 'spotify:album:1',
};

describe('AlbumGrid Component', () => {
  it('renders title and albums correctly', () => {
    const albums = Array.from({ length: 4 }, (_, i) => ({
      ...mockAlbum,
      id: String(i),
      name: `Album ${i + 1}`,
    }));

    render(<AlbumGrid title="Albums" albums={albums} onPlay={jest.fn()} />);

    expect(screen.getByText('Albums')).toBeInTheDocument();
    albums.forEach(a => {
      expect(screen.getByText(a.name)).toBeInTheDocument();
    });
  });

  it('renders album images with alt text', () => {
    const albums = [mockAlbum];
    render(<AlbumGrid title="Albums" albums={albums} onPlay={jest.fn()} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockAlbum.images[0].url);
    expect(image).toHaveAttribute('alt', mockAlbum.name);
  });

  it('calls onPlay when an album is clicked', () => {
    const onPlay = jest.fn();
    render(<AlbumGrid title="Albums" albums={[mockAlbum]} onPlay={onPlay} />);

    const albumCard = screen.getByText(mockAlbum.name);
    fireEvent.click(albumCard);

    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay).toHaveBeenCalledWith(mockAlbum);
  });

  it('renders empty state when no albums are provided', () => {
    render(<AlbumGrid title="Albums" albums={[]} onPlay={jest.fn()} />);

    expect(screen.getByText('Albums')).toBeInTheDocument();
    expect(screen.getByText(/nenhum álbum/i)).toBeInTheDocument();
  });

  it('renders correct number of album cards', () => {
    const albums = Array.from({ length: 8 }, (_, i) => ({
      ...mockAlbum,
      id: String(i),
      name: `Album ${i + 1}`,
    }));

    render(<AlbumGrid title="Albums" albums={albums} onPlay={jest.fn()} />);

    const cards = screen.getAllByRole('img');
    expect(cards.length).toBe(8);
  });
});
