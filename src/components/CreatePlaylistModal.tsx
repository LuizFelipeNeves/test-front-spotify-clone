import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlaylist: (name: string) => Promise<void>;
  isCreating?: boolean;
}

export function CreatePlaylistModal({ isOpen, onClose, onCreatePlaylist, isCreating = false }: CreatePlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistName.trim() && !isCreating) {
      try {
        await onCreatePlaylist(playlistName.trim());
        setPlaylistName('');
      } catch (error) {
        // Error handling is done in the parent component
        console.error('Erro ao criar playlist:', error);
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm mx-4 relative" role="dialog" aria-modal="true" aria-labelledby="playlist-name-title">
        {/* Close button */}
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-0"
          aria-label="Fechar modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>

        {/* Modal content */}
        <div className="text-center mb-4">
          <h2 id="playlist-name-title" className="text-gray-400 text-sm mb-3">Dê um nome a sua playlist</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="playlist-name" className="sr-only">Nome da Playlist</label>
            <input
              id="playlist-name"
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
            <Button
              type="submit"
              disabled={!playlistName.trim() || isCreating}
              className="px-8 py-3 font-semibold rounded-full flex items-center gap-2 focus:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
              variant="spotify"
            >
              {isCreating && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isCreating ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}