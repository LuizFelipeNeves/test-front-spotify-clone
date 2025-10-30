import type { Meta, StoryObj } from '@storybook/react';
import { SkipLink } from './SkipLink';
import { UI_TEXTS } from '@/constants/ui';

const meta = {
  title: 'Accessibility/SkipLink',
  component: SkipLink,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'SkipLink is an accessibility component that allows keyboard users to quickly navigate to the main content of a page. It is hidden by default and becomes visible when focused.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
      description: 'The target anchor for the skip link',
    },
    children: {
      control: 'text',
      description: 'The text content of the skip link',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    href: '#main-content',
    children: 'Pular para conteúdo principal',
  },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '#main-content',
    children: UI_TEXTS.pularParaConteudoPrincipal,
  },
};

export const CustomText: Story = {
  args: {
    href: '#main',
    children: UI_TEXTS.irParaConteudoPrincipal,
  },
};

export const CustomTarget: Story = {
  args: {
    href: '#navigation',
    children: 'Pular para navegação',
  },
};

export const MultipleTargets: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SkipLink href="#main-content">Pular para conteúdo principal</SkipLink>
      <SkipLink href="#navigation">Pular para navegação</SkipLink>
      <SkipLink href="#search">Pular para busca</SkipLink>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple skip links can be used on the same page to provide quick access to different sections.',
      },
    },
  },
};

export const AccessibilityDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: `### Accessibility Features

The SkipLink component implements WCAG 2.1 AA compliant skip navigation:

#### How to Test
1. Use Tab key to navigate to the SkipLink
2. Observe the link becomes visible with green styling
3. Press Enter to jump to the target content
4. Verify you land at the correct anchor

#### Features
- **Screen Reader Support**: Properly announced by screen readers
- **Keyboard Navigation**: Fully keyboard accessible
- **Visual Focus Indicator**: Clear green ring when focused
- **High Contrast**: Good contrast ratios for visibility
- **Semantic HTML**: Uses proper link element

#### Technical Implementation
- Uses \`sr-only\` class for hiding by default
- \`focus:not-sr-only\` to show when focused
- Proper z-index for layering
- Tailwind CSS for consistent styling

#### Browser Support
- ✅ Chrome (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Edge (all versions)
- ✅ Screen Readers (NVDA, VoiceOver, JAWS)`,
      },
    },
  },
  render: () => (
    <div style={{ textAlign: 'center' }}>
      <SkipLink href="#content">Pular para conteúdo demonstrativo</SkipLink>
      <div style={{
        marginTop: '20px',
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>Conteúdo Demonstrativo</h2>
        <p>Este é o conteúdo para onde o skip link leva quando ativado.</p>
        <p>Teste usando a tecla Tab para navegar até o link skip e pressionar Enter para pular para cá.</p>
      </div>
    </div>
  ),
};

export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story: `### Keyboard Navigation Testing

This story demonstrates keyboard navigation capabilities:

**Test Steps:**
1. Use Tab key to navigate to the SkipLink
2. Observe the link becomes visible
3. Press Enter or Space to activate
4. Verify you jump to the target content

**Expected Behavior:**
- Link appears when focused
- Clear visual feedback
- Smooth jump to target
- Proper focus management

**Keyboard Shortcuts:**
- Tab: Navigate to next element
- Shift+Tab: Navigate to previous element
- Enter/Space: Activate link
- Esc: Exit focus (if applicable)`,
      },
    },
  },
  render: () => (
    <div style={{ textAlign: 'center', minHeight: '300px' }}>
      <div style={{
        marginBottom: '20px',
        padding: '1rem',
        backgroundColor: '#e8f5e8',
        borderRadius: '8px',
        border: '2px solid #28a745'
      }}>
        <p><strong>Instructions:</strong></p>
        <p>1. Press Tab to focus the SkipLink below</p>
        <p>2. Press Enter to test navigation</p>
      </div>

      <SkipLink href="#target-content">Pular para conteúdo alvo</SkipLink>

      <div style={{
        marginTop: '40px',
        padding: '2rem',
        border: '2px dashed #007bff',
        borderRadius: '8px'
      }} id="target-content">
        <h2>Conteúdo Alvo</h2>
        <p>Você deve ter pulado para cá usando o SkipLink!</p>
        <p>O SkipLink ajuda usuários de leitores de tela e usuários de teclado a pular navegação repetitiva.</p>
      </div>
    </div>
  ),
};

export const ScreenReaderTest: Story = {
  parameters: {
    docs: {
      description: {
        story: `### Screen Reader Testing

**Testing with Screen Readers:**

**NVDA (Windows):**
1. Enable NVDA
2. Navigate to this page
3. Press Tab to find the SkipLink
4. Listen for announcement: "Pular para conteúdo principal, link"
5. Press Enter to activate
6. Verify jump to content

**VoiceOver (macOS):**
1. Enable VoiceOver (Cmd+F5)
2. Navigate with VO+Right arrow
3. Find the SkipLink
4. Listen for announcement
5. Press Control+Option+Space to activate

**JAWS (Windows):**
1. Enable JAWS
2. Use JAWS key to navigate
3. Find the SkipLink
4. Listen for proper announcement
5. Press Enter to activate

**Expected Announcement:**
"[Link text], link"
- Role is announced correctly
- Text is clearly read
- Interactive nature is indicated

**Success Criteria:**
- ✅ Link is announced by screen reader
- ✅ Role is correctly identified
- ✅ Text is clearly readable
- ✅ Activation works properly`,
      },
    },
  },
  render: () => (
    <div>
      <SkipLink href="#screen-reader-content">
        Pular para conteúdo de teste
      </SkipLink>

      <div style={{
        marginTop: '20px',
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px'
      }}>
        <h2>Área de Conteúdo</h2>
        <p>Este conteúdo é projetado para testes com leitores de tela.</p>
        <p>Os leitores de tela devem anunciar o link skip quando ele recebe foco.</p>
        <div id="screen-reader-content">
          <h3>Conteúdo Alvo</h3>
          <p>Este é o conteúdo para onde o link skip leva.</p>
        </div>
      </div>
    </div>
  ),
};

export const DesignVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
      <div>
        <h3>Default Styling</h3>
        <SkipLink href="#default">Link Padrão</SkipLink>
      </div>

      <div>
        <h3>Custom Styling</h3>
        <SkipLink href="#custom" className="bg-blue-500 text-white px-6 py-3">
          Link Personalizado
        </SkipLink>
      </div>

      <div>
        <h3>Different Text</h3>
        <SkipLink href="#different">Ir para navegação principal</SkipLink>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different styling variations of the SkipLink component while maintaining accessibility features.',
      },
    },
  },
};