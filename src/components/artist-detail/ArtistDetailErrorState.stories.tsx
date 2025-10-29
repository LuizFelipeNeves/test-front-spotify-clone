
import type { StoryFn, Meta } from '@storybook/react';
import { ArtistDetailErrorState } from './ArtistDetailErrorState';

export default {
  title: 'Components/ArtistDetailErrorState',
  component: ArtistDetailErrorState,
} as Meta;

const Template: StoryFn<{ isOnline: boolean; errorMessage: string; onBackClick: () => void }> = (args) => (
  <div className="bg-black p-4">
    <ArtistDetailErrorState {...args} />
  </div>
);

export const OnlineError = Template.bind({});
OnlineError.args = {
  isOnline: true,
  errorMessage: 'Erro ao carregar dados do artista.',
  onBackClick: () => console.log('Back to Artists'),
};

export const OfflineError = Template.bind({});
OfflineError.args = {
  isOnline: false,
  errorMessage: 'Você está offline. Verifique sua conexão com a internet.',
  onBackClick: () => console.log('Back to Artists'),
};
