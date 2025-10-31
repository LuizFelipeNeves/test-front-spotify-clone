import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { fn } from '@storybook/test';
import { Sidebar } from './Sidebar';

const meta = {
  title: 'Features/Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### Sidebar Component

O componente Sidebar fornece navegação principal da aplicação com:
- Logo do Spotify
- Links de navegação principais
- Indicador de rota ativa
- Botão de instalação PWA
- Design responsivo

#### Funcionalidades:
- **Navegação Principal**: Home, Artistas, Playlists, Perfil
- **Estado Ativo**: Destaque visual para página atual
- **PWA Install**: Botão para instalar como app
- **Responsivo**: Oculta/mostra conforme necessário
- **Acessível**: Navegação por teclado e screen readers
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <div className="h-screen bg-black flex">
          <Story />
          <div className="flex-1 bg-gray-900 p-6">
            <h2 className="text-white text-xl">Área de Conteúdo</h2>
            <p className="text-gray-300 mt-2">
              Esta é a área principal onde o conteúdo seria exibido.
            </p>
          </div>
        </div>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    className: {
      description: 'Classes CSS adicionais',
      control: { type: 'text' },
    },
    isOpen: {
      description: 'Controla se a sidebar está aberta (mobile)',
      control: { type: 'boolean' },
    },
    onClose: {
      description: 'Função chamada ao fechar a sidebar',
      action: 'closed',
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: fn(),
  },
};

export const WithCustomClass: Story = {
  args: {
    isOpen: true,
    className: 'border-r-2 border-green-500',
    onClose: fn(),
  },
};

// Story específica para mostrar diferentes estados de rota
export const DifferentRoutes: Story = {
  decorators: [
    (Story) => (
      <div className="space-y-4">
        <div className="text-white mb-4">
          <h3 className="font-semibold">Diferentes Estados de Rota:</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-white text-sm mb-2">Home Ativa</h4>
            <MemoryRouter initialEntries={['/']}>
              <div className="h-96 bg-black flex">
                <Story />
              </div>
            </MemoryRouter>
          </div>
          
          <div>
            <h4 className="text-white text-sm mb-2">Artistas Ativa</h4>
            <MemoryRouter initialEntries={['/artists']}>
              <div className="h-96 bg-black flex">
                <Story />
              </div>
            </MemoryRouter>
          </div>
          
          <div>
            <h4 className="text-white text-sm mb-2">Playlists Ativa</h4>
            <MemoryRouter initialEntries={['/playlists']}>
              <div className="h-96 bg-black flex">
                <Story />
              </div>
            </MemoryRouter>
          </div>
          
          <div>
            <h4 className="text-white text-sm mb-2">Perfil Ativo</h4>
            <MemoryRouter initialEntries={['/profile']}>
              <div className="h-96 bg-black flex">
                <Story />
              </div>
            </MemoryRouter>
          </div>
        </div>
      </div>
    ),
  ],
  args: {
    isOpen: true,
    onClose: fn(),
  },
};