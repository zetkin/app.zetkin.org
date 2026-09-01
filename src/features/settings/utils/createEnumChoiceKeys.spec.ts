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

  it('transliterates accented characters', () => {
    expect(createEnumChoiceKeys(['Ålder', 'Kön', 'Über'])).toEqual([
      'alder',
      'kon',
      'uber',
    ]);
  });

  it('spells out digits instead of keeping them', () => {
    expect(createEnumChoiceKeys(['Joined 2016'])).toEqual([
      'joined_two_zero_one_six',
    ]);
  });

  it('keeps labels that differ only by digits apart', () => {
    expect(createEnumChoiceKeys(['Joined 2016', 'Joined 2017'])).toEqual([
      'joined_two_zero_one_six',
      'joined_two_zero_one_seven',
    ]);
  });

  it('gives a label consisting of a single digit a usable key', () => {
    expect(createEnumChoiceKeys(['2'])).toEqual(['two']);
  });

  it('falls back when a label has no usable characters', () => {
    expect(createEnumChoiceKeys(['!!!', '日本語'])).toEqual([
      'option_one',
      'option_two',
    ]);
  });

  it('numbers the fallback by position in the list', () => {
    expect(createEnumChoiceKeys(['Yes', '???'])).toEqual(['yes', 'option_two']);
  });

  it('suffixes keys that would otherwise collide', () => {
    expect(createEnumChoiceKeys(['Yes', 'Yes!', 'Yes?'])).toEqual([
      'yes',
      'yes_two',
      'yes_three',
    ]);
  });

  it('does not produce leading or trailing underscores', () => {
    expect(createEnumChoiceKeys([' - Maybe - '])).toEqual(['maybe']);
  });

  it('collapses runs of separators into a single underscore', () => {
    expect(createEnumChoiceKeys(['Writing / editing'])).toEqual([
      'writing_editing',
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

  it('only ever produces keys made up of a-z and _', () => {
    const keys = createEnumChoiceKeys([
      '2',
      'Joined 2016',
      'Cost: 100kr, or more',
      '1st of May',
      'Ålder & kön',
      '!!!',
      '日本語',
      'Yes',
      'Yes!',
    ]);

    keys.forEach((key) => expect(key).toMatch(/^[a-z][a-z_]*$/));
    expect(new Set(keys).size).toEqual(keys.length);
  });
});
