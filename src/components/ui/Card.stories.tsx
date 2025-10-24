import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';
import { Button } from './Button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Start building your next project with our powerful tools.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

export const PlaylistCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>My Playlist</CardTitle>
        <CardDescription>25 songs • 1h 30min</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-md"></div>
          <div>
            <p className="text-sm font-medium">Recently played</p>
            <p className="text-xs text-muted-foreground">Updated 2 hours ago</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="spotify" className="w-full">
          Play
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ArtistCard: Story = {
  render: () => (
    <Card className="w-[250px]">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
          <div>
            <CardTitle className="text-lg">Artist Name</CardTitle>
            <CardDescription>1.2M monthly listeners</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Follow
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
};