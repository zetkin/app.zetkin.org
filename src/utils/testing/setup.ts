jest.mock('next/font/google', () => ({
  Figtree: () => ({
    style: {
      fontFamily: 'figtree',
    },
  }),
}));

jest.mock('react-dnd-html5-backend', () => ({
  getEmptyImage: () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
}));

jest.mock('react-dnd', () => ({
  useDrag: () => [
    { isDragging: false },
    jest.fn(),
    {
      addEventListener: jest.fn(),
      captureDraggingState: jest.fn(),
      removeEventListener: jest.fn(),
    },
  ],
}));

/**
 * Polyfill for URL.createObjectURL. See https://github.com/jsdom/jsdom/issues/1721.
 *
 * Required when importing `maplibre-gl` in tests.
 */
if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = jest.fn();
}
