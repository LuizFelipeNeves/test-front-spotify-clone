import type { Meta, StoryObj } from '@storybook/react';
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

// Mock de múltiplos álbuns
const albums = Array.from({ length: 4 }, (_, i) => ({
  ...mockAlbum,
  id: String(i),
  name: `Album ${i + 1}`,
}));

// Default export necessário para o Storybook
const meta: Meta<typeof AlbumGrid> = {
  title: 'Features/ArtistDetail/AlbumGrid',
  component: AlbumGrid,
};

export default meta;
type Story = StoryObj<typeof AlbumGrid>;

// Story padrão
export const Default: Story = {
  args: {
    title: 'Albums',
    albums,
    onPlay: () => {},
  },
};

// Story com álbumes vazios
export const Empty: Story = {
  args: {
    title: 'Albums',
    albums: [],
    onPlay: () => {},
  },
};

// Story com mais álbuns
export const ManyAlbums: Story = {
  args: {
    title: 'Albums',
    albums: Array.from({ length: 8 }, (_, i) => ({
      ...mockAlbum,
      id: String(i),
      name: `Album ${i + 1}`,
    })),
    onPlay: () => {},
  },
};
