
import { ArtistDetailHeader } from './ArtistDetailHeader';
import type { StoryFn, Meta } from '@storybook/react';
import type { Artist } from '@/types';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'Components/ArtistDetailHeader',
  component: ArtistDetailHeader,
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
} as Meta;

const mockArtist: Artist = {
  id: '1',
  name: 'Test Artist',
  images: [{ url: 'https://via.placeholder.com/150', height: 150, width: 150 }],
  followers: { total: 1234567, href: '' },
  genres: ['rock', 'pop', 'indie'],
  external_urls: { spotify: '' },
  href: '',
  popularity: 80,
  type: 'artist',
  uri: '',
};

const Template: StoryFn<{ artist: Artist }> = (args) => <ArtistDetailHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  artist: mockArtist,
};
