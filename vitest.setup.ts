import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extend expect matchers with jest-dom matchers
// This is already done by importing '@testing-library/jest-dom'

// Clean up after each test case (e.g. unmounting React trees)
afterEach(() => {
  cleanup();
});

// Mock React Router hooks
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [
      {
        get: (param: string) => {
          if (param === 'score') return '5';
          if (param === 'total') return '10';
          return null;
        }
      },
      vi.fn()
    ]
  };
});

// Set up any global mocks that are needed throughout the test suite
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

// Global any other browser APIs that might be needed
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));