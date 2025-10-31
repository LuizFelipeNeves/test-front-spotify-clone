import { useImageCache } from '@/hooks/useImageCache';

interface UserAvatarProps {
  imageUrl?: string | null;
  displayName?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const fallBackImage =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop';

export function UserAvatar({
  imageUrl,
  displayName,
  isLoading = false,
  size = 'lg',
  className = '',
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const containerSizes = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-32 h-32',
  };

  const innerSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const innerIconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  // Use o hook de cache de imagens
  const { imageUrl: cachedImageUrl, isLoading: isImageLoading } = useImageCache(
    imageUrl,
    'user',
    { fallbackUrl: fallBackImage }
  );

  const loading = isLoading || isImageLoading;

  return (
    <div className={`mb-8 ${className}`}>
      {loading ? (
        <div
          className={`${containerSizes[size]} bg-gray-700 rounded-full mx-auto animate-pulse flex items-center justify-center`}
        >
          <svg
            className={`${iconSizes[size]} text-gray-500`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      ) : cachedImageUrl ? (
        <img
          src={cachedImageUrl}
          alt={displayName || ''}
          className={`${sizeClasses[size]} rounded-full mx-auto object-cover`}
        />
      ) : (
        <div
          className={`${containerSizes[size]} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center`}
        >
          <div
            className={`${innerSizes[size]} bg-black rounded-full flex items-center justify-center`}
          >
            <svg
              className={`${innerIconSizes[size]} text-yellow-400`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
