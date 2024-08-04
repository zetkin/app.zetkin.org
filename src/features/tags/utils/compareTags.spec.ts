import compareTags from './compareTags';
import { ZetkinTag } from 'utils/types/zetkin';
import { describe, expect, it } from '@jest/globals';

describe('compareTags()', () => {
  it('puts any tag before null', () => {
    const result = compareTags(
      {
        id: 1,
        title: 'My tag',
      } as ZetkinTag,
      null
    );

    expect(result).toBeLessThan(0);
  });

  it('puts non-null value before null value', () => {
    const result = compareTags(
      {
        id: 1,
        title: 'My tag',
        value: 1,
      } as ZetkinTag,
      {
        id: 1,
        title: 'My tag',
        value: undefined,
      } as ZetkinTag
    );

    expect(result).toBeLessThan(0);
  });

  it('sorts titles alphebtically', () => {
    const result = compareTags(
      {
        id: 1,
        title: 'First tag',
      } as ZetkinTag,
      {
        id: 2,
        title: 'Second tag',
      } as ZetkinTag
    );

    expect(result).toBeLessThan(1);
  });

  it('sorts string values alphabetically', () => {
    const result = compareTags(
      {
        id: 1,
        title: 'My tag',
        value: 'first value',
      } as ZetkinTag,
      {
        id: 2,
        title: 'My tag',
        value: 'second value',
      } as ZetkinTag
    );

    expect(result).toBeLessThan(0);
  });

  it('sorts numbers in ascent order', () => {
    const result = compareTags(
      {
        id: 1,
        title: 'My tag',
        value: 10,
      } as ZetkinTag,
      {
        id: 2,
        title: 'My tag',
        value: 9,
      } as ZetkinTag
    );

    expect(result).toBeGreaterThan(0);
  });

  it('parses string values into numbers', () => {
    const result = compareTags(
      {
        id: 1,
        title: 'My tag',
        value: '10',
      } as ZetkinTag,
      {
        id: 2,
        title: 'My tag',
        value: '9',
      } as ZetkinTag
    );

    expect(result).toBeGreaterThan(0);
  });
});
