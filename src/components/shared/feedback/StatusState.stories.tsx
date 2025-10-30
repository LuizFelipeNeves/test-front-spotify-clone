import type { Meta, StoryObj } from '@storybook/react';
import { StatusState, EmptyState, ErrorState, LoadingState } from './StatusState';

const meta: Meta<typeof StatusState> = {
  title: 'Shared/Feedback/StatusState',
  component: StatusState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Componente unificado para estados de feedback visual (vazio, erro, carregando).

## Acessibilidade
- Roles apropriados para cada tipo de estado
- Aria-live regions para atualizações dinâmicas
- Navegação por teclado suportada
- Contraste de cores adequado

## Variações
- **EmptyState**: Mensagem de conteúdo vazio
- **ErrorState**: Mensagem de erro com botão de retry
- **LoadingState**: Indicador de carregamento animado
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['empty', 'error', 'loading'],
      description: 'Tipo do estado de feedback',
    },
    message: {
      control: 'text',
      description: 'Mensagem principal do estado',
    },
    description: {
      control: 'text',
      description: 'Descrição adicional do estado',
    },
    onRetry: {
      action: 'retry',
      description: 'Função de retry para estados de erro',
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais',
    },
    iconSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho do ícone',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story principal
export const Default: Story = {
  args: {
    type: 'empty',
    message: 'Nenhum item encontrado',
    description: 'Não há itens para exibir no momento.',
  },
};

// Stories para cada tipo
export const Empty: Story = {
  render: () => (
    <EmptyState
      message="Nenhuma playlist encontrada"
      description="Você ainda não criou nenhuma playlist. Comece criando sua primeira playlist!"
      className="p-8"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Estado vazio para quando não há conteúdo para exibir.',
      },
    },
  },
};

export const Error: Story = {
  render: () => (
    <ErrorState
      message="Erro ao carregar dados"
      description="Ocorreu um erro ao buscar as informações. Tente novamente mais tarde."
      onRetry={() => console.log('Retry clicked')}
      className="p-8"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Estado de erro com opção de retry para tentar novamente.',
      },
    },
  },
};

export const Loading: Story = {
  render: () => (
    <LoadingState
      message="Carregando..."
      description="Buscando suas informações, aguarde um momento."
      className="p-8"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Estado de carregamento com spinner animado.',
      },
    },
  },
};

// Variações de tamanho
export const Small: Story = {
  render: () => (
    <div className="space-y-4">
      <StatusState type="empty" iconSize="sm" message="Vazio" description="Descrição curta" />
      <StatusState type="error" iconSize="sm" message="Erro" description="Algo deu errado" />
      <StatusState type="loading" iconSize="sm" message="Carregando" description="Aguarde" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Estados com ícones pequenos para espaços compactos.',
      },
    },
  },
};

export const Large: Story = {
  render: () => (
    <div className="space-y-4">
      <StatusState type="empty" iconSize="lg" message="Nenhum resultado encontrado" description="Sua busca não retornou resultados. Tente usar termos diferentes." />
      <StatusState type="error" iconSize="lg" message="Falha na conexão" description="Não foi possível conectar ao servidor. Verifique sua conexão com a internet." />
      <StatusState type="loading" iconSize="lg" message="Processando solicitação" description="Isso pode levar alguns segundos. Por favor, aguarde." />
    </div>
  ),
  parameters: {
    docs: {
      destion: {
        story: 'Estados com ícones grandes para destaque visual.',
      },
    },
  },
};

// Diferentes contextos
export const PlaylistContext: Story = {
  render: () => (
    <div className="space-y-4">
      <EmptyState
        message="Nenhuma playlist encontrada"
        description="Você ainda não tem playlists. Crie sua primeira playlist para começar!"
        className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto"
      />
      <ErrorState
        message="Erro ao carregar playlists"
        description="Não foi possível carregar suas playlists. Verifique sua conexão e tente novamente."
        onRetry={() => alert('Retry playlist loading')}
        className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Estados contextualizados para playlists com estilo apropriado.',
      },
    },
  },
};

export const SearchContext: Story = {
  render: () => (
    <div className="space-y-4">
      <EmptyState
        message="Nenhum resultado encontrado"
        description="Tente usar termos diferentes ou verifique a ortografia."
        className="max-w-md mx-auto"
      />
      <ErrorState
        message="Erro na busca"
        description="Ocorreu um erro ao realizar sua busca. Tente novamente."
        onRetry={() => alert('Retry search')}
        className="max-w-md mx-auto"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Estados contextualizados para resultados de busca.',
      },
    },
  },
};

// Acessibilidade
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Suporte a Screen Reader</h2>
        <p className="text-sm text-gray-600 mb-4">
          Todos os estados possuem roles e aria-labels apropriados.
        </p>
        <EmptyState
          message="Nenhum item encontrado"
          description="Não há itens para exibir no momento."
          className="p-8"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Navegação por Teclado</h2>
        <p className="text-sm text-gray-600 mb-4">
          Botões de retry são focáveis e ativáveis com Enter/Space.
        </p>
        <ErrorState
          message="Erro ao carregar"
          description="Clique no botão abaixo para tentar novamente."
          onRetry={() => console.log('Retry with keyboard')}
          className="p-8"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Contraste e Legibilidade</h2>
        <p className="text-sm text-gray-600">
          Cores e tamanhos seguem diretrizes WCAG para acessibilidade.
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