import { useState } from 'react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlaylist: (name: string) => void;
}

export function CreatePlaylistModal({ isOpen, onClose, onCreatePlaylist }: CreatePlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistName.trim()) {
      onCreatePlaylist(playlistName.trim());
      setPlaylistName('');
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Fechar modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal content */}
        <div className="text-center mb-6">
          <h2 className="text-gray-400 text-sm mb-4">Dê um nome a sua playlist</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Minha playlist #1"
              className="w-full bg-transparent border-b border-gray-600 text-white text-xl font-semibold text-center pb-2 focus:outline-none focus:border-green-500 transition-colors"
              autoFocus
              maxLength={100}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!playlistName.trim()}
              className="px-8 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 focus:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}