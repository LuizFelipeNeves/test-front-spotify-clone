import React, { useRef, useEffect, useState } from 'react';

interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (newProgress: number) => void;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  duration,
  onSeek,
  className = '',
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(progress);

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

  const handleProgressMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(duration, (clickX / rect.width) * duration));
    
    setLocalProgress(newProgress);
  };

  const handleProgressMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);

      if (localProgress !== progress) {
        onSeek(localProgress);
      }
    }
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
  }, [isDragging]);

  const progressPercentage = duration ? (localProgress / duration) * 100 : 0;

  return (
    <div
      ref={progressBarRef}
      className={`flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group ${className}`}
      onMouseDown={handleProgressMouseDown}
      onClick={handleProgressClick}
    >
      <div
        className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
        style={{ width: `${progressPercentage}%` }}
      >
        <div
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
            isDragging ? 'opacity-100' : ''
          }`}
        />
      </div>
    </div>
  );
};
