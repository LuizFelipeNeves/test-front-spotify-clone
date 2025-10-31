import type { Meta, StoryObj } from '@storybook/react';
import { InfiniteScrollList } from './InfiniteScrollList';

// Mock data interface
interface MockItem {
  id: number;
  name: string;
  description: string;
}

const meta: Meta<typeof InfiniteScrollList<MockItem>> = {
  title: 'UI/InfiniteScrollList',
  component: InfiniteScrollList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array de itens a serem renderizados',
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carregamento inicial',
    },
    error: {
      control: 'text',
      description: 'Mensagem de erro',
    },
    emptyMessage: {
      control: 'text',
      description: 'Mensagem para estado vazio',
    },
    emptyDescription: {
      control: 'text',
      description: 'Descrição para estado vazio',
    },
    hasNextPage: {
      control: 'boolean',
      description: 'Se há mais páginas para carregar',
    },
    isFetchingNextPage: {
      control: 'boolean',
      description: 'Se está carregando a próxima página',
    },
    loadingText: {
      control: 'text',
      description: 'Texto exibido durante carregamento infinito',
    },
    gridClassName: {
      control: 'text',
      description: 'Classes CSS para o grid de itens',
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfiniteScrollList<MockItem>>;

// Mock data
const mockItems: MockItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
}));

export const Default: Story = {
  args: {
    items: mockItems,
    renderItem: (item: MockItem) => (
      <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 text-white">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-400 text-sm">{item.description}</p>
      </div>
    ),
    gridClassName: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  },
};

export const WithGrid: Story = {
  args: {
    items: mockItems,
    renderItem: (item: MockItem) => (
      <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 text-white">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-400 text-sm">{item.description}</p>
      </div>
    ),
    gridClassName: 'grid grid-cols-2 gap-4',
  },
};

export const Loading: Story = {
  args: {
    items: [],
    loading: true,
    renderItem: item => (
      <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 text-white">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-400 text-sm">{item.description}</p>
      </div>
    ),
  },
};

export const Error: Story = {
  args: {
    items: [],
    error: 'Falha ao carregar os itens. Tente novamente.',
    onRetry: () => console.log('Retry clicked'),
    renderItem: item => (
      <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 text-white">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-400 text-sm">{item.description}</p>
      </div>
    ),
  },
};

export const Empty: Story = {
  args: {
    items: [],
    emptyMessage: 'Nenhum item encontrado',
    emptyDescription: 'Comece adicionando itens para ver algo aqui.',
    renderItem: item => (
      <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 text-white">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-400 text-sm">{item.description}</p>
      </div>
    ),
  },
};

export const WithInfiniteScroll: Story = {
  args: {
    items: mockItems,
    hasNextPage: true,
    isFetchingNextPage: false,
    fetchNextPage: () => console.log('Fetch next page called'),
    loadingText: 'Carregando mais itens...',
    renderItem: (item: MockItem) => (
      <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 text-white">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-400 text-sm">{item.description}</p>
      </div>
    ),
    gridClassName: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  },
};

export const LoadingNextPage: Story = {
  args: {
    items: mockItems,
    hasNextPage: true,
    isFetchingNextPage: true,
    fetchNextPage: () => console.log('Fetch next page called'),
    loadingText: 'Carregando mais itens...',
    renderItem: (item: MockItem) => (
      <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 text-white">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-400 text-sm">{item.description}</p>
      </div>
    ),
    gridClassName: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  },
};
