import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { Artist } from '@/types';

interface ArtistDetailHeaderProps {
  artist: Artist;
}

export const ArtistDetailHeader: React.FC<ArtistDetailHeaderProps> = ({
  artist,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center p-6 pb-0">
        <button
          onClick={() => navigate('/artists')}
          className="flex items-center text-white hover:text-green-500 transition-colors mr-4"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span className="text-lg font-medium">{artist.name}</span>
        </button>
      </div>
      <div className="flex items-center p-6 pt-4">
        {artist.images?.[0] && (
          <img
            src={artist.images[0].url}
            alt={artist.name}
            className="w-24 h-24 rounded-full object-cover mr-6"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold mb-2">{artist.name}</h1>
          {artist.followers?.total !== undefined && (
            <p className="text-gray-400 text-sm">
              {artist.followers.total.toLocaleString()} seguidores
            </p>
          )}
          {artist.genres?.length > 0 && (
            <p className="text-gray-400 text-sm mt-1">
              {artist.genres.slice(0, 3).join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
