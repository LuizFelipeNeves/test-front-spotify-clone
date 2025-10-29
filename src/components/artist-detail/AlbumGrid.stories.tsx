
import type { StoryFn, Meta } from '@storybook/react';

import { AlbumGrid } from './AlbumGrid';
import type { Album } from '@/components/AlbumCard';

export default {
  title: 'Components/AlbumGrid',
  component: AlbumGrid,
} as Meta;

const mockAlbum: Album = {
  id: '1',
  name: 'Album Title',
  artists: [{
    id: '1',
    name: 'Artist Name',
    images: [{ url: 'https://via.placeholder.com/50', height: 50, width: 50 }],
    followers: { total: 1000, href: null },
    genres: ['pop'],
    external_urls: { spotify: '' },
    href: '',
    popularity: 70,
    type: 'artist',
    uri: '',
  }],
  images: [{ url: 'https://via.placeholder.com/150', height: 150, width: 150 }],
  release_date: '2023-01-01',
  album_type: 'album',
  external_urls: { spotify: '' },
  total_tracks: 10,
};

const Template: StoryFn<{ title: string; albums: Album[]; onPlay: (album: Album) => void }> = (args) => (
  <div className="bg-black p-4">
    <AlbumGrid {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Albums',
  albums: Array.from({ length: 8 }, (_, i) => ({
    ...mockAlbum,
    id: String(i),
    name: `Album Title ${i + 1}`,
  })),
  onPlay: (album: Album) => console.log('Play album:', album.name),
};

export const Empty = Template.bind({});
Empty.args = {
  title: 'Albums',
  albums: [],
  onPlay: (album: Album) => console.log('Play album:', album.name),
};
