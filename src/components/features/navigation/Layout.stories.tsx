import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

const meta = {
  title: 'Features/Navigation/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### Layout Component

O componente Layout fornece a estrutura principal da aplicação com:
- Sidebar para desktop
- Navegação mobile na parte inferior
- Player de música fixo
- Área de conteúdo principal responsiva

#### Funcionalidades:
- **Responsivo**: Sidebar oculta em mobile, navegação inferior em mobile
- **Player Integrado**: Player de música sempre visível
- **Navegação Ativa**: Destaque visual para rota atual
- **Acessível**: Navegação por teclado e screen readers
- **Layout Flexível**: Adapta-se ao conteúdo
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <div className="h-screen">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    className: {
      description: 'Classes CSS adicionais',
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Página Principal</h1>
        <p className="text-gray-300">
          Este é o conteúdo principal da aplicação. O layout inclui sidebar (desktop), 
          navegação mobile e player de música.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Card {i + 1}</h3>
              <p className="text-sm text-gray-400">Conteúdo do card de exemplo</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Página com Conteúdo Longo</h1>
        <div className="space-y-6">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Seção {i + 1}</h3>
              <p className="text-gray-300 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-3 rounded">Item A</div>
                <div className="bg-gray-700 p-3 rounded">Item B</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

export const EmptyContent: Story = {
  args: {
    children: (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Nenhum conteúdo</h2>
          <p className="text-gray-400">Esta página está vazia</p>
        </div>
      </div>
    ),
  },
};