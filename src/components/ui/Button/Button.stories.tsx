import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'spotify'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Spotify: Story = {
  args: {
    variant: 'spotify',
    children: 'Login with Spotify',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: '🎵',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

// Accessibility stories
export const Accessibility: Story = {
  parameters: {
    docs: {
      description: {
        story: `### Accessibility Features

The Button component includes comprehensive accessibility support:

#### Keyboard Navigation
- **Tab**: Navigate to button
- **Enter/Space**: Activate button
- **Escape**: Exit button focus (when in modal)

#### Screen Reader Support
- **Semantic HTML**: Uses native \`<button>\` element
- **Focus Indicators**: Visible focus ring for keyboard navigation
- **ARIA Support**: Proper ARIA attributes for different variants

#### Visual Indicators
- **Focus Ring**: Green ring for Spotify variant
- **High Contrast**: Good contrast ratios for all variants
- **State Changes**: Clear visual feedback for interactions

#### Testing Checklist
- [ ] Navigate with Tab key
- [ ] Activate with Enter/Space
- [ ] Focus is clearly visible
- [ ] Screen reader announces button purpose
- [ ] Works with keyboard only
- [ ] Respects prefers-reduced-motion

**Keyboard Navigation Testing:**
1. Tab to navigate to button
2. Enter or Space to activate
3. Tab to move to next element
4. Shift+Tab to move to previous element

**Screen Reader Testing:**
1. Enable screen reader (NVDA, VoiceOver, JAWS)
2. Navigate to button
3. Verify button text is announced
4. Verify role="button" is announced`,
      },
    },
  },
  args: {
    variant: 'spotify',
    children: 'Login with Spotify',
    'aria-label': 'Login com sua conta Spotify',
  },
};

export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story: `### Keyboard Navigation Demo

This story demonstrates keyboard navigation capabilities:

**Instructions:**
1. Use Tab key to navigate to the button
2. Use Enter or Space to activate the button
3. Observe the focus indicator (green ring)
4. Use Shift+Tab to navigate backwards

**Expected Behavior:**
- Clear focus indicator appears
- Button can be activated without mouse
- Focus moves logically through the interface
- Visual feedback on focus and interaction`,
      },
    },
  },
  args: {
    variant: 'spotify',
    children: 'Test Keyboard Navigation',
  },
};

export const ScreenReaderDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: `### Screen Reader Testing

**Instructions:**
1. Enable your screen reader (NVDA, VoiceOver, JAWS)
2. Navigate to this button
3. Listen to the announcement

**Expected Announcement:**
- "Login with Spotify, button"
- Role and text should be clearly announced
- Focus state should be indicated

**Testing Tools:**
- [ChromeVox](https://www.chromevox.com/) - Chrome extension
- [NVDA](https://www.nvaccess.org/) - Windows screen reader
- [VoiceOver](https://www.apple.com/accessibility/vision/) - macOS screen reader
- [JAWS](https://www.freedomscientific.com/Products/software/JAWS/) - Commercial screen reader`,
      },
    },
  },
  args: {
    variant: 'spotify',
    children: 'Screen Reader Test',
    'aria-label': 'Teste de leitor de tela',
  },
};

export const FocusManagement: Story = {
  parameters: {
    docs: {
      description: {
        story: `### Focus Management

This demonstrates proper focus management:

**Features:**
- **Visible Focus Ring**: Green ring with 2px border
- **High Contrast**: White ring on black background
- **Focus Trapping**: Proper focus management in modals
- **Logical Order**: Follows natural reading order

**Focus Indicators:**
- Default: Blue ring with offset
- Spotify: Green ring with offset
- All variants have consistent focus styling`,
      },
    },
  },
  args: {
    variant: 'spotify',
    children: 'Focus Test',
  },
};