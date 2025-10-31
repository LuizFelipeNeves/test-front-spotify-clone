import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  const defaultProps = {
    progress: 30000, // 30 seconds
    duration: 180000, // 3 minutes
    onSeek: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<ProgressBar {...defaultProps} />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-label', 'Progresso da música');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '180000');
    expect(progressBar).toHaveAttribute('aria-valuenow', '30000');
  });

  it('renders with custom aria-label', () => {
    render(<ProgressBar {...defaultProps} aria-label="Custom progress label" />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveAttribute('aria-label', 'Custom progress label');
  });

  it('applies custom className', () => {
    render(<ProgressBar {...defaultProps} className="custom-progress-class" />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveClass('custom-progress-class');
  });

  it('calculates progress percentage correctly', () => {
    const { container } = render(<ProgressBar {...defaultProps} />);
    
    const progressFill = container.querySelector('.bg-white');
    expect(progressFill).toHaveStyle({ width: '16.666666666666664%' }); // 30000/180000 * 100
  });

  it('handles click to seek', () => {
    const onSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={onSeek} />);
    
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

    fireEvent.click(progressBar, { clientX: 50 }); // Click at 50% position
    
    expect(onSeek).toHaveBeenCalledWith(90000); // 50% of 180000
  });

  it('handles keyboard navigation - ArrowRight', () => {
    const onSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={onSeek} />);
    
    const progressBar = screen.getByRole('slider');
    progressBar.focus();
    
    fireEvent.keyDown(progressBar, { key: 'ArrowRight' });
    
    expect(onSeek).toHaveBeenCalledWith(39000); // 30000 + 5% of 180000 (9000)
  });

  it('handles keyboard navigation - ArrowLeft', () => {
    const onSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={onSeek} />);
    
    const progressBar = screen.getByRole('slider');
    progressBar.focus();
    
    fireEvent.keyDown(progressBar, { key: 'ArrowLeft' });
    
    expect(onSeek).toHaveBeenCalledWith(21000); // 30000 - 5% of 180000 (9000)
  });

  it('handles keyboard navigation - Home', () => {
    const onSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={onSeek} />);
    
    const progressBar = screen.getByRole('slider');
    progressBar.focus();
    
    fireEvent.keyDown(progressBar, { key: 'Home' });
    
    expect(onSeek).toHaveBeenCalledWith(0);
  });

  it('handles keyboard navigation - End', () => {
    const onSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={onSeek} />);
    
    const progressBar = screen.getByRole('slider');
    progressBar.focus();
    
    fireEvent.keyDown(progressBar, { key: 'End' });
    
    expect(onSeek).toHaveBeenCalledWith(180000);
  });

  it('prevents seeking beyond boundaries with keyboard', () => {
    const onSeek = vi.fn();
    render(<ProgressBar {...defaultProps} progress={0} onSeek={onSeek} />);
    
    const progressBar = screen.getByRole('slider');
    progressBar.focus();
    
    fireEvent.keyDown(progressBar, { key: 'ArrowLeft' });
    
    expect(onSeek).toHaveBeenCalledWith(0); // Should not go below 0
  });

  it('prevents seeking beyond duration with keyboard', () => {
    const onSeek = vi.fn();
    render(<ProgressBar {...defaultProps} progress={180000} onSeek={onSeek} />);
    
    const progressBar = screen.getByRole('slider');
    progressBar.focus();
    
    fireEvent.keyDown(progressBar, { key: 'ArrowRight' });
    
    expect(onSeek).toHaveBeenCalledWith(180000); // Should not go above duration
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    render(<ProgressBar {...defaultProps} />);
    
    const progressBar = screen.getByRole('slider');
    
    await user.tab();
    expect(progressBar).toHaveFocus();
    
    await user.tab();
    expect(progressBar).not.toHaveFocus();
  });

  it('handles mouse down and drag', () => {
    const onSeek = vi.fn();
    render(<ProgressBar {...defaultProps} onSeek={onSeek} />);
    
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

    fireEvent.mouseDown(progressBar, { clientX: 25 }); // Start drag at 25% position
    
    // Simulate mouse move
    fireEvent(document, new MouseEvent('mousemove', { clientX: 75 }));
    
    // Simulate mouse up
    fireEvent(document, new MouseEvent('mouseup'));
    
    expect(onSeek).toHaveBeenCalled();
  });

  it('updates local progress when progress prop changes and not dragging', () => {
    const { rerender } = render(<ProgressBar {...defaultProps} />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveAttribute('aria-valuenow', '30000');
    
    rerender(<ProgressBar {...defaultProps} progress={60000} />);
    expect(progressBar).toHaveAttribute('aria-valuenow', '60000');
  });

  it('does not call onSeek when clicking without duration', () => {
    const onSeek = vi.fn();
    render(<ProgressBar {...defaultProps} duration={0} onSeek={onSeek} />);
    
    const progressBar = screen.getByRole('slider');
    fireEvent.click(progressBar);
    
    expect(onSeek).not.toHaveBeenCalled();
  });

  it('handles zero duration gracefully', () => {
    render(<ProgressBar {...defaultProps} duration={0} />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveAttribute('aria-valuemax', '0');
    
    const { container } = render(<ProgressBar {...defaultProps} duration={0} />);
    const progressFill = container.querySelector('.bg-white');
    expect(progressFill).toHaveStyle({ width: '0%' });
  });

  it('formats time correctly in aria-valuetext', () => {
    render(<ProgressBar {...defaultProps} />);
    
    const progressBar = screen.getByRole('slider');
    expect(progressBar).toHaveAttribute('aria-valuetext', '0:30 de 3:00');
  });

  it('shows drag handle on hover and focus', () => {
    const { container } = render(<ProgressBar {...defaultProps} />);
    
    const progressBar = screen.getByRole('slider');
    const dragHandle = container.querySelector('.w-3.h-3');
    
    // Initially hidden (opacity handled by CSS classes)
    expect(dragHandle).toBeInTheDocument();
    
    // Focus should show handle
    fireEvent.focus(progressBar);
    expect(dragHandle).toHaveClass('opacity-100');
  });

  it('prevents default behavior for handled keyboard events', () => {
    const onKeyDown = vi.fn();
    render(<ProgressBar {...defaultProps} onKeyDown={onKeyDown} />);
    
    const progressBar = screen.getByRole('slider');
    progressBar.focus();
    
    fireEvent.keyDown(progressBar, { key: 'ArrowRight' });
    
    expect(onKeyDown).toHaveBeenCalled();
    const event = onKeyDown.mock.calls[0][0];
    expect(event.isDefaultPrevented()).toBe(true);
  });
});