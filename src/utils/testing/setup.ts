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

// Mock CanvasRenderingContext2D for JSDOM (used by ModalBackground)
if (typeof HTMLCanvasElement !== 'undefined') {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: function () {
      const mockMethods = [
        'fillRect',
        'clearRect',
        'getImageData',
        'putImageData',
        'drawImage',
        'beginPath',
        'closePath',
        'moveTo',
        'lineTo',
        'stroke',
        'fill',
      ];
      const ctx: any = {
        canvas: this,
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
      };
      mockMethods.forEach((m) => {
        ctx[m] = jest.fn();
      });
      return ctx as CanvasRenderingContext2D;
    },
  });
}

// Mock createImageBitmap for JSDOM (used by ModalBackground)
if (typeof global.createImageBitmap === 'undefined') {
  global.createImageBitmap = jest.fn(() =>
    Promise.resolve({
      close: jest.fn(),
      height: 0,
      width: 0,
    })
  ) as unknown as typeof createImageBitmap;
}

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
