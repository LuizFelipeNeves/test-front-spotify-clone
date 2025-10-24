import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PlayerCard } from './PlayerCard';

const meta = {
  title: 'UI/PlayerCard',
  component: PlayerCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isPlaying: {
      control: { type: 'boolean' },
    },
    title: {
      control: { type: 'text' },
    },
    artist: {
      control: { type: 'text' },
    },
    currentTime: {
      control: { type: 'text' },
    },
    duration: {
      control: { type: 'text' },
    },
  },
  args: {
    onPlayPause: fn(),
    onNext: fn(),
    onPrevious: fn(),
  },
} satisfies Meta<typeof PlayerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    isPlaying: false,
    currentTime: '1:23',
    duration: '5:55',
  },
};

export const Playing: Story = {
  args: {
    title: 'Imagine',
    artist: 'John Lennon',
    isPlaying: true,
    currentTime: '2:15',
    duration: '3:07',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Stairway to Heaven (Remastered)',
    artist: 'Led Zeppelin',
    isPlaying: false,
    currentTime: '4:32',
    duration: '8:02',
  },
};

export const BrazilianMusic: Story = {
  args: {
    title: 'Garota de Ipanema',
    artist: 'Tom Jobim & Vinícius de Moraes',
    isPlaying: true,
    currentTime: '1:45',
    duration: '2:56',
  },
};

export const WithAlbumArt: Story = {
  args: {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273c06f0e8b33c6e8a8c2f3e3e3',
    isPlaying: true,
    currentTime: '2:30',
    duration: '3:20',
  },
};

export const JustStarted: Story = {
  args: {
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    isPlaying: true,
    currentTime: '0:05',
    duration: '3:53',
  },
};

export const AlmostFinished: Story = {
  args: {
    title: 'Someone Like You',
    artist: 'Adele',
    isPlaying: false,
    currentTime: '4:40',
    duration: '4:45',
  },
};