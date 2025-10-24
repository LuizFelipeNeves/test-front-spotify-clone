import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './Card';
import { Button } from './Button';

interface PlayerCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  artist: string;
  albumArt?: string;
  isPlaying?: boolean;
  duration?: string;
  currentTime?: string;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const PlayerCard = forwardRef<HTMLDivElement, PlayerCardProps>(
  ({ 
    className, 
    title, 
    artist, 
    albumArt, 
    isPlaying = false, 
    duration = "3:45", 
    currentTime = "1:23",
    onPlayPause,
    onNext,
    onPrevious,
    ...props 
  }, ref) => {
    const progressPercentage = currentTime && duration 
      ? (parseFloat(currentTime.replace(':', '.')) / parseFloat(duration.replace(':', '.'))) * 100 
      : 30;

    return (
      <Card ref={ref} className={cn('w-full max-w-md', className)} {...props}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {/* Album Art */}
            <div className="w-16 h-16 rounded-md overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
              {albumArt ? (
                <img src={albumArt} alt={`${title} album art`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                  🎵
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{title}</h3>
              <p className="text-xs text-muted-foreground truncate">{artist}</p>
              
              {/* Progress Bar */}
              <div className="mt-2 space-y-1">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{currentTime}</span>
                  <span>{duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onPrevious}
              className="h-8 w-8"
            >
              ⏮️
            </Button>
            <Button 
              variant="spotify" 
              size="icon" 
              onClick={onPlayPause}
              className="h-10 w-10"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onNext}
              className="h-8 w-8"
            >
              ⏭️
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

PlayerCard.displayName = 'PlayerCard';

export { PlayerCard };