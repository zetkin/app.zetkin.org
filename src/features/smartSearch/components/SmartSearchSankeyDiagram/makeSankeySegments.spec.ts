import { describe, expect, it } from '@jest/globals';

import makeSankeySegments from './makeSankeySegments';

describe.skip('makeSankeySegments()', () => {
  it('returns empty list for empty list', () => {
    const result = makeSankeySegments([]);
    expect(result.length).toBe(0);
  });

  it('handles empty, add, sub', () => {
    const result = makeSankeySegments([
      { matched: 0, op: 'empty', output: 0 },
      { matched: 100, op: 'add', output: 100 },
      { matched: 100, op: 'sub', output: 60 },
    ]);

    expect(result).toEqual([
      { kind: 'empty' },
      {
        kind: 'add',
        main: null,
        side: {
          offset: 0,
          style: 'fill',
          width: 1,
        },
      },
      {
        kind: 'sub',
        main: {
          offset: -0.2,
          style: 'fill',
          width: 0.6,
        },
        side: {
          offset: 0.3,
          style: 'fill',
          width: 0.4,
        },
      },
      {
        kind: 'exit',
        style: 'fill',
        width: 0.6,
      },
    ]);
  });

  it('handles non-empty entry', () => {
    const result = makeSankeySegments([
      { matched: 100, op: 'entry', output: 100 },
    ]);

    expect(result).toEqual([
      {
        kind: 'entry',
        style: 'fill',
        width: 1,
      },
      {
        kind: 'exit',
        style: 'fill',
        width: 1,
      },
    ]);
  });

  it('handles temporarily empty entry', () => {
    const result = makeSankeySegments([
      { matched: 0, op: 'entry', output: 0 },
      { matched: 100, op: 'add', output: 60 },
    ]);

    expect(result).toEqual([
      {
        kind: 'entry',
        style: 'stroke',
        width: 1,
      },
      {
        kind: 'add',
        main: {
          offset: 0,
          style: 'stroke',
          width: 1,
        },
        side: {
          offset: 0,
          style: 'fill',
          width: 1,
        },
      },
      {
        kind: 'exit',
        style: 'fill',
        width: 1,
      },
    ]);
  });

  it('handles temporarily empty input/output', () => {
    const result = makeSankeySegments([
      { matched: 0, op: 'entry', output: 400 },
      { matched: 100, op: 'add', output: 400 },
      { matched: 100, op: 'sub', output: 400 },
    ]);

    expect(result).toEqual([
      {
        kind: 'entry',
        style: 'fill',
        width: 1,
      },
      {
        kind: 'add',
        main: {
          offset: 0,
          style: 'fill',
          width: 1,
        },
        side: {
          offset: 0,
          style: 'stroke',
          width: 1,
        },
      },
      {
        kind: 'sub',
        main: {
          offset: 0,
          style: 'fill',
          width: 1,
        },
        side: {
          offset: 0,
          style: 'stroke',
          width: 1,
        },
      },
      {
        kind: 'exit',
        style: 'fill',
        width: 1,
      },
    ]);
  });
});
