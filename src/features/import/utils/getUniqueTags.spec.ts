import getUniqueTags from './getUniqueTags';

describe('getUniqueTags()', () => {
  it('returns array of unique tags when given array with duplicates', () => {
    const uniqueTags = getUniqueTags([{ id: 1 }, { id: 2 }, { id: 1 }]);
    expect(uniqueTags).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('returns empty array if it recieves an empty array', () => {
    const uniqueTags = getUniqueTags([]);
    expect(uniqueTags).toEqual([]);
  });
});
