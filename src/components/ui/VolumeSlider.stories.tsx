import type { Meta, StoryObj } from '@storybook/react';
import { VolumeSlider } from './VolumeSlider';

const meta: Meta<typeof VolumeSlider> = {
  title: 'UI/VolumeSlider',
  component: VolumeSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    volume: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Current volume level (0 to 1)',
    },
    isMuted: {
      control: 'boolean',
      description: 'Whether the volume is currently muted',
    },
    onVolumeChange: {
      action: 'volume changed',
      description: 'Callback when the volume changes',
    },
    onToggleMute: {
      action: 'toggle mute',
      description: 'Callback to toggle mute state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof VolumeSlider>;

export const Default: Story = {
  args: {
    volume: 0.5,
    isMuted: false,
  },
};

export const Muted: Story = {
  args: {
    volume: 0,
    isMuted: true,
  },
};

export const MaxVolume: Story = {
  args: {
    volume: 1,
    isMuted: false,
  },
};

export const MinVolume: Story = {
  args: {
    volume: 0.1,
    isMuted: false,
  },
};
