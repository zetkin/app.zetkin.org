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
