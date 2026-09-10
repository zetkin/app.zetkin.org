import { describe, expect, it } from '@jest/globals';

import { decodeFloorShare, encodeFloorShare, FloorShare } from './floorShare';

describe('floorShare', () => {
  it('round-trips arbitrary question counts and full household names', () => {
    const share: FloorShare = {
      floor: 7,
      households: [
        {
          name: 'A-101',
          responses: ['yes', null, 'no', 'yes', 'yes'],
        },
        {
          name: 'A-102',
          responses: [null, 'no', null, 'yes', 'no'],
        },
      ],
      lastVisitedHoursAgo: [2, null],
      questions: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
      successMask: 0b10101,
    };

    const encoded = encodeFloorShare(share);
    const decoded = decodeFloorShare(encoded);

    expect(decoded).toEqual(share);
    expect(decoded?.households[0]?.name).toBe('A-101');
    expect(decoded?.households[1]?.name).toBe('A-102');
    expect(decoded?.lastVisitedHoursAgo).toEqual([2, null]);
  });

  it('supports more than four questions without truncation', () => {
    const share: FloorShare = {
      floor: 3,
      households: [
        {
          name: 'A-003',
          responses: ['yes', 'no', null, 'yes', 'no', 'yes', null, 'no'],
        },
      ],
      lastVisitedHoursAgo: [36],
      questions: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'],
      successMask: 0b10101010,
    };

    expect(decodeFloorShare(encodeFloorShare(share))).toEqual(share);
  });

  it('accepts zero-question shares without throwing', () => {
    const share: FloorShare = {
      floor: 9,
      households: [
        { name: 'Household A', responses: [] },
        { name: 'Household B', responses: [] },
      ],
      lastVisitedHoursAgo: [null, 0],
      questions: [],
      successMask: 0,
    };

    expect(decodeFloorShare(encodeFloorShare(share))).toEqual(share);
  });

  it('leaves missing household names empty', () => {
    const decoded = decodeFloorShare('7.AA...0.__8');

    expect(decoded?.households).toEqual([
      {
        name: '',
        responses: [],
      },
    ]);
  });
});
