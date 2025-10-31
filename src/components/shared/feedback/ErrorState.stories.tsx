import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ErrorState } from './ErrorState';

const meta = {
  title: 'Shared/Feedback/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### ErrorState Component

O componente ErrorState fornece uma interface consistente para exibir estados de erro com:
- Ícone visual de erro
- Título personalizável
- Mensagem de erro clara
- Ação opcional (botão de retry, link, etc.)
- Suporte completo à acessibilidade
- Design responsivo

#### Funcionalidades:
- **Mensagens Flexíveis**: Suporte a texto simples ou JSX
- **Ações Customizáveis**: Botões, links ou qualquer elemento React
- **Acessível**: Suporte a leitores de tela com ARIA labels
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Tema Consistente**: Cores e tipografia alinhadas com o design system
- **Hierarquia Visual**: Título, mensagem e ação bem organizados
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'Título do erro',
      control: { type: 'text' },
    },
    message: {
      description: 'Mensagem de erro (pode ser string ou JSX)',
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
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Não foi possível carregar o conteúdo. Tente novamente.',
  },
};

export const WithCustomTitle: Story = {
  args: {
    title: 'Erro de Conexão',
    message: 'Verifique sua conexão com a internet e tente novamente.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'Falha ao Carregar',
    message: 'Não foi possível conectar com o Spotify.',
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

export const NetworkError: Story = {
  args: {
    title: 'Sem Conexão',
    message: 'Verifique sua conexão com a internet e tente novamente.',
    action: (
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={fn()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          Tentar Novamente
        </button>
        <button
          onClick={fn()}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
        >
          Trabalhar Offline
        </button>
      </div>
    ),
  },
};

export const SpotifyError: Story = {
  args: {
    title: 'Erro do Spotify',
    message:
      'O Spotify está temporariamente indisponível. Tente novamente em alguns minutos.',
    action: (
      <button
        onClick={fn()}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
      >
        Recarregar
      </button>
    ),
  },
};

export const AuthenticationError: Story = {
  args: {
    title: 'Sessão Expirada',
    message: 'Sua sessão expirou. Faça login novamente para continuar.',
    action: (
      <button
        onClick={fn()}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
      >
        Fazer Login
      </button>
    ),
  },
};

export const LongMessage: Story = {
  args: {
    title: 'Erro Detalhado',
    message:
      'Ocorreu um erro inesperado ao tentar sincronizar sua biblioteca musical com o Spotify. Isso pode acontecer devido a problemas temporários no servidor ou limitações da API. Recomendamos aguardar alguns minutos antes de tentar novamente.',
    action: (
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={fn()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          Tentar Novamente
        </button>
        <button
          onClick={fn()}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
        >
          Reportar Problema
        </button>
      </div>
    ),
  },
};

export const WithJSXMessage: Story = {
  args: {
    title: 'Recurso Indisponível',
    message: (
      <div>
        <p className="mb-2">Este recurso requer uma conta Spotify Premium.</p>
        <p className="text-sm text-gray-500">
          <a href="#" className="text-green-400 hover:text-green-300 underline">
            Saiba mais sobre o Spotify Premium
          </a>
        </p>
      </div>
    ),
    action: (
      <button
        onClick={fn()}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
      >
        Fazer Upgrade
      </button>
    ),
  },
};

export const NoAction: Story = {
  args: {
    title: 'Conteúdo Não Encontrado',
    message: 'O item que você está procurando não existe ou foi removido.',
  },
};

export const CustomStyling: Story = {
  args: {
    title: 'Erro Personalizado',
    message: 'Este é um exemplo com estilização customizada.',
    className: 'bg-red-900/20 border border-red-500/30 rounded-lg',
    action: (
      <button
        onClick={fn()}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
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

Exemplo de como o ErrorState aparece dentro de um card ou container:
        `,
      },
    },
  },
  args: {
    message: 'Exemplo em card',
  },
  render: () => (
    <div className="w-96 h-64 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
      <ErrorState
        title="Falha ao Carregar"
        message="Não foi possível carregar a playlist."
        action={
          <button
            onClick={fn()}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
          >
            Tentar Novamente
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

Exemplo de como o ErrorState aparece como estado de erro de uma página inteira:
        `,
      },
    },
  },
  args: {
    message: 'Exemplo em página',
  },
  render: () => (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <ErrorState
        title="Página Não Encontrada"
        message="A página que você está procurando não existe ou foi movida."
        action={
          <div className="flex gap-3">
            <button
              onClick={fn()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              Voltar ao Início
            </button>
            <button
              onClick={fn()}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Buscar Música
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

Este exemplo demonstra as funcionalidades de acessibilidade do ErrorState:

**Recursos de Acessibilidade:**
- **role="alert"**: Indica que é um alerta importante
- **aria-live="assertive"**: Anuncia imediatamente para leitores de tela
- **aria-hidden="true"**: Esconde o ícone decorativo dos leitores de tela
- **Hierarquia Semântica**: Uso correto de h2 para o título
- **Contraste**: Cores com contraste adequado para legibilidade

**Teste com leitores de tela:**
1. Use um leitor de tela (NVDA, JAWS, VoiceOver)
2. Navegue até o componente
3. Observe como o erro é anunciado
4. Verifique se o título e mensagem são lidos corretamente
5. Teste a navegação para o botão de ação
        `,
      },
    },
  },
  args: {
    title: 'Erro de Acessibilidade',
    message:
      'Este exemplo demonstra como o ErrorState é acessível para usuários de leitores de tela.',
    action: (
      <button
        onClick={fn()}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-950"
        aria-describedby="error-description"
      >
        Resolver Problema
      </button>
    ),
  },
};

export const CommonErrorTypes: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Tipos Comuns de Erro

Exemplos de diferentes tipos de erro que podem ocorrer na aplicação:
        `,
      },
    },
  },
  args: {
    message: 'Exemplos de tipos de erro',
  },
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-950 max-w-6xl">
      {/* Erro de Rede */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <ErrorState
          title="Erro de Rede"
          message="Sem conexão com a internet."
          action={
            <button
              onClick={fn()}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
            >
              Tentar Novamente
            </button>
          }
        />
      </div>

      {/* Erro de Autenticação */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <ErrorState
          title="Sessão Expirada"
          message="Faça login novamente."
          action={
            <button
              onClick={fn()}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
            >
              Login
            </button>
          }
        />
      </div>

      {/* Erro de Servidor */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <ErrorState
          title="Erro do Servidor"
          message="Problema temporário no servidor."
          action={
            <button
              onClick={fn()}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
            >
              Recarregar
            </button>
          }
        />
      </div>

      {/* Erro de Permissão */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <ErrorState
          title="Acesso Negado"
          message="Você não tem permissão para este recurso."
          action={
            <button
              onClick={fn()}
              className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
            >
              Voltar
            </button>
          }
        />
      </div>
    </div>
  ),
};
