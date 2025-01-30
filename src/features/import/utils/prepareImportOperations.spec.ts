import { CountryCode } from 'libphonenumber-js/types.cjs';
import { describe, it } from '@jest/globals';

import { organization as mockOrganization } from 'utils/testing/mocks/mockOrganization';
import prepareImportOperations from './prepareImportOperations';
import { ColumnKind, Sheet } from './types';

const countryCode = mockOrganization.country as CountryCode;

describe('prepareImportOperations()', () => {
  it('returns no ops when rows is empty', () => {
    const sheet: Sheet = {
      columns: [{ idField: 'id', kind: ColumnKind.ID_FIELD, selected: true }],
      firstRowIsHeaders: false,
      rows: [],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([]);
  });

  it('returns no ops when the only row is headers', () => {
    const sheet: Sheet = {
      columns: [{ idField: 'id', kind: ColumnKind.ID_FIELD, selected: true }],
      firstRowIsHeaders: true,
      rows: [
        {
          data: ['ID', 'First Name', 'Last Name', 'DevTag', 'Org'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([]);
  });

  it('returns person.get and person.setfields when just fields', () => {
    const sheet: Sheet = {
      columns: [
        { field: 'first_name', kind: ColumnKind.FIELD, selected: true },
        { field: 'last_name', kind: ColumnKind.FIELD, selected: true },
        { field: 'email', kind: ColumnKind.FIELD, selected: true },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['Clara', 'Zetkin', 'clara@example.com'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        op: 'person.create',
        ops: [
          {
            data: {
              email: 'clara@example.com',
              first_name: 'Clara',
              last_name: 'Zetkin',
            },
            op: 'person.setfields',
          },
        ],
      },
    ]);
  });

  it('ignores unselected columns', () => {
    const sheet: Sheet = {
      columns: [
        { field: 'first_name', kind: ColumnKind.FIELD, selected: true },
        { field: 'last_name', kind: ColumnKind.FIELD, selected: true },
        { field: 'email', kind: ColumnKind.FIELD, selected: false },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['Clara', 'Zetkin', 'clara@example.com'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        op: 'person.create',
        ops: [
          {
            data: {
              first_name: 'Clara',
              last_name: 'Zetkin',
            },
            op: 'person.setfields',
          },
        ],
      },
    ]);
  });

  it('uses person.get if there is an external ID configured', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
        { field: 'email', kind: ColumnKind.FIELD, selected: true },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'clara@example.com'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          ext_id: '123',
        },
        op: 'person.get',
        ops: [
          {
            data: {
              email: 'clara@example.com',
            },
            op: 'person.setfields',
          },
        ],
      },
    ]);
  });

  it('uses person.get if there is an ID configured', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        { field: 'email', kind: ColumnKind.FIELD, selected: true },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'clara@example.com'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [
          {
            data: {
              email: 'clara@example.com',
            },
            op: 'person.setfields',
          },
        ],
      },
    ]);
  });

  it('uses person.get and sets ext_id when both IDs are configured', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
        { field: 'email', kind: ColumnKind.FIELD, selected: true },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', '9999', 'clara@example.com'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [
          {
            data: {
              email: 'clara@example.com',
              ext_id: '9999',
            },
            op: 'person.setfields',
          },
        ],
      },
    ]);
  });

  it('parses and sets date field', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          dateFormat: 'DD/MM YYYY',
          field: 'extra_date',
          kind: ColumnKind.DATE,
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', '05/07 1857'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [
          {
            data: {
              extra_date: '1857-07-05',
            },
            op: 'person.setfields',
          },
        ],
      },
    ]);
  });

  it('parses phone numbers and normalize their format', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        { field: 'phone', kind: ColumnKind.FIELD, selected: true },
        { field: 'alt_phone', kind: ColumnKind.FIELD, selected: true },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', '070 123 45 67', '+46 704 123 123'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [
          {
            data: {
              alt_phone: '+46704123123',
              phone: '+46701234567',
            },
            op: 'person.setfields',
          },
        ],
      },
    ]);
  });

  it('maps and sets gender field', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          field: 'gender',
          kind: ColumnKind.GENDER,
          mapping: [
            { gender: 'f', value: 'woman' },
            { gender: 'm', value: 'man' },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'woman'],
        },
        {
          data: ['125', 'man'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [
          {
            data: {
              gender: 'f',
            },
            op: 'person.setfields',
          },
        ],
      },
      {
        key: {
          id: 125,
        },
        op: 'person.get',
        ops: [
          {
            data: {
              gender: 'm',
            },
            op: 'person.setfields',
          },
        ],
      },
    ]);
  });

  it('maps and sets enum field', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          field: 'extra_enum',
          kind: ColumnKind.ENUM,
          mapping: [
            { key: 'x_value', value: 'x' },
            { key: 'y_value', value: 'y' },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'x'],
        },
        {
          data: ['125', 'y'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [
          {
            data: {
              extra_enum: 'x_value',
            },
            op: 'person.setfields',
          },
        ],
      },
      {
        key: {
          id: 125,
        },
        op: 'person.get',
        ops: [
          {
            data: {
              extra_enum: 'y_value',
            },
            op: 'person.setfields',
          },
        ],
      },
    ]);
  });

  it('includes sub-ops to tag person with multiple tags from single mapping', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          kind: ColumnKind.TAG,
          mapping: [
            {
              tags: [{ id: 11 }, { id: 22 }],
              value: 'x',
            },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'x'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [
          {
            op: 'person.tag',
            tag_id: 11,
          },
          {
            op: 'person.tag',
            tag_id: 22,
          },
        ],
      },
    ]);
  });

  it('includes sub-ops to tag person with tags from multiple columns', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          kind: ColumnKind.TAG,
          mapping: [
            {
              tags: [{ id: 11 }],
              value: 'x',
            },
          ],
          selected: true,
        },
        {
          kind: ColumnKind.TAG,
          mapping: [
            {
              tags: [{ id: 22 }],
              value: 'x',
            },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'x', 'x'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [
          {
            op: 'person.tag',
            tag_id: 11,
          },
          {
            op: 'person.tag',
            tag_id: 22,
          },
        ],
      },
    ]);
  });

  it('ignores mismatching tag mappings', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          kind: ColumnKind.TAG,
          mapping: [
            {
              tags: [{ id: 11 }],
              value: 'x',
            },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'this does not match x'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [],
      },
    ]);
  });

  it('includes sub-ops to add person to org based on single mapping', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [{ orgId: 101, value: 'x' }],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'x'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [
          {
            op: 'person.addtoorg',
            org_id: 101,
          },
        ],
      },
    ]);
  });

  it('includes sub-ops to add person to org based on multiple mappings', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [{ orgId: 101, value: 'x' }],
          selected: true,
        },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [{ orgId: 202, value: 'x' }],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'x', 'x'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [
          {
            op: 'person.addtoorg',
            org_id: 101,
          },
          {
            op: 'person.addtoorg',
            org_id: 202,
          },
        ],
      },
    ]);
  });

  it('does nothing when mapping maps value to null org', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [{ orgId: null, value: 'x' }],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'x'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [],
      },
    ]);
  });

  it('ignores mismatching organiation mappings', () => {
    const sheet: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [{ orgId: 101, value: 'x' }],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'this does not match x'],
        },
      ],
      title: 'My sheet',
    };

    const ops = prepareImportOperations(sheet, countryCode);
    expect(ops).toEqual([
      {
        key: {
          id: 123,
        },
        op: 'person.get',
        ops: [],
      },
    ]);
  });
});
