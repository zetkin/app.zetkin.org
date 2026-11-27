import { describe, expect, it } from '@jest/globals';

import createEnumChoiceKeys from './createEnumChoiceKeys';

describe('createEnumChoiceKeys()', () => {
  it('returns an empty array when there are no labels', () => {
    expect(createEnumChoiceKeys([])).toEqual([]);
  });

  it('slugifies plain labels', () => {
    expect(createEnumChoiceKeys(['Yes', 'Trade union rep'])).toEqual([
      'yes',
      'trade_union_rep',
    ]);
  });

  it('keeps digits', () => {
    expect(createEnumChoiceKeys(['Joined 2016', 'Joined 2017'])).toEqual([
      'joined_2016',
      'joined_2017',
    ]);
  });

  it('falls back when a label has no usable characters', () => {
    expect(createEnumChoiceKeys(['!!!', '日本語'])).toEqual([
      'option_1',
      'option_2',
    ]);
  });

  it('numbers the fallback by position in the list', () => {
    expect(createEnumChoiceKeys(['Yes', '???'])).toEqual(['yes', 'option_2']);
  });

  it('suffixes keys that would otherwise collide', () => {
    expect(createEnumChoiceKeys(['Yes', 'Yes!', 'Yes?'])).toEqual([
      'yes',
      'yes_2',
      'yes_3',
    ]);
  });

  it('never exceeds 40 characters', () => {
    const keys = createEnumChoiceKeys([
      'A really quite unreasonably long option label that keeps going',
      'A really quite unreasonably long option label that keeps going too',
    ]);

    keys.forEach((key) => expect(key.length).toBeLessThanOrEqual(40));
    expect(keys[0]).not.toEqual(keys[1]);
  });

  it('only ever produces valid, unique keys', () => {
    const keys = createEnumChoiceKeys([
      '2',
      'Joined 2016',
      'Cost: 100kr, or more',
      'Ålder & kön',
      '!!!',
      '日本語',
      'Yes',
      'Yes!',
    ]);

    keys.forEach((key) => expect(key).toMatch(/^[a-z][a-z0-9_]*$/));
    expect(new Set(keys).size).toEqual(keys.length);
  });
});
