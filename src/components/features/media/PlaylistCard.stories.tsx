import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { vi } from 'vitest';
import { PlaylistCard } from './PlaylistCard';
import type { Playlist } from '@/types';

// Mocks dos hooks e contextos
const mockUseImageCache = {
  imageUrl: 'https://i.scdn.co/image/ab67706c0000da84c6c4c8b6b6b6b6b6b6b6b6b6',
  isLoading: false,
};

const mockUsePlaylistTracks = {
  data: {
    items: [
      { track: { id: '1', name: 'Track 1' } },
      { track: { id: '2', name: 'Track 2' } },
      { track: { id: '3', name: 'Track 3' } },
    ],
  },
};

const mockPlayerStore = {
  setCurrentTrack: fn(),
  setQueue: fn(),
  setIsPlaying: fn(),
};

const mockSpotifyPlayerContext = {
  playTrack: fn(),
  isReady: true,
};

// Mocks
vi.mock('@/hooks/useImageCache', () => ({
  useImageCache: () => mockUseImageCache,
}));

vi.mock('@/hooks/useSpotifyQueries', () => ({
  usePlaylistTracks: () => mockUsePlaylistTracks,
}));

vi.mock('@/store/playerStore', () => ({
  usePlayerStore: () => mockPlayerStore,
}));

vi.mock('@/contexts/SpotifyPlayerContext', () => ({
  useSpotifyPlayerContext: () => mockSpotifyPlayerContext,
}));

vi.mock('@/components/ui', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Indicator: ({ label, color, icon }: any) => (
    <span className={`indicator ${color}`} data-icon={icon}>
      {label}
    </span>
  ),
}));

const meta = {
  title: 'Features/Media/PlaylistCard',
  component: PlaylistCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### PlaylistCard Component

O componente PlaylistCard exibe informações de uma playlist do Spotify com:
- Imagem da playlist com cache otimizado
- Nome da playlist
- Proprietário da playlist
- Número de músicas
- Descrição (quando disponível)
- Indicadores de status (pública/privada, colaborativa)
- Botão de reprodução
- Suporte completo à acessibilidade

#### Funcionalidades:
- **Cache de Imagens**: Otimização de carregamento de imagens
- **Reprodução**: Integração com o player do Spotify
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessível**: Suporte a leitores de tela e navegação por teclado
- **Interativo**: Click para navegar para a playlist
- **Indicadores Visuais**: Status da playlist claramente indicado
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    playlist: {
      description: 'Objeto da playlist com informações do Spotify',
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
} satisfies Meta<typeof PlaylistCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Playlist de exemplo
const samplePlaylist: Playlist = {
  id: '37i9dQZF1DXcBWIGoYBM5M',
  name: 'Today\'s Top Hits',
  description: 'The most played songs right now.',
  images: [
    {
      url: 'https://i.scdn.co/image/ab67706c0000da84c6c4c8b6b6b6b6b6b6b6b6b6',
      height: 640,
      width: 640,
    },
    {
      url: 'https://i.scdn.co/image/ab67706c0000da84c6c4c8b6b6b6b6b6b6b6b6b6',
      height: 300,
      width: 300,
    },
  ],
  owner: {
    id: 'spotify',
    display_name: 'Spotify',
  },
  tracks: {
    total: 50,
    items: [],
  },
  public: true,
  collaborative: false,
  external_urls: {
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
  },
};

export const Default: Story = {
  args: {
    playlist: samplePlaylist,
  },
};

export const PrivatePlaylist: Story = {
  args: {
    playlist: {
      ...samplePlaylist,
      name: 'My Private Mix',
      description: 'Personal collection of favorite songs.',
      public: false,
      owner: {
        id: 'user123',
        display_name: 'John Doe',
      },
    },
  },
};

export const CollaborativePlaylist: Story = {
  args: {
    playlist: {
      ...samplePlaylist,
      name: 'Party Playlist',
      description: 'Songs for the weekend party - everyone can add!',
      collaborative: true,
      public: true,
      owner: {
        id: 'user456',
        display_name: 'Party Host',
      },
    },
  },
};

export const LongTitle: Story = {
  args: {
    playlist: {
      ...samplePlaylist,
      name: 'This Is a Very Long Playlist Name That Should Be Truncated Properly When Displayed',
      description: 'This is also a very long description that should be handled properly by the component and truncated when necessary.',
      owner: {
        id: 'user789',
        display_name: 'User With Very Long Display Name',
      },
    },
  },
};

export const NoImage: Story = {
  args: {
    playlist: {
      ...samplePlaylist,
      name: 'Playlist Without Cover',
      images: [],
    },
  },
};

export const NoDescription: Story = {
  args: {
    playlist: {
      ...samplePlaylist,
      name: 'Simple Playlist',
      description: '',
    },
  },
};

export const SingleTrack: Story = {
  args: {
    playlist: {
      ...samplePlaylist,
      name: 'Single Song',
      description: 'Just one amazing track.',
      tracks: {
        total: 1,
        items: [],
      },
    },
  },
};

export const ManyTracks: Story = {
  args: {
    playlist: {
      ...samplePlaylist,
      name: 'Mega Mix',
      description: 'Thousands of songs for every mood.',
      tracks: {
        total: 2547,
        items: [],
      },
    },
  },
};

export const CustomClassName: Story = {
  args: {
    playlist: samplePlaylist,
    className: 'border-2 border-blue-500 shadow-lg',
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Interatividade

Este exemplo demonstra a interatividade do PlaylistCard:

**Funcionalidades:**
- **Hover**: Efeito visual ao passar o mouse
- **Click**: Navega para a página da playlist
- **Play Button**: Aparece no hover para reproduzir a playlist
- **Keyboard**: Navegação por teclado (Tab, Enter, Space)
- **Focus**: Indicador visual de foco

**Teste a interação:**
1. Passe o mouse sobre o card
2. Clique no botão de play que aparece
3. Clique no card para "navegar" para a playlist
4. Use Tab para navegar
5. Use Enter/Space para ativar
        `,
      },
    },
  },
  args: {
    playlist: samplePlaylist,
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
- Ícone de música como indicador visual
- Transição suave quando a imagem é carregada
        `,
      },
    },
  },
  args: {
    playlist: samplePlaylist,
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

Exemplo de como os PlaylistCards aparecem em um layout de lista:
        `,
      },
    },
  },
  args: {
    playlist: samplePlaylist,
  },
  render: () => (
    <div className="p-6 bg-gray-950">
      <h2 className="text-2xl font-bold mb-4 text-white">Suas Playlists</h2>
      <div className="space-y-2">
        <PlaylistCard playlist={samplePlaylist} onClick={fn()} />
        <PlaylistCard 
          playlist={{ 
            ...samplePlaylist, 
            name: 'Rock Classics', 
            description: 'The best rock songs of all time.',
            owner: { id: 'user1', display_name: 'Rock Fan' },
            tracks: { total: 127, items: [] },
            public: false
          }} 
          onClick={fn()} 
        />
        <PlaylistCard 
          playlist={{ 
            ...samplePlaylist, 
            name: 'Chill Vibes', 
            description: 'Relaxing music for work and study.',
            owner: { id: 'user2', display_name: 'Chill Master' },
            tracks: { total: 89, items: [] },
            collaborative: true
          }} 
          onClick={fn()} 
        />
        <PlaylistCard 
          playlist={{ 
            ...samplePlaylist, 
            name: 'Workout Mix', 
            description: 'High energy songs to keep you motivated.',
            owner: { id: 'user3', display_name: 'Fitness Guru' },
            tracks: { total: 45, items: [] }
          }} 
          onClick={fn()} 
        />
        <PlaylistCard 
          playlist={{ 
            ...samplePlaylist, 
            name: 'Road Trip', 
            description: '',
            owner: { id: 'user4', display_name: 'Traveler' },
            tracks: { total: 156, items: [] },
            public: false
          }} 
          onClick={fn()} 
        />
      </div>
    </div>
  ),
};