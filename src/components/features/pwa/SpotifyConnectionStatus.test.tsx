import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpotifyConnectionStatus } from './SpotifyConnectionStatus';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { UI_TEXTS } from '@/constants/ui';

// Mock do hook useOnlineStatus
vi.mock('@/hooks/useOnlineStatus');
const mockUseOnlineStatus = vi.mocked(useOnlineStatus);

describe('SpotifyConnectionStatus Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render online status correctly', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    render(<SpotifyConnectionStatus />);

    expect(screen.getByText(UI_TEXTS.online)).toBeInTheDocument();
  });

  it('should render offline status correctly', () => {
    mockUseOnlineStatus.mockReturnValue(false);

    render(<SpotifyConnectionStatus />);

    expect(screen.getByText(UI_TEXTS.offline)).toBeInTheDocument();
  });

  it('should display green indicator when online', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    const { container } = render(<SpotifyConnectionStatus />);

    const indicator = container.querySelector('.bg-green-500');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass(
      'w-3',
      'h-3',
      'rounded-full',
      'animate-pulse'
    );
  });

  it('should display red indicator when offline', () => {
    mockUseOnlineStatus.mockReturnValue(false);

    const { container } = render(<SpotifyConnectionStatus />);

    const indicator = container.querySelector('.bg-red-500');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('w-3', 'h-3', 'rounded-full');
    expect(indicator).not.toHaveClass('animate-pulse');
  });

  it('should have green text when online', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    render(<SpotifyConnectionStatus />);

    const statusText = screen.getByText(UI_TEXTS.online);
    expect(statusText).toHaveClass('text-green-400');
  });

  it('should have red text when offline', () => {
    mockUseOnlineStatus.mockReturnValue(false);

    render(<SpotifyConnectionStatus />);

    const statusText = screen.getByText(UI_TEXTS.offline);
    expect(statusText).toHaveClass('text-red-400');
  });

  it('should apply custom className', () => {
    mockUseOnlineStatus.mockReturnValue(true);
    const customClass = 'custom-test-class';

    const { container } = render(
      <SpotifyConnectionStatus className={customClass} />
    );

    const component = container.firstChild as HTMLElement;
    expect(component).toHaveClass(customClass);
  });

  it('should have correct base styling', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    const { container } = render(<SpotifyConnectionStatus />);

    const component = container.firstChild as HTMLElement;
    expect(component).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('should have correct text styling', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    render(<SpotifyConnectionStatus />);

    const statusText = screen.getByText(UI_TEXTS.online);
    expect(statusText).toHaveClass('text-sm', 'font-medium');
  });

  it('should render without className prop', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    const { container } = render(<SpotifyConnectionStatus />);

    const component = container.firstChild as HTMLElement;
    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('should update when online status changes', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    const { rerender } = render(<SpotifyConnectionStatus />);

    expect(screen.getByText(UI_TEXTS.online)).toBeInTheDocument();

    // Simula mudança para offline
    mockUseOnlineStatus.mockReturnValue(false);
    rerender(<SpotifyConnectionStatus />);

    expect(screen.getByText(UI_TEXTS.offline)).toBeInTheDocument();
    expect(screen.queryByText(UI_TEXTS.online)).not.toBeInTheDocument();
  });

  it('should handle multiple className values', () => {
    mockUseOnlineStatus.mockReturnValue(true);
    const multipleClasses = 'class1 class2 class3';

    const { container } = render(
      <SpotifyConnectionStatus className={multipleClasses} />
    );

    const component = container.firstChild as HTMLElement;
    expect(component).toHaveClass('class1', 'class2', 'class3');
  });

  it('should maintain accessibility structure', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    render(<SpotifyConnectionStatus />);

    // Verifica se o texto está presente para leitores de tela
    expect(screen.getByText(UI_TEXTS.online)).toBeInTheDocument();

    // Verifica se a estrutura é semântica
    const statusText = screen.getByText(UI_TEXTS.online);
    expect(statusText.tagName).toBe('SPAN');
  });

  it('should render indicator with correct size', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    const { container } = render(<SpotifyConnectionStatus />);

    const indicator = container.querySelector('.w-3.h-3.rounded-full');
    expect(indicator).toBeInTheDocument();
  });

  it('should show pulse animation only when online', () => {
    // Test online state
    mockUseOnlineStatus.mockReturnValue(true);
    const { container, rerender } = render(<SpotifyConnectionStatus />);

    let indicator = container.querySelector('.bg-green-500');
    expect(indicator).toHaveClass('animate-pulse');

    // Test offline state
    mockUseOnlineStatus.mockReturnValue(false);
    rerender(<SpotifyConnectionStatus />);

    indicator = container.querySelector('.bg-red-500');
    expect(indicator).not.toHaveClass('animate-pulse');
  });

  it('should handle edge case with empty className', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    const { container } = render(<SpotifyConnectionStatus className="" />);

    const component = container.firstChild as HTMLElement;
    expect(component).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('should work with undefined className', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    const { container } = render(
      <SpotifyConnectionStatus className={undefined} />
    );

    const component = container.firstChild as HTMLElement;
    expect(component).toBeInTheDocument();
  });

  it('should display correct status text for both states', () => {
    // Test online
    mockUseOnlineStatus.mockReturnValue(true);
    const { rerender } = render(<SpotifyConnectionStatus />);

    expect(screen.getByText(UI_TEXTS.online)).toBeInTheDocument();
    expect(screen.queryByText(UI_TEXTS.offline)).not.toBeInTheDocument();

    // Test offline
    mockUseOnlineStatus.mockReturnValue(false);
    rerender(<SpotifyConnectionStatus />);

    expect(screen.getByText(UI_TEXTS.offline)).toBeInTheDocument();
    expect(screen.queryByText(UI_TEXTS.online)).not.toBeInTheDocument();
  });

  it('should have consistent layout structure', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    const { container } = render(<SpotifyConnectionStatus />);

    const component = container.firstChild as HTMLElement;
    const children = component.children;

    // Deve ter 2 filhos: indicador e texto
    expect(children).toHaveLength(2);

    // Primeiro filho deve ser o indicador
    expect(children[0]).toHaveClass('w-3', 'h-3', 'rounded-full');

    // Segundo filho deve ser o texto
    expect(children[1]).toHaveClass('text-sm', 'font-medium');
  });
});
