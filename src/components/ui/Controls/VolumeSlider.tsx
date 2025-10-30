import React, { useRef, useState, useEffect } from 'react';
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
  const volumeButtonRef = useRef<HTMLButtonElement>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Gerenciar foco e fechamento com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showVolumeSlider) {
        setShowVolumeSlider(false);
        volumeButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (showVolumeSlider && volumeSliderRef.current && !volumeSliderRef.current.contains(e.target as Node) && !volumeButtonRef.current?.contains(e.target as Node)) {
        setShowVolumeSlider(false);
      }
    };

    if (showVolumeSlider) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVolumeSlider]);

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeSliderRef.current) return;

    const rect = volumeSliderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, clickX / rect.width));

    onVolumeChange(newVolume);
  };

  // Suporte a teclado para ajuste de volume
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!volumeSliderRef.current) return;

    const step = 0.05; // 5% increments
    let newVolume = volume;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newVolume = Math.max(0, volume - step);
        onVolumeChange(newVolume);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newVolume = Math.min(1, volume + step);
        onVolumeChange(newVolume);
        break;
      case 'Home':
        e.preventDefault();
        onVolumeChange(0);
        break;
      case 'End':
        e.preventDefault();
        onVolumeChange(1);
        break;
      case 'PageUp':
        e.preventDefault();
        onVolumeChange(Math.min(1, volume + 0.1));
        break;
      case 'PageDown':
        e.preventDefault();
        onVolumeChange(Math.max(0, volume - 0.1));
        break;
    }
  };

  const volumePercentage = volume * 100;

  // Gerar aria-valuetext para screen readers
  const getVolumeText = () => {
    if (isMuted || volume === 0) return 'Mudo';
    if (volume < 0.33) return 'Volume baixo';
    if (volume < 0.66) return 'Volume médio';
    return 'Volume alto';
  };

  return (
    <div className="relative">
      <button
        ref={volumeButtonRef}
        onClick={onToggleMute}
        onMouseEnter={() => setShowVolumeSlider(true)}
        onFocus={() => setShowVolumeSlider(true)}
        className="text-gray-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label={isMuted || volume === 0 ? "Ativar som" : "Desativar som"}
        aria-pressed={isMuted || volume === 0}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      {showVolumeSlider && (
        <div
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 p-3 rounded-md shadow-lg border border-gray-700"
          onMouseLeave={() => setShowVolumeSlider(false)}
          role="dialog"
          aria-modal="false"
          aria-label="Controle de volume"
        >
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            Volume atual: {Math.round(volumePercentage)}%
          </div>
          <div
            ref={volumeSliderRef}
            className="w-24 h-2 bg-gray-600 rounded-full cursor-pointer group relative focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={handleVolumeClick}
            onKeyDown={handleKeyDown}
            role="slider"
            aria-label="Volume"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(volumePercentage)}
            aria-valuetext={getVolumeText()}
            tabIndex={0}
          >
            <div
              className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
              style={{ width: `${volumePercentage}%` }}
            >
              <div
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="text-xs text-gray-400 text-center mt-2">
            {Math.round(volumePercentage)}%
          </div>
        </div>
      )}
    </div>
  );
};
