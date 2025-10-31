import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveGrid } from './ResponsiveGrid';

const meta = {
  title: 'Shared/Grid/ResponsiveGrid',
  component: ResponsiveGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### ResponsiveGrid Component

O componente ResponsiveGrid fornece um sistema de grid responsivo para diferentes tipos de conteúdo:
- Grid para artistas, álbuns e playlists
- Configuração customizável
- Responsivo por padrão
- Baseado em Tailwind CSS

#### Tipos de Grid:
- **artistas**: Grid otimizado para cards de artistas
- **albuns**: Grid otimizado para cards de álbuns  
- **playlists**: Grid otimizado para cards de playlists
- **custom**: Grid personalizado via prop customGrid

#### Funcionalidades:
- **Responsivo**: Adapta-se automaticamente ao tamanho da tela
- **Flexível**: Suporte a grids customizados
- **Consistente**: Usa configurações centralizadas do UI_CONFIG
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: 'Tipo de grid predefinido',
      control: { type: 'select' },
      options: ['artistas', 'albuns', 'playlists', 'custom'],
    },
    className: {
      description: 'Classes CSS adicionais',
      control: { type: 'text' },
    },
    customGrid: {
      description: 'Classes de grid customizadas (usado com type="custom")',
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof ResponsiveGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock components para demonstração
const MockCard = ({ title, type }: { title: string; type: string }) => (
  <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
    <div className="aspect-square bg-gray-600 rounded-lg mb-3 flex items-center justify-center">
      <span className="text-gray-400 text-sm">{type}</span>
    </div>
    <h3 className="text-white font-medium truncate">{title}</h3>
    <p className="text-gray-400 text-sm mt-1">
      Descrição do {type.toLowerCase()}
    </p>
  </div>
);

const mockItems = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
}));

export const Artistas: Story = {
  args: {
    type: 'artistas',
    children: null,
  },
  render: args => (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-white text-2xl font-bold mb-6">Grid de Artistas</h2>
      <ResponsiveGrid {...args}>
        {mockItems.map(item => (
          <MockCard key={item.id} title={`Artista ${item.id}`} type="Artista" />
        ))}
      </ResponsiveGrid>
    </div>
  ),
};

export const Albuns: Story = {
  args: {
    type: 'albuns',
    children: null,
  },
  render: args => (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-white text-2xl font-bold mb-6">Grid de Álbuns</h2>
      <ResponsiveGrid {...args}>
        {mockItems.map(item => (
          <MockCard key={item.id} title={`Álbum ${item.id}`} type="Álbum" />
        ))}
      </ResponsiveGrid>
    </div>
  ),
};

export const Playlists: Story = {
  args: {
    type: 'playlists',
    children: null,
  },
  render: args => (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-white text-2xl font-bold mb-6">Grid de Playlists</h2>
      <ResponsiveGrid {...args}>
        {mockItems.map(item => (
          <MockCard
            key={item.id}
            title={`Playlist ${item.id}`}
            type="Playlist"
          />
        ))}
      </ResponsiveGrid>
    </div>
  ),
};

export const CustomGrid: Story = {
  args: {
    type: 'custom',
    customGrid: 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4',
    children: null,
  },
  render: args => (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-white text-2xl font-bold mb-6">
        Grid Customizado (6 colunas)
      </h2>
      <ResponsiveGrid {...args}>
        {mockItems.map(item => (
          <MockCard key={item.id} title={`Item ${item.id}`} type="Custom" />
        ))}
      </ResponsiveGrid>
    </div>
  ),
};

export const ResponsiveComparison: Story = {
  args: {
    type: 'artistas',
    children: null,
  },
  render: () => (
    <div className="p-6 bg-gray-900 min-h-screen space-y-12">
      <div>
        <h2 className="text-white text-2xl font-bold mb-6">
          Comparação de Grids Responsivos
        </h2>
        <p className="text-gray-400 mb-8">
          Redimensione a janela para ver como cada grid se adapta
        </p>
      </div>

      <div>
        <h3 className="text-white text-xl font-semibold mb-4">
          Grid de Artistas
        </h3>
        <ResponsiveGrid type="artistas">
          {mockItems.slice(0, 8).map(item => (
            <MockCard
              key={item.id}
              title={`Artista ${item.id}`}
              type="Artista"
            />
          ))}
        </ResponsiveGrid>
      </div>

      <div>
        <h3 className="text-white text-xl font-semibold mb-4">
          Grid de Álbuns
        </h3>
        <ResponsiveGrid type="albuns">
          {mockItems.slice(0, 8).map(item => (
            <MockCard key={item.id} title={`Álbum ${item.id}`} type="Álbum" />
          ))}
        </ResponsiveGrid>
      </div>

      <div>
        <h3 className="text-white text-xl font-semibold mb-4">
          Grid de Playlists
        </h3>
        <ResponsiveGrid type="playlists">
          {mockItems.slice(0, 8).map(item => (
            <MockCard
              key={item.id}
              title={`Playlist ${item.id}`}
              type="Playlist"
            />
          ))}
        </ResponsiveGrid>
      </div>
    </div>
  ),
};

export const WithDifferentContent: Story = {
  args: {
    type: 'artistas',
    children: null,
  },
  render: () => (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-white text-2xl font-bold mb-6">
        Grid com Conteúdo Variado
      </h2>
      <ResponsiveGrid type="artistas">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="font-bold text-lg">Card Especial</h3>
          <p className="text-sm opacity-90">Conteúdo diferenciado</p>
        </div>

        {mockItems.slice(0, 7).map(item => (
          <MockCard key={item.id} title={`Item ${item.id}`} type="Normal" />
        ))}

        <div className="bg-green-600 rounded-lg p-6 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-2">+</div>
            <p className="text-sm">Adicionar Novo</p>
          </div>
        </div>
      </ResponsiveGrid>
    </div>
  ),
};
