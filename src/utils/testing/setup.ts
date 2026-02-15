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

// Mock ImageData for JSDOM (used by ModalBackground)
if (typeof ImageData === 'undefined') {
  global.ImageData = class ImageData {
    constructor(width: number, height: number) {
      this.data = new Uint8ClampedArray(width * height * 4);
      this.height = height;
      this.width = width;
    }

    data: Uint8ClampedArray;
    height: number;
    width: number;
  } as unknown as typeof ImageData;
}
