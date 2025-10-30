import type { Meta, StoryObj } from '@storybook/react';
import { PageContent } from './PageContent';
import { CreateButton } from '@/components';

const meta = {
  title: 'UI/PageContent',
  component: PageContent,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Título da página'
    },
    description: {
      control: 'text',
      description: 'Descrição da página'
    },
    actionButton: {
      control: 'object',
      description: 'Botão de ação no header'
    },
    showSpotifyStatus: {
      control: 'boolean',
      description: 'Exibir status de conexão Spotify'
    },
    headerClassName: {
      control: 'text',
      description: 'Classes CSS adicionais para o header'
    },
    contentClassName: {
      control: 'text',
      description: 'Classes CSS adicionais para o conteúdo'
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais para o container'
    }
  }
} satisfies Meta<typeof PageContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Minha Página',
    description: 'Esta é uma descrição da página',
    children: (
      <div className="p-6 bg-gray-800 rounded-lg text-white">
        <h3 className="text-xl font-semibold mb-4">Conteúdo da Página</h3>
        <p className="text-gray-300">Este é o conteúdo principal da página.</p>
      </div>
    )
  }
};

export const WithActionButton: Story = {
  args: {
    title: 'Minhas Playlists',
    description: 'Sua coleção pessoal de playlists',
    actionButton: (
      <CreateButton
        text="Criar Playlist"
        onClick={() => console.log('Create playlist clicked')}
      />
    ),
    children: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="p-4 bg-gray-800 rounded-lg text-white">
            <h4 className="font-semibold">Playlist {i + 1}</h4>
            <p className="text-gray-400 text-sm">Músicas: {10 + i * 5}</p>
          </div>
        ))}
      </div>
    )
  }
};

export const WithoutSpotifyStatus: Story = {
  args: {
    title: 'Configurações',
    description: 'Configure suas preferências',
    showSpotifyStatus: false,
    children: (
      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded-lg text-white">
          <h4 className="font-semibold">Preferências de Áudio</h4>
          <p className="text-gray-400 text-sm">Qualidade, equalização, etc.</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg text-white">
          <h4 className="font-semibold">Privacidade</h4>
          <p className="text-gray-400 text-sm">Controle de dados e privacidade</p>
        </div>
      </div>
    )
  }
};

export const WithCustomStyles: Story = {
  args: {
    title: 'Página Personalizada',
    description: 'Página com estilos personalizados',
    className: 'bg-gradient-to-br from-gray-900 to-gray-800',
    contentClassName: 'mt-8',
    children: (
      <div className="p-8 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-xl border border-gray-700 text-white">
        <h3 className="text-2xl font-bold mb-4">Conteúdo Especial</h3>
        <p className="text-gray-300 mb-4">Este conteúdo usa estilos personalizados.</p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors">
            Ação Principal
          </button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Ação Secundária
          </button>
        </div>
      </div>
    )
  }
};

export const ComplexPage: Story = {
  args: {
    title: 'Biblioteca Musical',
    description: 'Sua coleção completa de músicas, álbuns e artistas',
    actionButton: (
      <CreateButton
        text="Adicionar Música"
        onClick={() => console.log('Add music clicked')}
      />
    ),
    children: (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Recentemente Adicionadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1 text-white">
                  <h4 className="font-semibold">Música {i + 1}</h4>
                  <p className="text-gray-400 text-sm">Artista {i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Álbuns Favoritos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="text-center">
                <div className="w-full aspect-square bg-gray-800 rounded-lg mb-2"></div>
                <p className="text-white text-sm font-medium">Álbum {i + 1}</p>
                <p className="text-gray-400 text-xs">Artista {i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
};