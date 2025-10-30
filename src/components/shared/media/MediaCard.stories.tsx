import type { Meta, StoryObj } from '@storybook/react';
import type { Artist } from '@/types';
import { MediaCard, AlbumCard, PlaylistCard } from './MediaCard';
import { ArtistCard } from './ArtistCard';

const meta: Meta<typeof MediaCard> = {
  title: 'Shared/Media/MediaCard',
  component: MediaCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Componente genérico para cards de mídia (Artista, Álbum, Playlist).

## Acessibilidade
- Semântica HTML5 apropriada para cada tipo de mídia
- Aria-labels para botões de play
- Navegação por teclado suportada
- Estruturas headings adequadas para screen readers

## Variações
- **ArtistCard**: Circular, mostra seguidores
- **AlbumCard**: Quadrado, mostra artistas e data
- **PlaylistCard**: Quadrado, mostra descrição e contagem de faixas
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['artist', 'album', 'playlist'],
      description: 'Tipo de mídia do card',
    },
    isLoading: {
      control: 'boolean',
      description: 'Estado de carregamento',
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais',
    },
    subtitle: {
      control: 'text',
      description: 'Subtítulo do card',
    },
    metadata: {
      control: 'text',
      description: 'Metadados adicionais',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Dados mock para os stories
const mockArtist: Artist = {
  id: '1',
  name: 'Taylor Swift',
  images: [
    { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop', width: 300, height: 300 }
  ],
  uri: 'spotify:artist:1',
  followers: { total: 82345678, href: null },
  genres: ['pop', 'country'],
  popularity: 95,
  external_urls: { spotify: 'https://open.spotify.com/artist/1' },
  href: 'https://api.spotify.com/v1/artists/1',
  type: 'artist'
};

const mockAlbum = {
  id: '1',
  name: 'Midnights',
  images: [
    { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop', width: 300, height: 300 }
  ],
  uri: 'spotify:album:1',
  artists: [{ name: 'Taylor Swift' }],
  release_date: '2022-10-21',
  total_tracks: 13,
  album_type: 'album' as const,
  external_urls: { spotify: 'https://open.spotify.com/album/1' }
} as any;

const mockPlaylist = {
  id: '1',
  name: 'My Favorite Songs',
  images: [
    { url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop', width: 300, height: 300 }
  ],
  uri: 'spotify:playlist:1',
  description: 'All my favorite tracks in one place',
  tracks: { total: 42 }
};

// Story principal do MediaCard genérico
export const Default: Story = {
  args: {
    item: mockAlbum,
    type: 'album',
    isLoading: false,
    subtitle: 'Taylor Swift',
    metadata: '2022',
  },
};

// Stories para cada tipo específico
export const ArtistCardStory: Story = {
  render: () => (
    <div className="flex gap-6">
      <ArtistCard
        artist={mockArtist}
        onClick={(artist) => console.log('Navigate to:', artist.id)}
        onPlay={(artist) => console.log('Play artist:', artist.name)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card de artista com formato circular e contador de seguidores.',
      },
    },
  },
};

export const Album: Story = {
  render: () => (
    <div className="flex gap-6">
      <AlbumCard
        item={mockAlbum}
        onPlay={(album) => console.log('Play album:', album.name)}
        onClick={(album) => console.log('Navigate to:', album.id)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card de álbum mostrando artistas e ano de lançamento.',
      },
    },
  },
};

export const Playlist: Story = {
  render: () => (
    <div className="flex gap-6">
      <PlaylistCard
        item={mockPlaylist}
        onPlay={(playlist) => console.log('Play playlist:', playlist.name)}
        onClick={(playlist) => console.log('Navigate to:', playlist.id)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card de playlist mostrando descrição e contagem de faixas.',
      },
    },
  },
};

// Story com loading state
export const Loading: Story = {
  render: () => (
    <div className="flex gap-6">
      <MediaCard
        item={mockAlbum}
        type="album"
        isLoading={true}
      />
      <MediaCard
        item={mockArtist}
        type="artist"
        isLoading={true}
      />
      <MediaCard
        item={mockPlaylist}
        type="playlist"
        isLoading={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cards em estado de carregamento com skeletons animados.',
      },
    },
  },
};

// Grid de cards
export const Grid: Story = {
  render: () => {
    const artists = Array.from({ length: 6 }, (_, i) => ({
      ...mockArtist,
      id: String(i),
      name: `Artist ${i + 1}`,
      followers: { total: Math.floor(Math.random() * 10000000), href: null }
    }));

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onClick={(artist) => console.log('Navigate to:', artist.id)}
            onPlay={(artist) => console.log('Play artist:', artist.name)}
          />
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid responsivo de cards demonstrando layout real de aplicação.',
      },
    },
  },
};

// Story de acessibilidade
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Navegação por Teclado</h2>
        <p className="text-sm text-gray-600 mb-4">
          Use Tab para navegar entre os cards, Enter para ativar botões de play.
        </p>
        <div className="flex gap-6">
          <ArtistCard
            artist={mockArtist}
            onClick={(artist) => console.log('Navigate to:', artist.id)}
            onPlay={(artist) => console.log('Play artist:', artist.name)}
          />
          <AlbumCard
            item={mockAlbum}
            onPlay={(album) => console.log('Play album:', album.name)}
            onClick={(album) => console.log('Navigate to:', album.id)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Screen Reader Support</h2>
        <p className="text-sm text-gray-600">
          Cards possuem aria-labels descritivas e estruturas semânticas adequadas.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração das funcionalidades de acessibilidade implementadas.',
      },
    },
  },
};