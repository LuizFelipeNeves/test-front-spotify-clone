import type { Meta, StoryObj } from '@storybook/react';
import { VolumeSlider } from './VolumeSlider';
import {
  AccessibilityDemoComponent,
  KeyboardNavigationComponent,
} from './VolumeSlider.stories.components';

const meta: Meta<typeof VolumeSlider> = {
  title: 'UI/Controls/VolumeSlider',
  component: VolumeSlider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Controle deslizante de volume acessível com suporte completo a teclado e screen reader.

## Acessibilidade Implementada

### Navegação por Teclado
- **Tab**: Navega até o botão de mute/desmute
- **Enter/Space**: Ativa/desativa o mute
- **Arrow Keys**: Ajusta o volume quando o slider está focado
  - **←/↓**: Diminui volume em 5%
  - **→/↑**: Aumenta volume em 5%
  - **Home**: Volume mínimo (0%)
  - **End**: Volume máximo (100%)
  - **PageUp**: Aumenta 10%
  - **PageDown**: Diminui 10%
- **Escape**: Fecha o slider de volume

### Screen Reader Support
- **aria-label**: Labels descritivos em português
- **aria-valuetext**: Descrições contextuais ("Volume baixo", "Mudo", etc.)
- **aria-live**: Anúncio de mudanças de volume
- **role="slider"**: Identifica corretamente o componente como slider
- **aria-valuemin/max**: Define range de valores

### Focus Management
- Indicadores visuais de foco claros
- Gerenciamento automático de foco ao abrir/fechar
- Preservação de foco no botão principal

### Contraste e Visibilidade
- Cores com contraste WCAG AA compliant
- Indicadores visuais para estados hover/focus
- Percentual numérico para feedback claro
        `,
      },
    },
  },
  argTypes: {
    volume: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Nível de volume atual (0-1)',
    },
    isMuted: {
      control: 'boolean',
      description: 'Estado de mute/desmute',
    },
    onVolumeChange: {
      action: 'volume-changed',
      description: 'Callback quando o volume é alterado',
    },
    onToggleMute: {
      action: 'mute-toggled',
      description: 'Callback quando mute é alternado',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story principal
export const Default: Story = {
  args: {
    volume: 0.5,
    isMuted: false,
  },
};

// Variações de volume
export const LowVolume: Story = {
  args: {
    volume: 0.2,
    isMuted: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Volume baixo com ícone de som ativo.',
      },
    },
  },
};

export const HighVolume: Story = {
  args: {
    volume: 0.8,
    isMuted: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Volume alto próximo do máximo.',
      },
    },
  },
};

export const Muted: Story = {
  args: {
    volume: 0.5,
    isMuted: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado mudo com ícone de volume desativado.',
      },
    },
  },
};

export const ZeroVolume: Story = {
  args: {
    volume: 0,
    isMuted: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Volume no mínimo, mostrando ícone de mudo.',
      },
    },
  },
};

// Story de acessibilidade
export const AccessibilityDemo: Story = {
  render: () => <AccessibilityDemoComponent />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstração interativa das funcionalidades de acessibilidade.',
      },
    },
  },
};

// Story para testes de screen reader
export const ScreenReaderDemo: Story = {
  render: () => {
    return (
      <div className="space-y-4 p-6 bg-gray-900 rounded-lg max-w-md">
        <h2 className="text-lg font-semibold text-white mb-4">
          Screen Reader Support
        </h2>

        <div className="space-y-3">
          <div className="text-sm text-gray-300">
            <p className="mb-2">
              Este componente suporta completamente screen readers:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Labels descritivos em português</li>
              <li>Anúncio de mudanças de volume via aria-live</li>
              <li>Descrições contextuais (Volume baixo/alto)</li>
              <li>Estrutura semântica correta</li>
            </ul>
          </div>

          <div className="flex justify-center p-4 bg-gray-800 rounded">
            <VolumeSlider
              volume={0.6}
              isMuted={false}
              onVolumeChange={() => console.log('Volume changed')}
              onToggleMute={() => console.log('Mute toggled')}
            />
          </div>

          <div className="text-xs text-gray-400 bg-gray-800 p-3 rounded">
            <strong>Para testar:</strong> Ative seu screen reader e navegue pelo
            componente.
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstração do suporte a screen readers do componente.',
      },
    },
  },
};

// Testes de teclado
export const KeyboardNavigation: Story = {
  render: () => <KeyboardNavigationComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstração completa das funcionalidades de navegação por teclado.',
      },
    },
  },
};
