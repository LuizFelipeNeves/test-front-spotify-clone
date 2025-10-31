import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ProgressBar } from './Feedback/ProgressBar';

describe('ProgressBar', () => {
  const defaultProps = {
    progress: 30000, // 30 seconds
    duration: 180000, // 3 minutes
    onSeek: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default props', () => {
    render(<ProgressBar {...defaultProps} />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '180000');
    expect(progressBar).toHaveAttribute('aria-valuenow', '30000');
  });

  it('should apply custom className', () => {
    render(<ProgressBar {...defaultProps} className="custom-class" />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveClass('custom-class');
  });

  it('should handle click events', () => {
    const mockOnSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={mockOnSeek} />);
    
    const progressBar = screen.getByRole('slider');
    
    // Mock getBoundingClientRect
    vi.spyOn(progressBar, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 100,
      top: 0,
      right: 100,
      bottom: 10,
      height: 10,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.click(progressBar, { clientX: 50 });
    
    expect(mockOnSeek).toHaveBeenCalled();
  });

  it('should handle mouse down events', () => {
    const mockOnSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={mockOnSeek} />);

    const progressBar = screen.getByRole('slider');

    // Mock getBoundingClientRect
    vi.spyOn(progressBar, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 100,
      top: 0,
      right: 100,
      bottom: 10,
      height: 10,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.mouseDown(progressBar, { clientX: 25 });
    fireEvent.mouseUp(progressBar);

    expect(mockOnSeek).toHaveBeenCalled();
  });

  it('should calculate correct percentage', () => {
    render(<ProgressBar progress={45000} duration={180000} onSeek={vi.fn()} />);
    
    const progressFill = screen.getByRole('slider').querySelector('[style*="width"]');
    expect(progressFill).toHaveStyle('width: 25%'); // 45000/180000 = 0.25 = 25%
  });

  it('should handle zero values', () => {
    render(<ProgressBar progress={0} duration={180000} onSeek={vi.fn()} />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    
    const progressFill = progressBar.querySelector('[style*="width"]');
    expect(progressFill).toHaveStyle('width: 0%');
  });

  it('should handle maximum values', () => {
    render(<ProgressBar progress={180000} duration={180000} onSeek={vi.fn()} />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveAttribute('aria-valuenow', '180000');
    
    const progressFill = progressBar.querySelector('[style*="width"]');
    expect(progressFill).toHaveStyle('width: 100%');
  });

  it('should handle zero duration', () => {
    render(<ProgressBar progress={0} duration={0} onSeek={vi.fn()} />);
    
    const progressFill = screen.getByRole('slider').querySelector('[style*="width"]');
    expect(progressFill).toHaveStyle('width: 0%');
  });

  it('should have proper accessibility attributes', () => {
    render(<ProgressBar {...defaultProps} />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveAttribute('tabIndex', '0');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '180000');
    expect(progressBar).toHaveAttribute('aria-valuenow', '30000');
    expect(progressBar).toHaveAttribute('aria-label', 'Progresso da música');
  });

  it('should handle keyboard navigation - ArrowRight', () => {
    const mockOnSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={mockOnSeek} />);
    
    const progressBar = screen.getByRole('slider');
    progressBar.focus();
    
    fireEvent.keyDown(progressBar, { key: 'ArrowRight' });
    
    expect(mockOnSeek).toHaveBeenCalledWith(39000); // 30000 + 5% of 180000 (9000)
  });

  it('should handle keyboard navigation - ArrowLeft', () => {
    const mockOnSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={mockOnSeek} />);
    
    const progressBar = screen.getByRole('slider');
    progressBar.focus();
    
    fireEvent.keyDown(progressBar, { key: 'ArrowLeft' });
    
    expect(mockOnSeek).toHaveBeenCalledWith(21000); // 30000 - 5% of 180000 (9000)
  });

  it('should handle keyboard navigation - Home', () => {
    const mockOnSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={mockOnSeek} />);
    
    const progressBar = screen.getByRole('slider');
    progressBar.focus();
    
    fireEvent.keyDown(progressBar, { key: 'Home' });
    
    expect(mockOnSeek).toHaveBeenCalledWith(0);
  });

  it('should handle keyboard navigation - End', () => {
    const mockOnSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={mockOnSeek} />);
    
    const progressBar = screen.getByRole('slider');
    progressBar.focus();
    
    fireEvent.keyDown(progressBar, { key: 'End' });
    
    expect(mockOnSeek).toHaveBeenCalledWith(180000);
  });

  it('should render with different durations', () => {
    const { rerender } = render(<ProgressBar {...defaultProps} />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveAttribute('aria-valuemax', '180000');
    
    // Testar com diferentes valores para verificar renderização
    rerender(<ProgressBar progress={75000} duration={300000} onSeek={vi.fn()} />);
    
    expect(progressBar).toHaveAttribute('aria-valuemax', '300000');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75000');
  });

  it('should handle decimal values', () => {
    render(<ProgressBar progress={33333} duration={100000} onSeek={vi.fn()} />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveAttribute('aria-valuenow', '33333');
    
    const progressFill = progressBar.querySelector('[style*="width"]');
    expect(progressFill).toHaveStyle('width: 33.333%');
  });

  it('should maintain proper structure', () => {
    render(<ProgressBar {...defaultProps} />);

    const progressBar = screen.getByRole('slider');
    expect(progressBar).toBeInTheDocument();

    // Verificar se tem a estrutura básica esperada
    expect(progressBar).toHaveClass('h-1', 'bg-gray-600', 'rounded-full', 'cursor-pointer');
  });

  it('should render with custom aria-label', () => {
    render(<ProgressBar {...defaultProps} aria-label="Custom progress label" />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveAttribute('aria-label', 'Custom progress label');
  });

  it('should not call onSeek when duration is zero', () => {
    const mockOnSeek = vi.fn();
    render(<ProgressBar progress={0} duration={0} onSeek={mockOnSeek} />);
    
    const progressBar = screen.getByRole('slider');
    fireEvent.click(progressBar);
    
    expect(mockOnSeek).not.toHaveBeenCalled();
  });
});