import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 180000, step: 1000 },
      description: 'Current progress in milliseconds',
    },
    duration: {
      control: { type: 'range', min: 0, max: 180000, step: 1000 },
      description: 'Total duration in milliseconds',
    },
    onSeek: {
      action: 'seek',
      description: 'Callback function when seeking to a new position',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockOnSeek = (newProgress: number) => {
  console.log(`Seeked to: ${newProgress}ms`);
};

export const Default: Story = {
  args: {
    progress: 30000,
    duration: 180000,
    onSeek: mockOnSeek,
  },
};

export const HalfProgress: Story = {
  args: {
    progress: 90000,
    duration: 180000,
    onSeek: mockOnSeek,
  },
};

export const FullProgress: Story = {
  args: {
    progress: 180000,
    duration: 180000,
    onSeek: mockOnSeek,
  },
};

export const ZeroProgress: Story = {
  args: {
    progress: 0,
    duration: 180000,
    onSeek: mockOnSeek,
  },
};
