import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Shared/Feedback/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### EmptyState Component

O componente EmptyState fornece uma interface consistente para exibir estados vazios com:
- Ícone visual opcional
- Título descritivo
- Descrição opcional
- Ação opcional (botão, link, etc.)
- Suporte completo à acessibilidade
- Design responsivo

#### Funcionalidades:
- **Ícones Flexíveis**: Suporte a qualquer elemento React como ícone
- **Conteúdo Adaptável**: Título obrigatório, descrição e ação opcionais
- **Acessível**: Suporte a leitores de tela com ARIA labels
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Tema Consistente**: Cores e tipografia alinhadas com o design system
- **Hierarquia Visual**: Ícone, título, descrição e ação bem organizados
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      description: 'Ícone ou elemento visual (opcional)',
    },
    title: {
      description: 'Título do estado vazio',
      control: { type: 'text' },
    },
    description: {
      description: 'Descrição adicional (opcional)',
      control: { type: 'text' },
    },
    action: {
      description: 'Elemento de ação (botão, link, etc.)',
    },
    className: {
      description: 'Classes CSS adicionais',
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Ícones comuns para os exemplos
const MusicIcon = (
  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);

const PlaylistIcon = (
  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
  </svg>
);

const SearchIcon = (
  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const HeartIcon = (
  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export const Default: Story = {
  args: {
    title: 'Nenhum item encontrado',
  },
};

export const WithDescription: Story = {
  args: {
    title: 'Sua biblioteca está vazia',
    description: 'Comece adicionando algumas músicas à sua biblioteca.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: MusicIcon,
    title: 'Nenhuma música encontrada',
    description: 'Tente ajustar seus filtros ou buscar por outros termos.',
  },
};

export const WithAction: Story = {
  args: {
    icon: PlaylistIcon,
    title: 'Nenhuma playlist criada',
    description: 'Crie sua primeira playlist para organizar suas músicas favoritas.',
    action: (
      <button 
        onClick={fn()}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
      >
        Criar Playlist
      </button>
    ),
  },
};

export const SearchResults: Story = {
  args: {
    icon: SearchIcon,
    title: 'Nenhum resultado encontrado',
    description: 'Tente buscar com termos diferentes ou verifique a ortografia.',
    action: (
      <button 
        onClick={fn()}
        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
      >
        Limpar Busca
      </button>
    ),
  },
};

export const Favorites: Story = {
  args: {
    icon: HeartIcon,
    title: 'Nenhuma música favorita',
    description: 'Marque músicas como favoritas para vê-las aqui.',
    action: (
      <button 
        onClick={fn()}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
      >
        Explorar Músicas
      </button>
    ),
  },
};

export const RecentlyPlayed: Story = {
  args: {
    icon: MusicIcon,
    title: 'Nenhuma música reproduzida recentemente',
    description: 'Suas músicas reproduzidas recentemente aparecerão aqui.',
  },
};

export const LongContent: Story = {
  args: {
    icon: PlaylistIcon,
    title: 'Sua biblioteca de playlists está completamente vazia no momento',
    description: 'Você ainda não criou nenhuma playlist personalizada. As playlists são uma ótima maneira de organizar suas músicas favoritas por gênero, humor ou ocasião. Comece criando sua primeira playlist agora mesmo!',
    action: (
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={fn()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          Criar Primeira Playlist
        </button>
        <button 
          onClick={fn()}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
        >
          Explorar Playlists Populares
        </button>
      </div>
    ),
  },
};

export const NoIcon: Story = {
  args: {
    title: 'Conteúdo não disponível',
    description: 'Este conteúdo não está disponível no momento.',
    action: (
      <button 
        onClick={fn()}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
      >
        Tentar Novamente
      </button>
    ),
  },
};

export const CustomStyling: Story = {
  args: {
    icon: MusicIcon,
    title: 'Estado Personalizado',
    description: 'Este é um exemplo com estilização customizada.',
    className: 'bg-blue-900/20 border border-blue-500/30 rounded-lg',
    action: (
      <button 
        onClick={fn()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
      >
        Ação Customizada
      </button>
    ),
  },
};

export const InCard: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Em um Card

Exemplo de como o EmptyState aparece dentro de um card ou container:
        `,
      },
    },
  },
  args: {
    title: 'Exemplo em card',
  },
  render: () => (
    <div className="w-96 h-64 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
      <EmptyState 
        icon={PlaylistIcon}
        title="Playlist Vazia"
        description="Adicione músicas a esta playlist."
        action={
          <button 
            onClick={fn()}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
          >
            Adicionar Músicas
          </button>
        }
      />
    </div>
  ),
};

export const InPage: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
### Em uma Página

Exemplo de como o EmptyState aparece como estado vazio de uma página inteira:
        `,
      },
    },
  },
  args: {
    title: 'Exemplo em página',
  },
  render: () => (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <EmptyState 
        icon={MusicIcon}
        title="Biblioteca Vazia"
        description="Sua biblioteca musical está vazia. Conecte-se ao Spotify para começar."
        action={
          <div className="flex gap-3">
            <button 
              onClick={fn()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              Conectar Spotify
            </button>
            <button 
              onClick={fn()}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Explorar Música
            </button>
          </div>
        }
      />
    </div>
  ),
};

export const Accessibility: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Acessibilidade

Este exemplo demonstra as funcionalidades de acessibilidade do EmptyState:

**Recursos de Acessibilidade:**
- **role="status"**: Indica que é um indicador de status
- **aria-live="polite"**: Anuncia mudanças para leitores de tela
- **aria-hidden="true"**: Esconde o ícone decorativo dos leitores de tela
- **Hierarquia Semântica**: Uso correto de h2 para o título
- **Contraste**: Cores com contraste adequado para legibilidade

**Teste com leitores de tela:**
1. Use um leitor de tela (NVDA, JAWS, VoiceOver)
2. Navegue até o componente
3. Observe como o estado é anunciado
4. Verifique se o título e descrição são lidos corretamente
5. Teste a navegação para o botão de ação
        `,
      },
    },
  },
  args: {
    icon: MusicIcon,
    title: 'Estado Acessível',
    description: 'Este exemplo demonstra como o EmptyState é acessível para usuários de leitores de tela.',
    action: (
      <button 
        onClick={fn()}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-950"
        aria-describedby="empty-description"
      >
        Ação Acessível
      </button>
    ),
  },
};

export const CommonEmptyStates: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Estados Vazios Comuns

Exemplos de diferentes tipos de estados vazios que podem ocorrer na aplicação:
        `,
      },
    },
  },
  args: {
    title: 'Exemplos de estados vazios',
  },
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-950 max-w-6xl">
      {/* Biblioteca Vazia */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <EmptyState 
          icon={MusicIcon}
          title="Biblioteca Vazia"
          description="Nenhuma música na sua biblioteca."
          action={
            <button 
              onClick={fn()}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
            >
              Explorar
            </button>
          }
        />
      </div>
      
      {/* Busca Sem Resultados */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <EmptyState 
          icon={SearchIcon}
          title="Sem Resultados"
          description="Nenhum resultado para sua busca."
          action={
            <button 
              onClick={fn()}
              className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
            >
              Limpar
            </button>
          }
        />
      </div>
      
      {/* Favoritos Vazios */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <EmptyState 
          icon={HeartIcon}
          title="Sem Favoritos"
          description="Nenhuma música favorita ainda."
          action={
            <button 
              onClick={fn()}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
            >
              Descobrir
            </button>
          }
        />
      </div>
      
      {/* Playlists Vazias */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <EmptyState 
          icon={PlaylistIcon}
          title="Sem Playlists"
          description="Nenhuma playlist criada."
          action={
            <button 
              onClick={fn()}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
            >
              Criar
            </button>
          }
        />
      </div>
    </div>
  ),
};