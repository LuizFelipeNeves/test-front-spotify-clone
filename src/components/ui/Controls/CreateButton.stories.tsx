import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';
import { CreateButton } from './CreateButton';

const meta = {
  title: 'UI/CreateButton',
  component: CreateButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: 'Função chamada ao clicar no botão',
    },
    text: {
      control: 'text',
      description: 'Texto do botão',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Variante visual do botão',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho do botão',
    },
    title: {
      control: 'text',
      description: 'Tooltip exibido ao passar o mouse',
    },
    ariaLabel: {
      control: 'text',
      description: 'Label para acessibilidade',
    },
  },
} satisfies Meta<typeof CreateButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Criar',
    onClick: () => console.log('Button clicked'),
  },
};

export const Primary: Story = {
  args: {
    text: 'Criar Playlist',
    variant: 'primary',
    onClick: () => console.log('Primary button clicked'),
  },
};

export const Secondary: Story = {
  args: {
    text: 'Criar Playlist',
    variant: 'secondary',
    onClick: () => console.log('Secondary button clicked'),
  },
};

export const Small: Story = {
  args: {
    text: 'Criar',
    size: 'sm',
    onClick: () => console.log('Small button clicked'),
  },
};

export const Large: Story = {
  args: {
    text: 'Criar Nova Playlist',
    size: 'lg',
    onClick: () => console.log('Large button clicked'),
  },
};

export const WithCustomIcon: Story = {
  args: {
    text: 'Adicionar Música',
    icon: <Plus className="w-5 h-5" />,
    onClick: () => console.log('Button with custom icon clicked'),
  },
};

export const WithTooltip: Story = {
  args: {
    text: 'Criar Playlist',
    title: 'Criar uma nova playlist',
    ariaLabel: 'Criar nova playlist de músicas',
    onClick: () => console.log('Button with tooltip clicked'),
  },
};

export const CustomStyles: Story = {
  args: {
    text: 'Personalizado',
    className: 'shadow-lg hover:shadow-xl transform hover:scale-105',
    onClick: () => console.log('Custom styled button clicked'),
  },
};
