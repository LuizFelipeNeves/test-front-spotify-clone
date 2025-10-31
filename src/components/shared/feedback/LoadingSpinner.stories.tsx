import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta = {
  title: 'Shared/Feedback/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### LoadingSpinner Component

O componente LoadingSpinner fornece um indicador visual de carregamento com:
- Animação de rotação suave
- Três tamanhos diferentes (sm, md, lg)
- Mensagem personalizável
- Suporte completo à acessibilidade
- Design consistente com o tema da aplicação

#### Funcionalidades:
- **Tamanhos Flexíveis**: Pequeno, médio e grande
- **Mensagens Customizáveis**: Texto explicativo do que está carregando
- **Acessível**: Suporte a leitores de tela com ARIA labels
- **Responsivo**: Adapta-se a diferentes contextos
- **Animação Suave**: Rotação contínua e fluida
- **Tema Consistente**: Cores alinhadas com o design system
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'Tamanho do spinner',
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    message: {
      description: 'Mensagem exibida abaixo do spinner',
      control: { type: 'text' },
    },
    className: {
      description: 'Classes CSS adicionais',
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 'sm',
    message: 'Carregando...',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    message: 'Carregando dados...',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    message: 'Carregando conteúdo...',
  },
};

export const CustomMessage: Story = {
  args: {
    size: 'md',
    message: 'Buscando suas músicas favoritas...',
  },
};

export const LongMessage: Story = {
  args: {
    size: 'md',
    message:
      'Conectando com o Spotify e sincronizando sua biblioteca musical. Isso pode levar alguns segundos...',
  },
};

export const NoMessage: Story = {
  args: {
    size: 'md',
    message: '',
  },
};

export const WithCustomStyling: Story = {
  args: {
    size: 'lg',
    message: 'Carregando playlist...',
    className: 'bg-gray-900 rounded-lg border border-gray-700',
  },
};

export const InCard: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Em um Card

Exemplo de como o LoadingSpinner aparece dentro de um card ou container:
        `,
      },
    },
  },
  render: () => (
    <div className="w-80 h-48 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
      <LoadingSpinner size="md" message="Carregando playlist..." />
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

Exemplo de como o LoadingSpinner aparece como estado de carregamento de uma página inteira:
        `,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <LoadingSpinner
        size="lg"
        message="Carregando sua biblioteca musical..."
      />
    </div>
  ),
};

export const Multiple: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Múltiplos Tamanhos

Comparação visual dos diferentes tamanhos disponíveis:
        `,
      },
    },
  },
  render: () => (
    <div className="flex flex-col space-y-8 p-8 bg-gray-950">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-4">Pequeno (sm)</h3>
        <LoadingSpinner size="sm" message="Carregando..." />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-4">Médio (md)</h3>
        <LoadingSpinner size="md" message="Carregando dados..." />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-4">Grande (lg)</h3>
        <LoadingSpinner size="lg" message="Carregando conteúdo..." />
      </div>
    </div>
  ),
};

export const Accessibility: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Acessibilidade

Este exemplo demonstra as funcionalidades de acessibilidade do LoadingSpinner:

**Recursos de Acessibilidade:**
- **role="status"**: Indica que é um indicador de status
- **aria-live="polite"**: Anuncia mudanças para leitores de tela
- **aria-label**: Fornece descrição do estado atual
- **aria-hidden="true"**: Esconde o ícone decorativo dos leitores de tela
- **sr-only**: Texto adicional apenas para leitores de tela

**Teste com leitores de tela:**
1. Use um leitor de tela (NVDA, JAWS, VoiceOver)
2. Navegue até o componente
3. Observe como o estado é anunciado
4. Verifique se a mensagem é lida corretamente
        `,
      },
    },
  },
  args: {
    size: 'md',
    message: 'Carregando dados do Spotify...',
  },
};

export const LoadingStates: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Estados de Carregamento Comuns

Exemplos de diferentes contextos onde o LoadingSpinner é usado:
        `,
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-950">
      {/* Carregamento de Lista */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Lista de Músicas</h4>
        <LoadingSpinner size="sm" message="Carregando músicas..." />
      </div>

      {/* Carregamento de Perfil */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Perfil do Artista</h4>
        <LoadingSpinner
          size="md"
          message="Carregando informações do artista..."
        />
      </div>

      {/* Carregamento de Player */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Player de Música</h4>
        <LoadingSpinner size="sm" message="Preparando reprodução..." />
      </div>

      {/* Carregamento de Busca */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Resultados da Busca</h4>
        <LoadingSpinner size="md" message="Buscando no Spotify..." />
      </div>
    </div>
  ),
};
