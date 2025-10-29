
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';


interface ArtistDetailErrorStateProps {
  isOnline: boolean;
  errorMessage: string;
  onBackClick: () => void;
}

export const ArtistDetailErrorState: React.FC<ArtistDetailErrorStateProps> = ({
  isOnline,
  errorMessage,
  onBackClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center mb-4">
        {isOnline ? (
          <Wifi className="w-6 h-6 text-green-500 mr-2" />
        ) : (
          <WifiOff className="w-6 h-6 text-red-500 mr-2" />
        )}
        <p className="text-red-500">{errorMessage}</p>
      </div>
      <button
        onClick={onBackClick}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Voltar para Artistas
      </button>
    </div>
  );
};
