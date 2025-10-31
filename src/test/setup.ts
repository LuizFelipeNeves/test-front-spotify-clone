import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
// @ts-expect-error - Mocking IntersectionObserver for testing
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
};

// Mock ResizeObserver
// @ts-expect-error - Mocking ResizeObserver for testing
globalThis.ResizeObserver = class ResizeObserver {
  constructor() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
// @ts-expect-error - Mocking localStorage for testing
globalThis.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
// @ts-expect-error - Mocking sessionStorage for testing
globalThis.sessionStorage = sessionStorageMock;

// Mock URL.createObjectURL
// @ts-expect-error - Mocking URL.createObjectURL for testing
globalThis.URL.createObjectURL = vi.fn();
// @ts-expect-error - Mocking URL.revokeObjectURL for testing
globalThis.URL.revokeObjectURL = vi.fn();

// Mock fetch
// @ts-expect-error - Mocking fetch for testing
globalThis.fetch = vi.fn();

// Mock console methods to reduce noise in tests
// @ts-expect-error - Mocking console for testing
globalThis.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
