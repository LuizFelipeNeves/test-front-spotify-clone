import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreatePlaylistModal } from './CreatePlaylistModal';

vi.mock('@/components/ui', () => ({
  Button: ({ children, onClick, disabled, type, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      data-testid={props['data-testid']}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('CreatePlaylistModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onCreatePlaylist: vi.fn(async () => {}),
    isCreating: false,
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders modal when isOpen', () => {
    render(<CreatePlaylistModal {...defaultProps} />);
    expect(screen.getByTestId('create-playlist-modal')).toBeInTheDocument();
    expect(screen.getByTestId('playlist-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(<CreatePlaylistModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('create-playlist-modal')).not.toBeInTheDocument();
  });

  it('calls onClose on overlay click', () => {
    render(<CreatePlaylistModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not call onClose when clicking modal content', () => {
    render(<CreatePlaylistModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('create-playlist-modal'));
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking close button', () => {
    render(<CreatePlaylistModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('close-button'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose on Escape key', () => {
    render(<CreatePlaylistModal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('submits form with playlist name', async () => {
    const user = userEvent.setup();
    render(<CreatePlaylistModal {...defaultProps} />);

    const input = screen.getByTestId('playlist-name-input') as HTMLInputElement;
    await user.type(input, 'Minha Playlist');
    await user.click(screen.getByTestId('create-button'));

    await waitFor(() =>
      expect(defaultProps.onCreatePlaylist).toHaveBeenCalledWith('Minha Playlist')
    );
    expect(input.value).toBe('');
  });

  it('does not submit empty or whitespace-only playlist name', async () => {
    const user = userEvent.setup();
    render(<CreatePlaylistModal {...defaultProps} />);

    const input = screen.getByTestId('playlist-name-input');
    await user.type(input, '   ');
    await user.click(screen.getByTestId('create-button'));
    expect(defaultProps.onCreatePlaylist).not.toHaveBeenCalled();
  });

  it('disables button when isCreating', async () => {
    const user = userEvent.setup();
    render(<CreatePlaylistModal {...defaultProps} isCreating />);

    const button = screen.getByTestId('create-button');
    expect(button).toBeDisabled();

    const input = screen.getByTestId('playlist-name-input');
    await user.type(input, 'Teste');
    await user.click(button);

    expect(defaultProps.onCreatePlaylist).not.toHaveBeenCalled();
  });
});
