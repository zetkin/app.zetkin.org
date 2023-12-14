import getUniqueTags from './getUniqueTags';

describe('getUniqueTags()', () => {
  it('returns array of unique tags when given array with duplicates', () => {
    const uniqueTags = getUniqueTags([
      { tag_id: 1 },
      { tag_id: 2 },
      { tag_id: 1 },
    ]);
    expect(uniqueTags).toEqual([{ tag_id: 1 }, { tag_id: 2 }]);
  });

  it('returns empty array if it recieves an empty array', () => {
    const uniqueTags = getUniqueTags([]);
    expect(uniqueTags).toEqual([]);
  });
});
