import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ArtistDetailErrorState } from './ArtistDetailErrorState';

// Mock dos ícones do lucide-react
vi.mock('lucide-react', () => ({
  Wifi: vi.fn(({ className, ...props }) => (
    <svg data-testid="wifi-icon" className={className} {...props}>
      <title>Wifi</title>
    </svg>
  )),
  WifiOff: vi.fn(({ className, ...props }) => (
    <svg data-testid="wifi-off-icon" className={className} {...props}>
      <title>WifiOff</title>
    </svg>
  )),
}));

describe('ArtistDetailErrorState', () => {
  const defaultProps = {
    isOnline: true,
    errorMessage: 'Erro ao carregar dados do artista',
    onBackClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<ArtistDetailErrorState {...defaultProps} />);

    expect(
      screen.getByText('Erro ao carregar dados do artista')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Voltar para Artistas' })
    ).toBeInTheDocument();
  });

  it('shows wifi icon when online', () => {
    render(<ArtistDetailErrorState {...defaultProps} isOnline={true} />);

    const wifiIcon = screen.getByTestId('wifi-icon');
    expect(wifiIcon).toBeInTheDocument();
    expect(wifiIcon).toHaveClass('text-green-500');
    expect(screen.queryByTestId('wifi-off-icon')).not.toBeInTheDocument();
  });

  it('shows wifi-off icon when offline', () => {
    render(<ArtistDetailErrorState {...defaultProps} isOnline={false} />);

    const wifiOffIcon = screen.getByTestId('wifi-off-icon');
    expect(wifiOffIcon).toBeInTheDocument();
    expect(wifiOffIcon).toHaveClass('text-red-500');
    expect(screen.queryByTestId('wifi-icon')).not.toBeInTheDocument();
  });

  it('displays custom error message', () => {
    const customMessage = 'Artista não encontrado';
    render(
      <ArtistDetailErrorState {...defaultProps} errorMessage={customMessage} />
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('calls onBackClick when back button is clicked', () => {
    const mockOnBackClick = vi.fn();
    render(
      <ArtistDetailErrorState {...defaultProps} onBackClick={mockOnBackClick} />
    );

    const backButton = screen.getByRole('button', {
      name: 'Voltar para Artistas',
    });
    fireEvent.click(backButton);

    expect(mockOnBackClick).toHaveBeenCalledTimes(1);
  });

  it('has correct styling classes', () => {
    render(<ArtistDetailErrorState {...defaultProps} />);

    // Verifica o container principal
    const container = screen
      .getByText('Erro ao carregar dados do artista')
      .closest('div');
    expect(container?.parentElement).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'min-h-screen'
    );

    // Verifica o botão
    const button = screen.getByRole('button', { name: 'Voltar para Artistas' });
    expect(button).toHaveClass(
      'px-4',
      'py-2',
      'bg-green-500',
      'text-white',
      'rounded-lg',
      'hover:bg-green-600',
      'transition-colors'
    );
  });

  it('displays error message with red text color', () => {
    render(<ArtistDetailErrorState {...defaultProps} />);

    const errorMessage = screen.getByText('Erro ao carregar dados do artista');
    expect(errorMessage).toHaveClass('text-red-500');
  });

  it('renders with offline state and appropriate styling', () => {
    const offlineMessage =
      'Você está offline. Verifique sua conexão com a internet.';
    render(
      <ArtistDetailErrorState
        {...defaultProps}
        isOnline={false}
        errorMessage={offlineMessage}
      />
    );

    expect(screen.getByText(offlineMessage)).toBeInTheDocument();
    expect(screen.getByTestId('wifi-off-icon')).toHaveClass('text-red-500');
  });

  it('renders with online state and appropriate styling', () => {
    const onlineMessage = 'Erro ao carregar dados do artista.';
    render(
      <ArtistDetailErrorState
        {...defaultProps}
        isOnline={true}
        errorMessage={onlineMessage}
      />
    );

    expect(screen.getByText(onlineMessage)).toBeInTheDocument();
    expect(screen.getByTestId('wifi-icon')).toHaveClass('text-green-500');
  });

  it('has proper icon sizing', () => {
    render(<ArtistDetailErrorState {...defaultProps} />);

    const wifiIcon = screen.getByTestId('wifi-icon');
    expect(wifiIcon).toHaveClass('w-6', 'h-6');
  });

  it('has proper icon spacing', () => {
    render(<ArtistDetailErrorState {...defaultProps} />);

    const wifiIcon = screen.getByTestId('wifi-icon');
    expect(wifiIcon).toHaveClass('mr-2');
  });

  it('handles long error messages', () => {
    const longMessage =
      'Este é um erro muito longo que pode acontecer quando há problemas de conectividade ou quando o servidor está indisponível por um período prolongado de tempo';
    render(
      <ArtistDetailErrorState {...defaultProps} errorMessage={longMessage} />
    );

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('handles empty error message', () => {
    const { container } = render(
      <ArtistDetailErrorState {...defaultProps} errorMessage="" />
    );

    // Verifica se o parágrafo existe mesmo com texto vazio
    const errorParagraph = container.querySelector('p.text-red-500');
    expect(errorParagraph).toBeInTheDocument();
    expect(errorParagraph?.textContent).toBe('');
    expect(
      screen.getByRole('button', { name: 'Voltar para Artistas' })
    ).toBeInTheDocument();
  });

  it('maintains button functionality with multiple clicks', () => {
    const mockOnBackClick = vi.fn();
    render(
      <ArtistDetailErrorState {...defaultProps} onBackClick={mockOnBackClick} />
    );

    const backButton = screen.getByRole('button', {
      name: 'Voltar para Artistas',
    });

    fireEvent.click(backButton);
    fireEvent.click(backButton);
    fireEvent.click(backButton);

    expect(mockOnBackClick).toHaveBeenCalledTimes(3);
  });

  it('has proper component structure', () => {
    render(<ArtistDetailErrorState {...defaultProps} />);

    // Verifica se existe um container principal
    const mainContainer = screen
      .getByText('Erro ao carregar dados do artista')
      .closest('div')?.parentElement;
    expect(mainContainer).toBeInTheDocument();

    // Verifica se existe um container para o ícone e mensagem
    const iconMessageContainer = screen
      .getByText('Erro ao carregar dados do artista')
      .closest('div');
    expect(iconMessageContainer).toBeInTheDocument();
    expect(iconMessageContainer).toHaveClass('flex', 'items-center', 'mb-4');

    // Verifica se o botão está presente
    const button = screen.getByRole('button', { name: 'Voltar para Artistas' });
    expect(button).toBeInTheDocument();
  });
});
