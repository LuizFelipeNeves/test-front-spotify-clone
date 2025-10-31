import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AlbumCard } from './AlbumCard';
import type { Album } from '@/types';

// Para o Storybook, não precisamos mockar o useImageCache
// O hook funcionará normalmente com as imagens fornecidas

const meta = {
  title: 'Features/Media/AlbumCard',
  component: AlbumCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### AlbumCard Component

O componente AlbumCard exibe informações de um álbum do Spotify com:
- Imagem do álbum com cache otimizado
- Nome do álbum
- Artistas
- Data de lançamento
- Botão para abrir no Spotify
- Suporte completo à acessibilidade

#### Funcionalidades:
- **Cache de Imagens**: Otimização de carregamento de imagens
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessível**: Suporte a leitores de tela e navegação por teclado
- **Interativo**: Click para abrir no Spotify
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    album: {
      description: 'Objeto do álbum com informações do Spotify',
    },
    onClick: {
      description: 'Função chamada quando o card é clicado',
      action: 'clicked',
    },
    className: {
      description: 'Classes CSS adicionais',
      control: { type: 'text' },
    },
  },
  args: { 
    onClick: fn(),
  },
} satisfies Meta<typeof AlbumCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Álbum de exemplo
const sampleAlbum: Album = {
  id: '1',
  name: 'Abbey Road',
  images: [
    {
      url: 'https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25',
      height: 640,
      width: 640,
    },
    {
      url: 'https://i.scdn.co/image/ab67616d00001e02dc30583ba717007b00cceb25',
      height: 300,
      width: 300,
    },
  ],
  artists: [
    {
      id: '3WrFJ7ztbogyGnTHbHJFl2',
      name: 'The Beatles',
      images: [],
      genres: ['rock', 'pop'],
      popularity: 100,
      followers: {
        total: 50000000,
      },
      external_urls: {
        spotify: 'https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2',
      },
      uri: 'artist:3WrFJ7ztbogyGnTHbHJFl2',
    },
  ],
  release_date: '1969-09-26',
  total_tracks: 17,
  album_type: 'album',
  external_urls: {
    spotify: 'https://open.spotify.com/album/0ETFjACtuP2ADo6LFhL6HN',
  },
  uri: 'album:0ETFjACtuP2ADo6LFhL6HN',
};

export const Default: Story = {
  args: {
    album: sampleAlbum,
  },
};

export const MultipleArtists: Story = {
  args: {
    album: {
      ...sampleAlbum,
      name: 'Bohemian Rhapsody',
      artists: [
        {
          id: '1dfeR4HaWDbWqFHLkxsg1d',
          name: 'Queen',
          images: [],
          genres: ['rock'],
          popularity: 95,
          followers: { total: 30000000 },
          external_urls: {
            spotify: 'https://open.spotify.com/artist/1dfeR4HaWDbWqFHLkxsg1d',
          },
          uri: 'artist:1',
        },
        {
          id: '2',
          name: 'David Bowie',
          images: [],
          genres: ['rock', 'glam rock'],
          popularity: 90,
          followers: { total: 20000000 },
          external_urls: {
            spotify: 'https://open.spotify.com/artist/2',
          },
          uri: 'artist:2',
        },
      ],
    },
  },
};

export const NoImage: Story = {
  args: {
    album: {
      ...sampleAlbum,
      name: 'Album Without Cover',
      images: [],
    },
  },
};

export const LongTitle: Story = {
  args: {
    album: {
      ...sampleAlbum,
      name: 'This Is a Very Long Album Title That Should Be Truncated When Displayed',
      artists: [
        {
          id: '1',
          name: 'Artist with a Very Long Name That Should Also Be Truncated',
          images: [],
          genres: ['pop'],
          popularity: 80,
          followers: { total: 10000000 },
          external_urls: {
            spotify: 'https://open.spotify.com/artist/1',
          },
          uri: 'artist:1',
        },
      ],
    },
  },
};

export const RecentRelease: Story = {
  args: {
    album: {
      ...sampleAlbum,
      name: 'New Album 2024',
      release_date: '2024-01-15',
    },
  },
};

export const VintageAlbum: Story = {
  args: {
    album: {
      ...sampleAlbum,
      name: 'Classic Rock Album',
      release_date: '1975-08-20',
    },
  },
};

export const SingleTrack: Story = {
  args: {
    album: {
      ...sampleAlbum,
      name: 'Single Track',
      total_tracks: 1,
      album_type: 'single',
    },
  },
};

export const EP: Story = {
  args: {
    album: {
      ...sampleAlbum,
      name: 'Extended Play',
      total_tracks: 5,
      album_type: 'compilation',
    },
  },
};

export const CustomClassName: Story = {
  args: {
    album: sampleAlbum,
    className: 'border-2 border-green-500 shadow-lg',
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Interatividade

Este exemplo demonstra a interatividade do AlbumCard:

**Funcionalidades:**
- **Hover**: Efeito visual ao passar o mouse
- **Click**: Abre o álbum no Spotify
- **Keyboard**: Navegação por teclado (Tab, Enter, Space)
- **Focus**: Indicador visual de foco

**Teste a interação:**
1. Passe o mouse sobre o card
2. Clique para "abrir" no Spotify
3. Use Tab para navegar
4. Use Enter/Space para ativar
        `,
      },
    },
  },
  args: {
    album: sampleAlbum,
    onClick: fn(),
  },
};

export const Accessibility: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Acessibilidade

O AlbumCard inclui recursos completos de acessibilidade:

#### Navegação por Teclado
- **Tab**: Navegar para o card
- **Enter/Space**: Ativar o card
- **Escape**: Sair do foco (em modais)

#### Suporte a Leitores de Tela
- **Alt Text**: Descrição da imagem do álbum
- **ARIA Labels**: Rótulos descritivos
- **Semantic HTML**: Estrutura semântica adequada
- **Focus Management**: Gerenciamento adequado do foco

#### Indicadores Visuais
- **Focus Ring**: Anel de foco visível
- **Alto Contraste**: Boas proporções de contraste
- **Feedback Visual**: Feedback claro para interações

#### Lista de Verificação
- [ ] Navegar com Tab
- [ ] Ativar com Enter/Space
- [ ] Foco claramente visível
- [ ] Leitor de tela anuncia informações do álbum
- [ ] Funciona apenas com teclado
- [ ] Respeita prefers-reduced-motion
        `,
      },
    },
  },
  args: {
    album: sampleAlbum,
  },
};

export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Estado de Carregamento

Demonstra como o card se comporta durante o carregamento da imagem:

**Características:**
- Placeholder enquanto a imagem carrega
- Transição suave quando a imagem é carregada
- Fallback para álbuns sem imagem
        `,
      },
    },
  },
  args: {
    album: {
      ...sampleAlbum,
      images: [
        {
          url: 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=Loading...',
          height: 300,
          width: 300,
        },
      ],
    },
  },
};

export const Grid: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
### Layout em Grid

Exemplo de como os AlbumCards aparecem em um layout de grid:
        `,
      },
    },
  },
  args: {
    album: sampleAlbum,
  },
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Álbuns Populares</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AlbumCard album={sampleAlbum} onClick={fn()} />
        <AlbumCard album={{ ...sampleAlbum, name: 'Dark Side of the Moon', artists: [{ id: '2', name: 'Pink Floyd', images: [], genres: ['rock'], popularity: 85, followers: { total: 15000000 }, external_urls: { spotify: '' }, uri: 'artist:2' }] }} onClick={fn()} />
        <AlbumCard album={{ ...sampleAlbum, name: 'Thriller', artists: [{ id: '3', name: 'Michael Jackson', images: [], genres: ['pop'], popularity: 95, followers: { total: 40000000 }, external_urls: { spotify: '' }, uri: 'artist:3' }] }} onClick={fn()} />
        <AlbumCard album={{ ...sampleAlbum, name: 'Back in Black', artists: [{ id: '4', name: 'AC/DC', images: [], genres: ['rock'], popularity: 90, followers: { total: 25000000 }, external_urls: { spotify: '' }, uri: 'artist:4' }] }} onClick={fn()} />
        <AlbumCard album={{ ...sampleAlbum, name: 'The Wall', artists: [{ id: '5', name: 'Pink Floyd', images: [], genres: ['rock'], popularity: 85, followers: { total: 15000000 }, external_urls: { spotify: '' }, uri: 'artist:5' }] }} onClick={fn()} />
      </div>
    </div>
  ),
};

export const GridLayout: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Multiple album cards displayed in a grid layout.',
      },
    },
  },
  args: {
    album: sampleAlbum,
  },
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, i) => (
        <AlbumCard
          key={i}
          album={{
            ...sampleAlbum,
            id: `album-${i}`,
            name: `Album ${i + 1}`,
            artists: [
              {
                id: `artist-${i}`,
                name: `Artist ${i + 1}`,
                images: [],
                genres: ['pop'],
                popularity: 80,
                followers: { total: 1000000 },
                external_urls: {
                  spotify: `https://open.spotify.com/artist/artist-${i}`,
                },
                uri: `artist:artist-${i}`,
              },
            ],
          }}
          onClick={fn()}
        />
      ))}
    </div>
  ),
};