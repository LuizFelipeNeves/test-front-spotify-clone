import type { Meta, StoryObj } from '@storybook/react';
import MusicPlayerBar from './MusicPlayerBar';

const meta = {
  title: 'Features/Player/MusicPlayerBar',
  component: MusicPlayerBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### MusicPlayerBar Component

O componente MusicPlayerBar fornece controles de reprodução de música com:
- Informações da faixa atual
- Controles de reprodução (play/pause, anterior/próximo)
- Barra de progresso interativa
- Controles de volume
- Botões de shuffle e repeat
- Botão de favoritos

#### Funcionalidades:
- **Controles Completos**: Play, pause, skip, shuffle, repeat
- **Progresso Visual**: Barra de progresso com seek
- **Volume**: Controle de volume com mute
- **Favoritos**: Adicionar/remover das favoritas
- **Responsivo**: Adapta-se a diferentes tamanhos
- **Acessível**: Suporte a teclado e screen readers
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-screen bg-black flex flex-col">
        <div className="flex-1 bg-gray-900 p-6">
          <h2 className="text-white text-xl mb-4">Área Principal</h2>
          <p className="text-gray-300">
            O player de música fica fixo na parte inferior da tela.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MusicPlayerBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      
      return (
        <div className="h-screen bg-black flex flex-col">
          <div className="flex-1 bg-gray-900 p-6">
            <h2 className="text-white text-xl mb-4">Player Vazio</h2>
            <p className="text-gray-300">
              Estado inicial sem música tocando.
            </p>
          </div>
          <Story />
        </div>
      );
    },
  ],
};

export const Playing: Story = {
  decorators: [
    (Story) => {
      // Simula estado tocando
      return (
        <div className="h-screen bg-black flex flex-col">
          <div className="flex-1 bg-gray-900 p-6">
            <h2 className="text-white text-xl mb-4">Música Tocando</h2>
            <p className="text-gray-300">
              Player com música em reprodução.
            </p>
          </div>
          <Story />
        </div>
      );
    },
  ],
};

export const Paused: Story = {
  decorators: [
    (Story) => {
      return (
        <div className="h-screen bg-black flex flex-col">
          <div className="flex-1 bg-gray-900 p-6">
            <h2 className="text-white text-xl mb-4">Música Pausada</h2>
            <p className="text-gray-300">
              Player com música pausada.
            </p>
          </div>
          <Story />
        </div>
      );
    },
  ],
};

export const WithShuffle: Story = {
  decorators: [
    (Story) => {
      return (
        <div className="h-screen bg-black flex flex-col">
          <div className="flex-1 bg-gray-900 p-6">
            <h2 className="text-white text-xl mb-4">Shuffle Ativo</h2>
            <p className="text-gray-300">
              Player com modo shuffle ativado.
            </p>
          </div>
          <Story />
        </div>
      );
    },
  ],
};

export const WithRepeat: Story = {
  decorators: [
    (Story) => {
      return (
        <div className="h-screen bg-black flex flex-col">
          <div className="flex-1 bg-gray-900 p-6">
            <h2 className="text-white text-xl mb-4">Repeat Ativo</h2>
            <p className="text-gray-300">
              Player com modo repeat ativado.
            </p>
          </div>
          <Story />
        </div>
      );
    },
  ],
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-black flex flex-col">
        <div className="flex-1 bg-gray-900 p-4">
          <h2 className="text-white text-lg mb-4">Visualização Mobile</h2>
          <p className="text-gray-300 text-sm">
            Player adaptado para telas menores.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};