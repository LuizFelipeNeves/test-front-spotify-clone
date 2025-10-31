import type { Meta, StoryObj } from '@storybook/react';
import SpotifyLogo from './SpotifyLogo';

const meta = {
  title: 'Shared/Branding/SpotifyLogo',
  component: SpotifyLogo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### SpotifyLogo Component

O componente SpotifyLogo exibe o logotipo oficial do Spotify com:
- Ícone SVG do Spotify
- Texto "Spotify" opcional
- Diferentes tamanhos (sm, md, lg, xl)
- Acessibilidade completa

#### Funcionalidades:
- **Tamanhos Flexíveis**: 4 tamanhos predefinidos
- **Texto Opcional**: Pode mostrar ou ocultar o texto
- **Acessível**: Role e aria-label apropriados
- **Responsivo**: Adapta-se ao contexto
- **Consistente**: Design oficial do Spotify
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'Tamanho do logo',
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    showText: {
      description: 'Mostrar texto "Spotify"',
      control: { type: 'boolean' },
    },
    className: {
      description: 'Classes CSS adicionais',
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof SpotifyLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    showText: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    showText: true,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    showText: true,
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    showText: true,
  },
};

export const IconOnly: Story = {
  args: {
    size: 'md',
    showText: false,
  },
};

export const IconOnlySmall: Story = {
  args: {
    size: 'sm',
    showText: false,
  },
};

export const IconOnlyLarge: Story = {
  args: {
    size: 'lg',
    showText: false,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-white text-lg mb-4">Com Texto</h3>
        <div className="flex items-end gap-8">
          <div className="text-center">
            <SpotifyLogo size="sm" showText />
            <p className="text-gray-400 text-xs mt-2">Small</p>
          </div>
          <div className="text-center">
            <SpotifyLogo size="md" showText />
            <p className="text-gray-400 text-xs mt-2">Medium</p>
          </div>
          <div className="text-center">
            <SpotifyLogo size="lg" showText />
            <p className="text-gray-400 text-xs mt-2">Large</p>
          </div>
          <div className="text-center">
            <SpotifyLogo size="xl" showText />
            <p className="text-gray-400 text-xs mt-2">Extra Large</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white text-lg mb-4">Apenas Ícone</h3>
        <div className="flex items-end gap-8">
          <div className="text-center">
            <SpotifyLogo size="sm" showText={false} />
            <p className="text-gray-400 text-xs mt-2">Small</p>
          </div>
          <div className="text-center">
            <SpotifyLogo size="md" showText={false} />
            <p className="text-gray-400 text-xs mt-2">Medium</p>
          </div>
          <div className="text-center">
            <SpotifyLogo size="lg" showText={false} />
            <p className="text-gray-400 text-xs mt-2">Large</p>
          </div>
          <div className="text-center">
            <SpotifyLogo size="xl" showText={false} />
            <p className="text-gray-400 text-xs mt-2">Extra Large</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const OnDifferentBackgrounds: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="bg-black p-6 rounded-lg">
        <h4 className="text-white mb-4">Fundo Preto</h4>
        <SpotifyLogo size="lg" showText />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h4 className="text-white mb-4">Fundo Cinza Escuro</h4>
        <SpotifyLogo size="lg" showText />
      </div>

      <div className="bg-green-600 p-6 rounded-lg">
        <h4 className="text-white mb-4">Fundo Verde</h4>
        <SpotifyLogo size="lg" showText />
      </div>

      <div className="bg-white p-6 rounded-lg">
        <h4 className="text-black mb-4">Fundo Branco</h4>
        <SpotifyLogo size="lg" showText className="text-black" />
      </div>
    </div>
  ),
};
