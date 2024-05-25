import { ImportProblemKind } from './types';
import problemsFromPreview from './problemsFromPreview';
import { ImportPreview, ImportPreviewProblemCode } from '../types';

type PreviewOverrides = {
  problems?: ImportPreview['problems'];
  stats?: {
    person: {
      summary: {
        addedToOrg?: {
          byOrg?: Record<number, number>;
          total?: number;
        };
        created?: {
          total?: number;
        };
        tagged?: {
          byTag?: Record<number, number>;
          total?: number;
        };
        updated?: {
          byChangedField?: Record<string, number>;
          byInitializedField?: Record<string, number>;
          total?: number;
        };
      };
    };
  };
};

function makeFullPreview(overrides: PreviewOverrides): ImportPreview {
  return {
    problems: overrides.problems || [],
    stats: {
      person: {
        summary: {
          addedToOrg: {
            byOrg: {},
            total: 0,
            ...overrides.stats?.person.summary.addedToOrg,
          },
          created: {
            total: 0,
            ...overrides.stats?.person.summary.created,
          },
          tagged: {
            byTag: {},
            total: 0,
            ...overrides.stats?.person.summary.tagged,
          },
          updated: {
            byChangedField: {},
            byInitializedField: {},
            total: 0,
            ...overrides.stats?.person.summary.updated,
          },
        },
      },
    },
  };
}

describe('problemsFromPreview()', () => {
  it('returns empty array for valid preview', () => {
    const preview = makeFullPreview({
      stats: {
        person: {
          summary: {
            created: {
              total: 1857,
            },
          },
        },
      },
    });

    const problems = problemsFromPreview(0, preview);
    expect(problems).toHaveLength(0);
  });

  it('returns NO_IMPACT for empty preview', () => {
    const preview = makeFullPreview({});
    const problems = problemsFromPreview(0, preview);
    expect(problems).toEqual([
      {
        kind: ImportProblemKind.NO_IMPACT,
      },
    ]);
  });

  it('returns accumulated UNKNOWN_PERSON for missing Zetkin IDs', () => {
    const preview = makeFullPreview({
      problems: [
        {
          code: ImportPreviewProblemCode.UNKNOWN_OBJECT,
          field: 'data.id',
          index: 0,
          level: 'error',
        },
        {
          code: ImportPreviewProblemCode.UNKNOWN_OBJECT,
          field: 'data.id',
          index: 1,
          level: 'error',
        },
      ],
    });

    const problems = problemsFromPreview(10, preview);
    expect(problems).toEqual([
      {
        indices: [0, 1],
        kind: ImportProblemKind.UNKNOWN_PERSON,
      },
    ]);
  });

  it('returns accumulated MISSING_ID_AND_NAME for missing external IDs', () => {
    const preview = makeFullPreview({
      problems: [
        {
          code: ImportPreviewProblemCode.MISSING_ID_AND_NAME,
          index: 0,
          level: 'error',
        },
        {
          code: ImportPreviewProblemCode.MISSING_ID_AND_NAME,
          index: 2,
          level: 'error',
        },
      ],
    });

    const problems = problemsFromPreview(0, preview);
    expect(problems).toEqual([
      {
        indices: [0, 2],
        kind: ImportProblemKind.MISSING_ID_AND_NAME,
      },
    ]);
  });

  it('returns UNKNOWN_ERROR for un-implemented errors', () => {
    const preview = makeFullPreview({
      problems: [
        {
          code: 'unknown code' as ImportPreviewProblemCode,
          index: 1,
          level: 'error',
        },
      ],
    });

    const problems = problemsFromPreview(0, preview);
    expect(problems).toEqual([
      {
        indices: [1],
        kind: ImportProblemKind.UNKNOWN_ERROR,
      },
    ]);
  });

  it('ignores un-implemented warnings', () => {
    const preview = makeFullPreview({
      problems: [
        {
          code: 'unknown code' as ImportPreviewProblemCode,
          index: 0,
          level: 'warning',
        },
      ],
      stats: {
        person: { summary: { created: { total: 1 } } },
      },
    });

    const problems = problemsFromPreview(0, preview);
    expect(problems).toEqual([]);
  });

  it('warns about large amount of changes', () => {
    const preview = makeFullPreview({
      stats: {
        person: {
          summary: {
            updated: {
              byChangedField: {
                first_name: 40,
                last_name: 40,
              },
              total: 100,
            },
          },
        },
      },
    });

    const problems = problemsFromPreview(100, preview);
    expect(problems).toEqual([
      {
        field: 'first_name',
        kind: ImportProblemKind.MAJOR_CHANGE,
      },
      {
        field: 'last_name',
        kind: ImportProblemKind.MAJOR_CHANGE,
      },
    ]);
  });
});
