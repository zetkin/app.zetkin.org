jest.mock('next/font/google', () => ({
  Figtree: () => ({
    style: {
      fontFamily: 'figtree',
    },
  }),
}));
