import { describe, expect, it } from '@jest/globals';

import compareTags from './compareTags';
import { mockAppliedTag } from 'utils/testing/mocks/mockTag';

describe('compareTags()', () => {
  it('puts any tag before null', () => {
    const result = compareTags(
      mockAppliedTag({
        id: 1,
        title: 'My tag',
      }),
      null
    );

    expect(result).toBeLessThan(0);
  });

  it('puts non-null value before null value', () => {
    const result = compareTags(
      mockAppliedTag({
        id: 1,
        title: 'My tag',
        value: 1,
      }),
      mockAppliedTag({
        id: 1,
        title: 'My tag',
        value: null,
      })
    );

    expect(result).toBeLessThan(0);
  });

  it('sorts titles alphebtically', () => {
    const result = compareTags(
      mockAppliedTag({
        id: 1,
        title: 'First tag',
        value: null,
      }),
      mockAppliedTag({
        id: 2,
        title: 'Second tag',
      })
    );

    expect(result).toBeLessThan(1);
  });

  it('sorts string values alphabetically', () => {
    const result = compareTags(
      mockAppliedTag({
        id: 1,
        title: 'My tag',
        value: 'first value',
      }),
      mockAppliedTag({
        id: 2,
        title: 'My tag',
        value: 'second value',
      })
    );

    expect(result).toBeLessThan(0);
  });

  it('sorts numbers in ascent order', () => {
    const result = compareTags(
      mockAppliedTag({
        id: 1,
        title: 'My tag',
        value: 10,
      }),
      mockAppliedTag({
        id: 2,
        title: 'My tag',
        value: 9,
      })
    );

    expect(result).toBeGreaterThan(0);
  });

  it('parses string values into numbers', () => {
    const result = compareTags(
      mockAppliedTag({
        id: 1,
        title: 'My tag',
        value: '10',
      }),
      mockAppliedTag({
        id: 2,
        title: 'My tag',
        value: '9',
      })
    );

    expect(result).toBeGreaterThan(0);
  });
});
