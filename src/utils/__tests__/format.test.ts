import { describe, it, expect } from 'vitest';
import {
  formatDuration,
  formatNumber,
  formatRelativeTime,
  truncateText,
  formatArtists,
  getImageUrl,
  generateRandomColor,
} from '../format';

describe('formatDuration', () => {
  it('should format duration in milliseconds to mm:ss format', () => {
    expect(formatDuration(180000)).toBe('3:00');
    expect(formatDuration(90000)).toBe('1:30');
    expect(formatDuration(30000)).toBe('0:30');
    expect(formatDuration(3661000)).toBe('61:01');
  });

  it('should handle zero duration', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('should handle negative duration', () => {
    expect(formatDuration(-1000)).toBe('-1:-1');
  });
});

describe('formatNumber', () => {
  it('should format numbers with appropriate suffixes', () => {
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(2500000)).toBe('2.5M');
  });

  it('should handle zero and negative numbers', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(-1000)).toBe('-1000');
  });
});

describe('formatRelativeTime', () => {
  it('should format relative time correctly', () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    expect(formatRelativeTime(oneHourAgo.toISOString())).toMatch(/h atrás/);
    expect(formatRelativeTime(oneDayAgo.toISOString())).toMatch(/dias atrás/);
  });
});

describe('truncateText', () => {
  it('should truncate text when it exceeds max length', () => {
    const longText = 'This is a very long text that should be truncated';
    expect(truncateText(longText, 20)).toBe('This is a very long ...');
  });

  it('should not truncate text when it is within max length', () => {
    const shortText = 'Short text';
    expect(truncateText(shortText, 20)).toBe('Short text');
  });

  it('should handle empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });
});

describe('formatArtists', () => {
  it('should format single artist', () => {
    const artists = [{ name: 'Artist 1' }];
    expect(formatArtists(artists)).toBe('Artist 1');
  });

  it('should format multiple artists', () => {
    const artists = [{ name: 'Artist 1' }, { name: 'Artist 2' }];
    expect(formatArtists(artists)).toBe('Artist 1, Artist 2');
  });

  it('should handle empty array', () => {
    expect(formatArtists([])).toBe('');
  });
});

describe('getImageUrl', () => {
  it('should return the medium size image by default', () => {
    const images = [
      { url: 'large.jpg', height: 640, width: 640 },
      { url: 'small.jpg', height: 300, width: 300 },
    ];
    // For 2 images, medium returns the middle index (1)
    expect(getImageUrl(images)).toBe('small.jpg');
  });

  it('should return fallback when no images exist', () => {
    expect(getImageUrl([])).toBe('/placeholder-image.jpg');
  });

  it('should handle different size preferences', () => {
    const images = [
      { url: 'large.jpg', height: 640, width: 640 },
      { url: 'medium.jpg', height: 300, width: 300 },
      { url: 'small.jpg', height: 64, width: 64 },
    ];
    expect(getImageUrl(images, 'large')).toBe('large.jpg');
    expect(getImageUrl(images, 'small')).toBe('small.jpg');
    expect(getImageUrl(images, 'medium')).toBe('medium.jpg');
  });

  it('should handle single image', () => {
    const images = [{ url: 'only.jpg', height: 300, width: 300 }];
    expect(getImageUrl(images, 'large')).toBe('only.jpg');
    expect(getImageUrl(images, 'medium')).toBe('only.jpg');
    expect(getImageUrl(images, 'small')).toBe('only.jpg');
  });
});

describe('generateRandomColor', () => {
  it('should generate a valid hex color', () => {
    const color = generateRandomColor();
    expect(color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should generate different colors on multiple calls', () => {
    const color1 = generateRandomColor();
    const color2 = generateRandomColor();
    // While there's a small chance they could be the same, it's very unlikely
    expect(color1).not.toBe(color2);
  });
});
