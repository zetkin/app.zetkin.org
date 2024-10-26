import { ImportProblemKind } from './types';
import { predictProblems } from './predictProblems';
import { ColumnKind, Sheet } from '../types';
import { CUSTOM_FIELD_TYPE, ZetkinCustomField } from 'utils/types/zetkin';

function makeFullSheet(overrides: Partial<Sheet>): Sheet {
  return {
    columns: [],
    firstRowIsHeaders: false,
    rows: [],
    title: '',
    ...overrides,
  };
}

function makeFullField(
  overrides: Partial<ZetkinCustomField>
): ZetkinCustomField {
  return {
    description: '',
    id: 1001,
    org_read: 'sameorg',
    org_write: 'sameorg',
    organization: {
      id: 1,
      title: 'KPD',
    },
    slug: 'field',
    title: 'Field',
    type: CUSTOM_FIELD_TYPE.TEXT,
    ...overrides,
  };
}

const customFields: ZetkinCustomField[] = [
  makeFullField({
    slug: 'url',
    type: CUSTOM_FIELD_TYPE.URL,
  }),
  makeFullField({
    slug: 'birthday',
    type: CUSTOM_FIELD_TYPE.DATE,
  }),
  makeFullField({
    slug: 'joinDate',
    type: CUSTOM_FIELD_TYPE.DATE,
  }),
];

describe('predictProblem()', () => {
  it('returns NO_IMPACT problem for empty sheet', () => {
    const sheet: Sheet = {
      columns: [],
      firstRowIsHeaders: false,
      rows: [],
      title: '',
    };
    const problems = predictProblems(sheet, 'SE', []);

    expect(problems).toEqual([
      {
        kind: ImportProblemKind.UNCONFIGURED_ID_AND_NAME,
      },
      {
        kind: ImportProblemKind.NO_IMPACT,
      },
    ]);
  });

  it('returns NO_IMPACT when no columns are selected', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          field: 'first_name',
          kind: ColumnKind.FIELD,
          selected: false,
        },
      ],
      rows: [{ data: ['Clara'] }],
    });
    const problems = predictProblems(sheet, 'SE', []);

    expect(problems).toEqual([
      {
        kind: ImportProblemKind.UNCONFIGURED_ID_AND_NAME,
      },
      {
        kind: ImportProblemKind.NO_IMPACT,
      },
    ]);
  });

  it('finds no problems in valid sheet', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          idField: 'id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          idField: 'ext_id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          field: 'first_name',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        {
          field: 'email',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        {
          field: 'enum',
          kind: ColumnKind.ENUM,
          mapping: [
            {
              key: 'first',
              value: 'Dummy value',
            },
          ],
          selected: true,
        },
      ],
      rows: [{ data: [1, 'a', 'Clara', 'clara@example.com', 'Dummy value'] }],
    });

    const problems = predictProblems(sheet, 'SE', []);
    expect(problems).toEqual([]);
  });

  it('ignores leading/trailing space in email', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          idField: 'id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          field: 'email',
          kind: ColumnKind.FIELD,
          selected: true,
        },
      ],
      rows: [
        {
          data: [1, ' clara@example.com '],
        },
      ],
    });

    const problems = predictProblems(sheet, 'SE', []);
    expect(problems).toEqual([]);
  });

  it('ignores first row when header', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          idField: 'id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          field: 'email',
          kind: ColumnKind.FIELD,
          selected: true,
        },
      ],
      firstRowIsHeaders: true,
      rows: [
        // First row is headers and would be invalid if validated
        { data: ['ID', 'EMAIL'] },
        // Second and third rows are data that should be validated
        { data: [1, 'clara@example.com'] },
        { data: [2, 'invalid email'] },
      ],
    });

    const problems = predictProblems(sheet, 'SE', []);
    expect(problems).toEqual([
      {
        field: 'email',
        // Index should be 1 (not 2), because first first row is ignored
        indices: [1],
        kind: ImportProblemKind.INVALID_FORMAT,
      },
    ]);
  });

  it('correctly validates format for email, phone, and url', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          idField: 'id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          field: 'email',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        {
          field: 'phone',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        {
          field: 'alt_phone',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        {
          field: 'url',
          kind: ColumnKind.FIELD,
          selected: true,
        },
      ],
      rows: [
        // Valid values
        {
          data: [
            2,
            'clara@example.com',
            '+46701234567',
            '0701234567',
            'http://zetk.in',
          ],
        },
        // Invalid values
        {
          data: [1, 'clara at example.com', '1234', 'abc123', 'zetkin'],
        },
        // Empty values should be ignored by validation
        {
          data: [3, '', '', '', ''],
        },
      ],
    });

    const problems = predictProblems(sheet, 'SE', customFields);
    expect(problems).toEqual([
      {
        field: 'email',
        indices: [1],
        kind: ImportProblemKind.INVALID_FORMAT,
      },
      {
        field: 'phone',
        indices: [1],
        kind: ImportProblemKind.INVALID_FORMAT,
      },
      {
        field: 'alt_phone',
        indices: [1],
        kind: ImportProblemKind.INVALID_FORMAT,
      },
      {
        field: 'url',
        indices: [1],
        kind: ImportProblemKind.INVALID_FORMAT,
      },
    ]);
  });

  it('finds no problems for correct gender formats', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          idField: 'id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          field: 'gender',
          kind: ColumnKind.FIELD,
          selected: true,
        },
      ],
      rows: [
        { data: [1, 'f'] },
        { data: [2, 'm'] },
        { data: [3, 'o'] },
        { data: [3, ''] },
        { data: [4, null] },
      ],
    });

    const problems = predictProblems(sheet, 'SE', []);
    expect(problems).toHaveLength(0);
  });

  it('finds problem with incorrect gender formats', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          idField: 'id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          field: 'gender',
          kind: ColumnKind.FIELD,
          selected: true,
        },
      ],
      rows: [{ data: [1, 'F'] }, { data: [2, 'K'] }, { data: [3, 'whatever'] }],
    });

    const problems = predictProblems(sheet, 'SE', []);
    expect(problems).toEqual([
      {
        field: 'gender',
        indices: [0, 1, 2],
        kind: ImportProblemKind.INVALID_FORMAT,
      },
    ]);
  });

  it('aggregates related problems', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          idField: 'id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          field: 'email',
          kind: ColumnKind.FIELD,
          selected: true,
        },
      ],
      rows: [
        { data: [1, 'clara at example.com'] },
        { data: [2, 'clara@example.com'] },
        { data: [3, 'clara at example.com'] },
      ],
    });

    const problems = predictProblems(sheet, 'SE', []);
    expect(problems).toEqual([
      {
        field: 'email',
        indices: [0, 2],
        kind: ImportProblemKind.INVALID_FORMAT,
      },
    ]);
  });

  it('returns problem when ID or name are not configured', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          field: 'first_name',
          kind: ColumnKind.FIELD,
          selected: true,
        },
      ],
      rows: [{ data: ['Clara'] }],
    });

    const problems = predictProblems(sheet, 'SE', []);
    expect(problems).toEqual([
      {
        kind: ImportProblemKind.UNCONFIGURED_ID_AND_NAME,
      },
    ]);
  });

  it('returns warning when there is no ID but full name is configured', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          field: 'first_name',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        {
          field: 'last_name',
          kind: ColumnKind.FIELD,
          selected: true,
        },
      ],
      rows: [{ data: ['Clara', 'Zetkin'] }],
    });

    const problems = predictProblems(sheet, 'SE', []);
    expect(problems).toEqual([
      {
        kind: ImportProblemKind.UNCONFIGURED_ID,
      },
    ]);
  });

  it('returns no problem when ID is missing on a row that has name', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          idField: 'id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          field: 'first_name',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        {
          field: 'first_name',
          kind: ColumnKind.FIELD,
          selected: true,
        },
      ],
      rows: [{ data: [null, 'Clara', 'Zetkin'] }],
    });

    const problems = predictProblems(sheet, 'SE', []);
    expect(problems).toEqual([]);
  });

  it('returns problem when ID and name are configured but missing on a row', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          idField: 'ext_id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          field: 'first_name',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        {
          field: 'last_name',
          kind: ColumnKind.FIELD,
          selected: true,
        },
      ],
      rows: [
        { data: [null, 'Clara', null] },
        { data: [null, null, 'Zetkin'] },
        { data: ['', null, 'Zetkin'] },
      ],
    });

    const problems = predictProblems(sheet, 'SE', []);
    expect(problems).toEqual([
      {
        indices: [0, 1, 2],
        kind: ImportProblemKind.MISSING_ID_AND_NAME,
      },
    ]);
  });

  it('returns no problems when date column is configured and all cells have a value', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          idField: 'id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          dateFormat: 'se',
          field: 'birthday',
          kind: ColumnKind.DATE,
          selected: true,
        },
        {
          dateFormat: 'MMDDYY',
          field: 'joinDate',
          kind: ColumnKind.DATE,
          selected: true,
        },
      ],
      rows: [
        { data: [1, '19870314-3462', '210329'] },
        { data: [2, '041231-1473', '201213'] },
        { data: [3, '650114812', '030307'] },
      ],
    });

    const problems = predictProblems(sheet, 'SE', customFields);
    expect(problems).toEqual([]);
  });

  it('returns problem when date column is configured but some cells have invalid values', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          idField: 'id',
          kind: ColumnKind.ID_FIELD,
          selected: true,
        },
        {
          dateFormat: 'se',
          field: 'birthday',
          kind: ColumnKind.DATE,
          selected: true,
        },
        {
          dateFormat: 'MMDDYY',
          field: 'joinDate',
          kind: ColumnKind.DATE,
          selected: true,
        },
      ],
      rows: [
        { data: [1, '999', '032921'] },
        { data: [2, '041231-1473', 'no info'] },
        { data: [3, '650114812', '030307'] },
      ],
    });

    const problems = predictProblems(sheet, 'SE', customFields);
    expect(problems).toEqual([
      {
        field: 'birthday',
        indices: [0],
        kind: ImportProblemKind.INVALID_FORMAT,
      },
      {
        field: 'joinDate',
        indices: [1],
        kind: ImportProblemKind.INVALID_FORMAT,
      },
    ]);
  });

  it('Removes weird characters from phone fields', () => {
    const sheet = makeFullSheet({
      columns: [
        {
          field: 'phone',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          // Phone number contains U202C, a Unicode control character, to check that it is stripped before validating.
          data: ['+46 30777 88 68‬', 10],
        },
      ],
    });
    const result = predictProblems(sheet, 'SE', customFields);
    expect(result).toEqual([]);
  });
});
