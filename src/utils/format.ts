/**
 * Utility functions for formatting data
 */

/**
 * Format duration from milliseconds to MM:SS format
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format large numbers with K, M suffixes
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) return 'Agora mesmo';
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  if (diffInWeeks < 4) return `${diffInWeeks} semanas atrás`;
  if (diffInMonths < 12) return `${diffInMonths} meses atrás`;
  return `${diffInYears} anos atrás`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Format artist names from array
 */
export const formatArtists = (artists: { name: string }[]): string => {
  return artists.map(artist => artist.name).join(', ');
};

/**
 * Get image URL with fallback
 */
export const getImageUrl = (
  images: { url: string; width?: number; height?: number }[],
  size: 'small' | 'medium' | 'large' = 'medium'
): string => {
  if (!images || images.length === 0) {
    return '/placeholder-image.jpg'; // Fallback image
  }

  // Sort by size (largest first)
  const sortedImages = [...images].sort((a, b) => {
    const aSize = (a.width || 0) * (a.height || 0);
    const bSize = (b.width || 0) * (b.height || 0);
    return bSize - aSize;
  });

  switch (size) {
    case 'small':
      return sortedImages[sortedImages.length - 1]?.url || sortedImages[0]?.url;
    case 'large':
      return sortedImages[0]?.url;
    case 'medium':
    default: {
      const midIndex = Math.floor(sortedImages.length / 2);
      return sortedImages[midIndex]?.url || sortedImages[0]?.url;
    }
  }
};

/**
 * Generate random color for placeholders
 */
export const generateRandomColor = (): string => {
  const colors = [
    '#1DB954', // Spotify Green
    '#1ED760',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};
