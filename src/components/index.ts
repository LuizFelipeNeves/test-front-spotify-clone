// UI Components - Componentes base reutilizáveis
export { Button } from './ui/Button/Button';
export { Card } from './ui/Card/Card';
export { Indicator } from './ui/Controls/Indicator';
export { CreateButton } from './ui/Controls/CreateButton';
export { PageContent } from './ui/Layout/PageContent';

// Feedback Components - Estados e feedback visual
export {
  ProgressBar
} from './ui/Feedback/ProgressBar';

export {
  StatusState,
  EmptyState,
  ErrorState,
  LoadingState
} from './shared/feedback/StatusState';

export { EmptyState as OriginalEmptyState } from './shared/feedback/EmptyState';
export { ErrorState as OriginalErrorState } from './shared/feedback/ErrorState';
export { LoadingSpinner } from './shared/feedback/LoadingSpinner';

// Controls Components - Controles interativos
export { VolumeSlider } from './ui/Controls/VolumeSlider';

// Shared Components - Componentes compartilhados genéricos
export { ResponsiveGrid } from './shared/grid/ResponsiveGrid';
export { InfiniteScrollList } from './shared/infinite/InfiniteScrollList';
export { InfinitePage } from './shared/infinite/InfinitePage';

// Layout Components - Componentes de layout compartilhados
export { AuthLayout } from './shared/layout/AuthLayout';
export { ContentPage } from './shared/layout/ContentPage';

// Media Components - Cards e componentes de mídia
export {
  MediaCard,
  AlbumCard,
  PlaylistCard
} from './shared/media/MediaCard';

export { ArtistCard } from './shared/media/ArtistCard';
export { UserAvatar } from './shared/media/UserAvatar';

export { ArtistCard as FeatureArtistCard } from './features/media/ArtistCard';
export { AlbumCard as FeatureAlbumCard } from './features/media/AlbumCard';
export { PlaylistCard as FeaturePlaylistCard } from './features/media/PlaylistCard';

// Branding Components - Identidade visual
export { default as SpotifyLogo } from './shared/branding/SpotifyLogo';

// Feature Components - Componentes específicos de funcionalidades
export { default as MusicPlayerBar } from './features/player/MusicPlayerBar';
export { default as Layout } from './features/navigation/Layout';
export { Sidebar } from './features/navigation/Sidebar';
export { CreatePlaylistModal } from './features/forms/CreatePlaylistModal';

// PWA Components - Progressive Web App
export { PWAUpdateNotification } from './features/pwa/PWAUpdateNotification';
export { SpotifyConnectionStatus } from './features/pwa/SpotifyConnectionStatus';

// Artist Detail Components - Componentes de detalhes de artista
export { ArtistDetailHeader } from './features/artist-detail/ArtistDetailHeader';
export { AlbumGrid } from './features/artist-detail/AlbumGrid';
export { ArtistDetailErrorState } from './features/artist-detail/ArtistDetailErrorState';

export { PageHeader } from './ui/Layout/PageHeader';