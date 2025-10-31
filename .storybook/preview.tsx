import type { Preview } from '@storybook/react';
import '../src/index.css';
import { MockSpotifyPlayerProvider } from './MockProviders';

const preview: Preview = {
  decorators: [
    (Story) => (
       <MockSpotifyPlayerProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Story />
        </div>
      </MockSpotifyPlayerProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'spotify-dark',
      values: [
        {
          name: 'spotify-dark',
          value: '#121212', // Spotify's dark background
        },
        {
          name: 'spotify-darker',
          value: '#0a0a0a', // Very dark background
        },
        {
          name: 'spotify-gray',
          value: '#1a1a1a', // Medium dark background
        },
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'gray-light',
          value: '#f5f5f5',
        },
      ],
    },
    layout: 'centered',
    docs: {
      theme: {
        base: 'dark',
        colorPrimary: '#1db954', // Spotify green
        colorSecondary: '#1db954',
        appBg: '#121212',
        appContentBg: '#1a1a1a',
        appBorderColor: '#333333',
        textColor: '#ffffff',
        textInverseColor: '#000000',
        barTextColor: '#ffffff',
        barSelectedColor: '#1db954',
        barBg: '#1a1a1a',
        inputBg: '#2a2a2a',
        inputBorder: '#404040',
        inputTextColor: '#ffffff',
        inputBorderRadius: 4,
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
