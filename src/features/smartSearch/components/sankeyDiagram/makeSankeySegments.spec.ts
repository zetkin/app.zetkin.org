import { describe, expect, it } from '@jest/globals';

import makeSankeySegments from './makeSankeySegments';
import { FILTER_TYPE, OPERATION } from '../types';
import { SankeySegment, SEGMENT_KIND, SEGMENT_STYLE } from './types';

describe('makeSankeySegments()', () => {
  it('returns entry and exit for empty list', () => {
    const result = makeSankeySegments([]);
    expect(result).toEqual(<SankeySegment[]>[
      {
        kind: SEGMENT_KIND.EMPTY,
      },
      {
        kind: SEGMENT_KIND.EMPTY,
      },
    ]);
  });

  it('treats non-all as empty start', () => {
    const result = makeSankeySegments([
      {
        change: 200,
        filter: {
          config: {},
          op: OPERATION.ADD,
          type: FILTER_TYPE.CALL_BLOCKED,
        },
        matches: 200,
        result: 200,
      },
    ]);

    expect(result).toEqual(<SankeySegment[]>[
      {
        kind: SEGMENT_KIND.EMPTY,
      },
      {
        kind: SEGMENT_KIND.PSEUDO_ADD,
        main: null,
        side: {
          style: SEGMENT_STYLE.FILL,
          width: 1.0,
        },
        stats: {
          change: 200,
          input: 0,
          matches: 200,
          output: 200,
        },
      },
      {
        kind: SEGMENT_KIND.EXIT,
        output: 200,
        style: SEGMENT_STYLE.FILL,
        width: 1.0,
      },
    ]);
  });

  it('treats all as non-empty entry', () => {
    const result = makeSankeySegments([
      {
        change: 200,
        filter: {
          config: {},
          op: OPERATION.ADD,
          type: FILTER_TYPE.ALL,
        },
        matches: 200,
        result: 200,
      },
    ]);

    expect(result).toEqual(<SankeySegment[]>[
      {
        kind: SEGMENT_KIND.ENTRY,
        stats: {
          change: 200,
          input: 0,
          matches: 200,
          output: 200,
        },
        style: SEGMENT_STYLE.FILL,
        width: 1,
      },
      {
        kind: SEGMENT_KIND.EXIT,
        output: 200,
        style: SEGMENT_STYLE.FILL,
        width: 1,
      },
    ]);
  });

  it('handles a sub after an entry', () => {
    const result = makeSankeySegments([
      {
        change: 200,
        filter: {
          config: {},
          op: OPERATION.ADD,
          type: FILTER_TYPE.ALL,
        },
        matches: 200,
        result: 200,
      },
      {
        change: -50,
        filter: {
          config: {},
          op: OPERATION.SUB,
          type: FILTER_TYPE.PERSON_DATA,
        },
        matches: 100,
        result: 150,
      },
    ]);

    expect(result).toEqual(<SankeySegment[]>[
      {
        kind: SEGMENT_KIND.ENTRY,
        stats: {
          change: 200,
          input: 0,
          matches: 200,
          output: 200,
        },
        style: SEGMENT_STYLE.FILL,
        width: 1,
      },
      {
        kind: SEGMENT_KIND.SUB,
        main: {
          style: SEGMENT_STYLE.FILL,
          width: 0.75,
        },
        side: {
          style: SEGMENT_STYLE.FILL,
          width: 0.25,
        },
        stats: {
          change: -50,
          input: 200,
          matches: 100,
          output: 150,
        },
      },
      {
        kind: SEGMENT_KIND.EXIT,
        output: 150,
        style: SEGMENT_STYLE.FILL,
        width: 0.75,
      },
    ]);
  });

  it('handles adding to already full stream', () => {
    const result = makeSankeySegments([
      {
        change: 100,
        filter: {
          config: {},
          op: OPERATION.ADD,
          type: FILTER_TYPE.ALL,
        },
        matches: 100,
        result: 100,
      },
      {
        change: -20,
        filter: {
          config: {},
          op: OPERATION.SUB,
          type: FILTER_TYPE.PERSON_TAGS,
        },
        matches: 20,
        result: 80,
      },
      {
        change: 0,
        filter: {
          config: {},
          op: OPERATION.ADD,
          type: FILTER_TYPE.CAMPAIGN_PARTICIPATION,
        },
        matches: 5,
        result: 80,
      },
      {
        change: 0,
        filter: {
          config: {},
          op: OPERATION.ADD,
          type: FILTER_TYPE.CALL_HISTORY,
        },
        matches: 10,
        result: 80,
      },
    ]);

    expect(result).toEqual(<SankeySegment[]>[
      {
        kind: SEGMENT_KIND.ENTRY,
        stats: {
          change: 100,
          input: 0,
          matches: 100,
          output: 100,
        },
        style: SEGMENT_STYLE.FILL,
        width: 1,
      },
      {
        kind: SEGMENT_KIND.SUB,
        main: {
          style: SEGMENT_STYLE.FILL,
          width: 0.8,
        },
        side: {
          style: SEGMENT_STYLE.FILL,
          width: 0.2,
        },
        stats: {
          change: -20,
          input: 100,
          matches: 20,
          output: 80,
        },
      },
      {
        kind: SEGMENT_KIND.PSEUDO_ADD,
        main: {
          style: SEGMENT_STYLE.FILL,
          width: 0.8,
        },
        side: {
          style: SEGMENT_STYLE.STROKE,
          width: 0.8,
        },
        stats: {
          change: 0,
          input: 80,
          matches: 5,
          output: 80,
        },
      },
      {
        kind: SEGMENT_KIND.PSEUDO_ADD,
        main: {
          style: SEGMENT_STYLE.FILL,
          width: 0.8,
        },
        side: {
          style: SEGMENT_STYLE.STROKE,
          width: 0.8,
        },
        stats: {
          change: 0,
          input: 80,
          matches: 10,
          output: 80,
        },
      },
      {
        kind: SEGMENT_KIND.EXIT,
        output: 80,
        style: SEGMENT_STYLE.FILL,
        width: 0.8,
      },
    ]);
  });

  it('handles pseudo-removing', () => {
    const result = makeSankeySegments([
      {
        change: 100,
        filter: {
          config: {},
          op: OPERATION.ADD,
          type: FILTER_TYPE.ALL,
        },
        matches: 100,
        result: 100,
      },
      {
        change: -20,
        filter: {
          config: {},
          op: OPERATION.SUB,
          type: FILTER_TYPE.PERSON_TAGS,
        },
        matches: 20,
        result: 80,
      },
      {
        change: 0,
        filter: {
          config: {},
          op: OPERATION.SUB,
          type: FILTER_TYPE.CAMPAIGN_PARTICIPATION,
        },
        matches: 5,
        result: 80,
      },
    ]);

    expect(result).toEqual(<SankeySegment[]>[
      {
        kind: SEGMENT_KIND.ENTRY,
        stats: {
          change: 100,
          input: 0,
          matches: 100,
          output: 100,
        },
        style: SEGMENT_STYLE.FILL,
        width: 1,
      },
      {
        kind: SEGMENT_KIND.SUB,
        main: {
          style: SEGMENT_STYLE.FILL,
          width: 0.8,
        },
        side: {
          style: SEGMENT_STYLE.FILL,
          width: 0.2,
        },
        stats: {
          change: -20,
          input: 100,
          matches: 20,
          output: 80,
        },
      },
      {
        kind: SEGMENT_KIND.PSEUDO_SUB,
        main: {
          style: SEGMENT_STYLE.FILL,
          width: 0.8,
        },
        side: {
          style: SEGMENT_STYLE.STROKE,
          width: 0.8,
        },
        stats: {
          change: 0,
          input: 80,
          matches: 5,
          output: 80,
        },
      },
      {
        kind: SEGMENT_KIND.EXIT,
        output: 80,
        style: SEGMENT_STYLE.FILL,
        width: 0.8,
      },
    ]);
  });

  it('handles when first filter is a sub', () => {
    const result = makeSankeySegments([
      {
        change: -100,
        filter: {
          config: {},
          op: OPERATION.SUB,
          type: FILTER_TYPE.RANDOM,
        },
        matches: 100,
        result: 0,
      },
      {
        change: 100,
        filter: {
          config: {},
          op: OPERATION.ADD,
          type: FILTER_TYPE.RANDOM,
        },
        matches: 100,
        result: 100,
      },
    ]);

    expect(result).toEqual(<SankeySegment[]>[
      {
        kind: SEGMENT_KIND.EMPTY,
      },
      {
        kind: SEGMENT_KIND.EMPTY,
      },
      {
        kind: SEGMENT_KIND.PSEUDO_ADD,
        main: null,
        side: {
          style: SEGMENT_STYLE.FILL,
          width: 1,
        },
        stats: {
          change: 100,
          input: 0,
          matches: 100,
          output: 100,
        },
      },
      {
        kind: SEGMENT_KIND.EXIT,
        output: 100,
        style: SEGMENT_STYLE.FILL,
        width: 1,
      },
    ]);
  });

  it('handles a limit like a sub', () => {
    const result = makeSankeySegments([
      {
        change: 100,
        filter: {
          config: {},
          op: OPERATION.ADD,
          type: FILTER_TYPE.ALL,
        },
        matches: 100,
        result: 100,
      },
      {
        change: -40,
        filter: {
          config: {},
          op: OPERATION.LIMIT,
          type: FILTER_TYPE.CAMPAIGN_PARTICIPATION,
        },
        matches: 40,
        result: 60,
      },
    ]);

    expect(result).toEqual(<SankeySegment[]>[
      {
        kind: SEGMENT_KIND.ENTRY,
        stats: {
          change: 100,
          input: 0,
          matches: 100,
          output: 100,
        },
        style: SEGMENT_STYLE.FILL,
        width: 1.0,
      },
      {
        kind: SEGMENT_KIND.SUB,
        main: {
          style: SEGMENT_STYLE.FILL,
          width: 0.6,
        },
        side: {
          style: SEGMENT_STYLE.FILL,
          width: 0.4,
        },
        stats: {
          change: -40,
          input: 100,
          matches: 40,
          output: 60,
        },
      },
      {
        kind: SEGMENT_KIND.EXIT,
        output: 60,
        style: SEGMENT_STYLE.FILL,
        width: 0.6,
      },
    ]);
  });

  it('imposes a minimum width of 5% to main when limited', () => {
    const result = makeSankeySegments([
      {
        change: 100,
        filter: {
          config: {},
          op: OPERATION.ADD,
          type: FILTER_TYPE.ALL,
        },
        matches: 100,
        result: 100,
      },
      {
        change: -99,
        filter: {
          config: {},
          op: OPERATION.LIMIT,
          type: FILTER_TYPE.CAMPAIGN_PARTICIPATION,
        },
        matches: 99,
        result: 1,
      },
    ]);

    expect(result).toEqual(<SankeySegment[]>[
      {
        kind: SEGMENT_KIND.ENTRY,
        stats: {
          change: 100,
          input: 0,
          matches: 100,
          output: 100,
        },
        style: SEGMENT_STYLE.FILL,
        width: 1.0,
      },
      {
        kind: SEGMENT_KIND.SUB,
        main: {
          style: SEGMENT_STYLE.FILL,
          width: 0.05,
        },
        side: {
          style: SEGMENT_STYLE.FILL,
          width: 0.95,
        },
        stats: {
          change: -99,
          input: 100,
          matches: 99,
          output: 1,
        },
      },
      {
        kind: SEGMENT_KIND.EXIT,
        output: 1,
        style: SEGMENT_STYLE.FILL,
        width: 0.05,
      },
    ]);
  });

  it('handles adding nothing to empty stream', () => {
    const result = makeSankeySegments([
      {
        change: 0,
        filter: {
          config: {
            fields: {
              first_name: 'aaaaaaaaaaa',
            },
            organizations: [1],
          },
          op: OPERATION.ADD,
          type: FILTER_TYPE.PERSON_DATA,
        },
        matches: 0,
        result: 0,
      },
      {
        change: 100,
        filter: {
          config: {
            fields: {
              first_name: 'a',
            },
            organizations: [1],
          },
          op: OPERATION.ADD,
          type: FILTER_TYPE.PERSON_DATA,
        },
        matches: 100,
        result: 100,
      },
    ]);

    expect(result).toEqual(<SankeySegment[]>[
      {
        kind: SEGMENT_KIND.EMPTY,
      },
      {
        kind: SEGMENT_KIND.PSEUDO_ADD,
        main: null,
        side: {
          style: SEGMENT_STYLE.STROKE,
          width: 0,
        },
        stats: {
          change: 0,
          input: 0,
          matches: 0,
          output: 0,
        },
      },
      {
        kind: SEGMENT_KIND.ADD,
        main: {
          style: SEGMENT_STYLE.FILL,
          width: 0.05,
        },
        side: {
          style: SEGMENT_STYLE.FILL,
          width: 0.95,
        },
        stats: {
          change: 100,
          input: 0,
          matches: 100,
          output: 100,
        },
      },
      {
        kind: SEGMENT_KIND.EXIT,
        output: 100,
        style: SEGMENT_STYLE.FILL,
        width: 1,
      },
    ]);
  });
});
