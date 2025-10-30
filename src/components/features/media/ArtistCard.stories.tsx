import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { vi } from 'vitest';
import { ArtistCard } from './ArtistCard';
import type { Artist } from '@/types';

// Mock do hook useImageCache
const mockUseImageCache = {
  imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb12d5ab979779aa21d5b8b2b1',
  isLoading: false,
};

vi.mock('@/hooks/useImageCache', () => ({
  useImageCache: () => mockUseImageCache,
}));

const meta = {
  title: 'Features/Media/ArtistCard',
  component: ArtistCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### ArtistCard Component

O componente ArtistCard exibe informações de um artista do Spotify com:
- Imagem do artista com cache otimizado
- Nome do artista
- Número de seguidores formatado
- Gêneros musicais
- Indicador de popularidade com estrelas
- Layout responsivo (vertical em mobile, horizontal em desktop)
- Suporte completo à acessibilidade

#### Funcionalidades:
- **Cache de Imagens**: Otimização de carregamento de imagens
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessível**: Suporte a leitores de tela e navegação por teclado
- **Interativo**: Click para navegar para o artista
- **Indicadores Visuais**: Popularidade e status destacado
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    artist: {
      description: 'Objeto do artista com informações do Spotify',
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
} satisfies Meta<typeof ArtistCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Artista de exemplo
const sampleArtist: Artist = {
  id: '3WrFJ7ztbogyGnTHbHJFl2',
  name: 'The Beatles',
  images: [
    {
      url: 'https://i.scdn.co/image/ab6761610000e5eb12d5ab979779aa21d5b8b2b1',
      height: 640,
      width: 640,
    },
    {
      url: 'https://i.scdn.co/image/ab67616100005174e9348cc01ff5d55971b22433',
      height: 300,
      width: 300,
    },
  ],
  genres: ['rock', 'pop', 'psychedelic rock'],
  popularity: 85,
  followers: {
    total: 21234567,
  },
  external_urls: {
    spotify: 'https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2',
  },
};

export const Default: Story = {
  args: {
    artist: sampleArtist,
  },
};

export const HighPopularity: Story = {
  args: {
    artist: {
      ...sampleArtist,
      name: 'Taylor Swift',
      popularity: 95,
      followers: {
        total: 89234567,
      },
      genres: ['pop', 'country', 'folk'],
    },
  },
};

export const MediumPopularity: Story = {
  args: {
    artist: {
      ...sampleArtist,
      name: 'Arctic Monkeys',
      popularity: 65,
      followers: {
        total: 8234567,
      },
      genres: ['indie rock', 'alternative rock'],
    },
  },
};

export const LowPopularity: Story = {
  args: {
    artist: {
      ...sampleArtist,
      name: 'Local Band',
      popularity: 25,
      followers: {
        total: 1234,
      },
      genres: ['indie', 'experimental'],
    },
  },
};

export const NoImage: Story = {
  args: {
    artist: {
      ...sampleArtist,
      name: 'Artist Without Photo',
      images: [],
    },
  },
};

export const LongName: Story = {
  args: {
    artist: {
      ...sampleArtist,
      name: 'This Is a Very Long Artist Name That Should Be Truncated Properly',
      genres: ['very long genre name', 'another extremely long genre name'],
    },
  },
};

export const ManyGenres: Story = {
  args: {
    artist: {
      ...sampleArtist,
      name: 'Multi-Genre Artist',
      genres: ['rock', 'pop', 'jazz', 'blues', 'country', 'electronic', 'classical'],
    },
  },
};

export const FewFollowers: Story = {
  args: {
    artist: {
      ...sampleArtist,
      name: 'Emerging Artist',
      popularity: 15,
      followers: {
        total: 567,
      },
      genres: ['indie', 'alternative'],
    },
  },
};

export const MillionFollowers: Story = {
  args: {
    artist: {
      ...sampleArtist,
      name: 'Global Superstar',
      popularity: 92,
      followers: {
        total: 45678901,
      },
      genres: ['pop', 'dance'],
    },
  },
};

export const CustomClassName: Story = {
  args: {
    artist: sampleArtist,
    className: 'border-2 border-purple-500 shadow-lg',
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Interatividade

Este exemplo demonstra a interatividade do ArtistCard:

**Funcionalidades:**
- **Hover**: Efeito visual ao passar o mouse
- **Click**: Navega para a página do artista
- **Keyboard**: Navegação por teclado (Tab, Enter, Space)
- **Focus**: Indicador visual de foco

**Teste a interação:**
1. Passe o mouse sobre o card
2. Clique para "navegar" para o artista
3. Use Tab para navegar
4. Use Enter/Space para ativar
        `,
      },
    },
  },
  args: {
    artist: sampleArtist,
    onClick: fn(),
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
- Placeholder animado enquanto a imagem carrega
- Ícone de usuário como indicador visual
- Transição suave quando a imagem é carregada
        `,
      },
    },
  },
  args: {
    artist: sampleArtist,
  },
  beforeEach: () => {
    // Mock para simular carregamento
    vi.mocked(mockUseImageCache).isLoading = true;
  },
};

export const Grid: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
### Layout em Grid

Exemplo de como os ArtistCards aparecem em um layout de grid:
        `,
      },
    },
  },
  args: {
    artist: sampleArtist,
  },
  render: () => (
    <div className="p-6 bg-gray-950">
      <h2 className="text-2xl font-bold mb-4 text-white">Artistas Populares</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ArtistCard artist={sampleArtist} onClick={fn()} />
        <ArtistCard 
          artist={{ 
            ...sampleArtist, 
            name: 'Taylor Swift', 
            popularity: 95,
            followers: { total: 89234567 },
            genres: ['pop', 'country'] 
          }} 
          onClick={fn()} 
        />
        <ArtistCard 
          artist={{ 
            ...sampleArtist, 
            name: 'Arctic Monkeys', 
            popularity: 65,
            followers: { total: 8234567 },
            genres: ['indie rock', 'alternative rock'] 
          }} 
          onClick={fn()} 
        />
        <ArtistCard 
          artist={{ 
            ...sampleArtist, 
            name: 'Billie Eilish', 
            popularity: 88,
            followers: { total: 67234567 },
            genres: ['pop', 'alternative'] 
          }} 
          onClick={fn()} 
        />
        <ArtistCard 
          artist={{ 
            ...sampleArtist, 
            name: 'Ed Sheeran', 
            popularity: 82,
            followers: { total: 45234567 },
            genres: ['pop', 'folk'] 
          }} 
          onClick={fn()} 
        />
        <ArtistCard 
          artist={{ 
            ...sampleArtist, 
            name: 'Dua Lipa', 
            popularity: 79,
            followers: { total: 34234567 },
            genres: ['pop', 'dance'] 
          }} 
          onClick={fn()} 
        />
      </div>
    </div>
  ),
};