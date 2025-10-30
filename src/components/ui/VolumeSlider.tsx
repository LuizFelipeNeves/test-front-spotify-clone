import React, { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeSliderProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (newVolume: number) => void;
  onToggleMute: () => void;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => {
  const volumeSliderRef = useRef<HTMLDivElement>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeSliderRef.current) return;

    const rect = volumeSliderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, clickX / rect.width));

    onVolumeChange(newVolume);
  };

  const volumePercentage = volume * 100;

  return (
    <div className="relative">
      <button
        onClick={onToggleMute}
        onMouseEnter={() => setShowVolumeSlider(true)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      {showVolumeSlider && (
        <div
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 p-2 rounded-md"
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <div
            ref={volumeSliderRef}
            className="w-20 h-1 bg-gray-600 rounded-full cursor-pointer group"
            onClick={handleVolumeClick}
          >
            <div
              className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
              style={{ width: `${volumePercentage}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
