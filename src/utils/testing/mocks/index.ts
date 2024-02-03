export const mockObject = <G>(object: G, overrides?: Partial<G>): G => {
  return {
    ...object,
    ...overrides,
  };
};
