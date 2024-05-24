import mostSharedValue from './sortValuesByFrequency';

describe('sortValuesByFrequency()', () => {
  it('returns a string value if field is the same on each person', () => {
    const values = mostSharedValue(['Clara', 'Clara', 'Clara']);

    expect(values[0]).toBe('Clara');
  });

  it('returns a list of every value if the value on each persons field is different', () => {
    const values = mostSharedValue(['Angela', 'Huey', 'Clara']);

    expect(values).toHaveLength(3);
  });

  it('returns a list sorted in order of frequency when some values appear more than once', () => {
    const values = mostSharedValue([
      'Angela',
      'Angela',
      'Huey',
      'Clara',
      'Clara',
      'Clara',
    ]);

    expect(values).toHaveLength(3);
    expect(values[0]).toBe('Clara');
    expect(values[1]).toBe('Angela');
    expect(values[2]).toBe('Huey');
  });

  it('handles when fields have null as value', () => {
    const values = mostSharedValue(['', '', 'Kleine Alexanderstraße 28']);

    expect(values).toHaveLength(2);
    expect(values[0]).toBe('');
    expect(values[1]).toBe('Kleine Alexanderstraße 28');
  });
});
