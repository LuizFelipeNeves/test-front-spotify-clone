import React, { useRef, useEffect, useState, useCallback } from 'react';

interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (newProgress: number) => void;
  className?: string;
  'aria-label'?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  duration,
  onSeek,
  className = '',
  'aria-label': ariaLabel = 'Progresso da música',
  onKeyDown,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(progress);
  const [isFocused, setIsFocused] = useState(false);

  // Update local progress when not dragging
  useEffect(() => {
    if (!isDragging) {
      setLocalProgress(progress);
    }
  }, [progress, isDragging]);

  // Handle progress bar click and drag
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration || isDragging) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * duration;

    setLocalProgress(newProgress);
    onSeek(newProgress);
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * duration;

    setLocalProgress(newProgress);
    setIsDragging(true);
  };

  const handleProgressMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !progressBarRef.current || !duration) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = Math.max(
        0,
        Math.min(duration, (clickX / rect.width) * duration)
      );

      setLocalProgress(newProgress);
    },
    [isDragging, progressBarRef, duration]
  );

  const handleProgressMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);

      if (localProgress !== progress) {
        onSeek(localProgress);
      }
    }
  }, [isDragging, localProgress, progress, onSeek]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!duration) return;

    const step = duration * 0.05; // 5% of duration
    let newProgress = localProgress;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newProgress = Math.max(0, localProgress - step);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newProgress = Math.min(duration, localProgress + step);
        break;
      case 'Home':
        e.preventDefault();
        newProgress = 0;
        break;
      case 'End':
        e.preventDefault();
        newProgress = duration;
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        // Toggle play/pause functionality could be added here
        return;
      default:
        return;
    }

    setLocalProgress(newProgress);
    onSeek(newProgress);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleProgressMouseMove);
      document.addEventListener('mouseup', handleProgressMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleProgressMouseMove);
        document.removeEventListener('mouseup', handleProgressMouseUp);
      };
    }
  }, [isDragging, handleProgressMouseMove, handleProgressMouseUp]);

  const progressPercentage = duration ? (localProgress / duration) * 100 : 0;

  return (
    <div
      ref={progressBarRef}
      className={`flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1 ${className}`}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={localProgress}
      aria-valuetext={`${formatTime(localProgress)} de ${formatTime(duration)}`}
      tabIndex={0}
      onMouseDown={handleProgressMouseDown}
      onClick={handleProgressClick}
      onKeyDown={e => {
        handleKeyDown(e);
        if (onKeyDown) {
          onKeyDown(e);
        }
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div
        className={`h-full bg-white rounded-full relative transition-colors ${
          isFocused ? 'bg-green-500' : 'group-hover:bg-green-500'
        }`}
        style={{ width: `${progressPercentage}%` }}
      >
        <div
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-opacity ${
            isDragging || isFocused ? 'opacity-100' : 'group-hover:opacity-100'
          }`}
        />
      </div>
    </div>
  );

  // Helper function to format time
  function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};
