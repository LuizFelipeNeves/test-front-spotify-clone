import type { Meta, StoryObj } from '@storybook/react';
import { UserAvatar } from './UserAvatar';

const meta = {
  title: 'Shared/Media/UserAvatar',
  component: UserAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### UserAvatar Component

O componente UserAvatar exibe o avatar do usuário com:
- Suporte a imagens personalizadas
- Fallback para imagem padrão
- Estado de loading com skeleton
- Diferentes tamanhos (sm, md, lg)
- Cache de imagens otimizado

#### Funcionalidades:
- **Cache de Imagens**: Usa hook useImageCache para otimização
- **Fallback Inteligente**: Imagem padrão quando não há avatar
- **Loading State**: Skeleton animado durante carregamento
- **Responsivo**: 3 tamanhos predefinidos
- **Acessível**: Alt text apropriado
- **Design Consistente**: Gradiente Spotify quando sem imagem
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    imageUrl: {
      description: 'URL da imagem do avatar',
      control: { type: 'text' },
    },
    displayName: {
      description: 'Nome do usuário para alt text',
      control: { type: 'text' },
    },
    isLoading: {
      description: 'Estado de carregamento',
      control: { type: 'boolean' },
    },
    size: {
      description: 'Tamanho do avatar',
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    className: {
      description: 'Classes CSS adicionais',
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    displayName: 'João Silva',
    size: 'lg',
  },
};

export const WithImage: Story = {
  args: {
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    displayName: 'João Silva',
    size: 'lg',
  },
};

export const Loading: Story = {
  args: {
    displayName: 'João Silva',
    isLoading: true,
    size: 'lg',
  },
};

export const Small: Story = {
  args: {
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    displayName: 'João Silva',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    displayName: 'João Silva',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    displayName: 'João Silva',
    size: 'lg',
  },
};

export const WithoutImage: Story = {
  args: {
    imageUrl: null,
    displayName: 'Usuário Sem Avatar',
    size: 'lg',
  },
};

export const BrokenImage: Story = {
  args: {
    imageUrl: 'https://invalid-url.com/broken-image.jpg',
    displayName: 'Usuário com Imagem Quebrada',
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-white text-lg mb-4">Com Imagem</h3>
        <div className="flex items-end gap-8">
          <div className="text-center">
            <UserAvatar
              imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
              displayName="João Silva"
              size="sm"
            />
            <p className="text-gray-400 text-xs mt-2">Small</p>
          </div>
          <div className="text-center">
            <UserAvatar
              imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
              displayName="João Silva"
              size="md"
            />
            <p className="text-gray-400 text-xs mt-2">Medium</p>
          </div>
          <div className="text-center">
            <UserAvatar
              imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
              displayName="João Silva"
              size="lg"
            />
            <p className="text-gray-400 text-xs mt-2">Large</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white text-lg mb-4">Sem Imagem (Fallback)</h3>
        <div className="flex items-end gap-8">
          <div className="text-center">
            <UserAvatar displayName="Usuário 1" size="sm" />
            <p className="text-gray-400 text-xs mt-2">Small</p>
          </div>
          <div className="text-center">
            <UserAvatar displayName="Usuário 2" size="md" />
            <p className="text-gray-400 text-xs mt-2">Medium</p>
          </div>
          <div className="text-center">
            <UserAvatar displayName="Usuário 3" size="lg" />
            <p className="text-gray-400 text-xs mt-2">Large</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white text-lg mb-4">Loading States</h3>
        <div className="flex items-end gap-8">
          <div className="text-center">
            <UserAvatar displayName="Loading 1" isLoading={true} size="sm" />
            <p className="text-gray-400 text-xs mt-2">Small Loading</p>
          </div>
          <div className="text-center">
            <UserAvatar displayName="Loading 2" isLoading={true} size="md" />
            <p className="text-gray-400 text-xs mt-2">Medium Loading</p>
          </div>
          <div className="text-center">
            <UserAvatar displayName="Loading 3" isLoading={true} size="lg" />
            <p className="text-gray-400 text-xs mt-2">Large Loading</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const DifferentUsers: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-white text-lg mb-4">Diferentes Usuários</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <UserAvatar
            imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
            displayName="João Silva"
            size="lg"
          />
          <p className="text-white text-sm mt-2">João Silva</p>
          <p className="text-gray-400 text-xs">Com foto</p>
        </div>

        <div className="text-center">
          <UserAvatar
            imageUrl="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop"
            displayName="Maria Santos"
            size="lg"
          />
          <p className="text-white text-sm mt-2">Maria Santos</p>
          <p className="text-gray-400 text-xs">Com foto</p>
        </div>

        <div className="text-center">
          <UserAvatar displayName="Pedro Costa" size="lg" />
          <p className="text-white text-sm mt-2">Pedro Costa</p>
          <p className="text-gray-400 text-xs">Sem foto</p>
        </div>

        <div className="text-center">
          <UserAvatar displayName="Ana Oliveira" isLoading={true} size="lg" />
          <p className="text-white text-sm mt-2">Ana Oliveira</p>
          <p className="text-gray-400 text-xs">Carregando</p>
        </div>
      </div>
    </div>
  ),
};
