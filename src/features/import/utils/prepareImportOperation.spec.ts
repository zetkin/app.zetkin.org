import { CellData, ColumnKind, Sheet } from './types';
import { describe, it } from '@jest/globals';

type OpsType = {
  fields?: Record<string, CellData>;
  op: 'person.import';
  organizations?: number[];
  tags?: number[];
};
type ImportOpsObj = {
  ops: OpsType[];
};

function prepareImportOperations(configData: Sheet): ImportOpsObj {
  const result: ImportOpsObj = { ops: [] };

  configData.columns.forEach((column, colIdx) => {
    if (column.selected) {
      configData.rows.forEach((row, rowIdx) => {
        const personIndex = configData.firstRowIsHeaders ? rowIdx - 1 : rowIdx;

        if (configData.firstRowIsHeaders && rowIdx === 0) {
          return;
        }

        //Id column
        if (column.kind === ColumnKind.ID_FIELD) {
          result.ops.push({
            fields: {
              [`${column.idField}`]: row.data[colIdx],
            },
            op: 'person.import',
          });
        }

        //fields
        if (column.kind === ColumnKind.FIELD) {
          if (!result.ops[personIndex]) {
            result.ops.push({ fields: {}, op: 'person.import' });
          }
          result.ops[personIndex].fields![column.field] = row.data[colIdx];
        }

        //tags and orgs
        if (column.kind === ColumnKind.TAG) {
          if (!result.ops[personIndex]) {
            result.ops.push({ op: 'person.import', tags: [] });
          }
          result.ops[personIndex].tags = column.mapping[personIndex].tagIds;
        }
        if (column.kind === ColumnKind.ORGANIZATION) {
          if (!result.ops[personIndex]) {
            result.ops.push({
              op: 'person.import',
              organizations: [],
            });
          }
          result.ops[personIndex].organizations =
            column.mapping[personIndex].orgIds;
        }
      });
    }
  });
  return result;
}

describe('prepareImportOperations when first row is header', () => {
  it('converts ID only', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
      ],
      firstRowIsHeaders: true,
      rows: [
        {
          data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
        },
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          fields: {
            ext_id: '123',
          },
          op: 'person.import',
        },
        {
          fields: {
            ext_id: '124',
          },
          op: 'person.import',
        },
      ],
    });
  });
  it('converts fields only', () => {
    const configData: Sheet = {
      columns: [
        { kind: ColumnKind.UNKNOWN, selected: false },
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
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
      ],
      firstRowIsHeaders: true,
      rows: [
        {
          data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
        },
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          fields: {
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
        },
        {
          fields: {
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
        },
      ],
    });
  });
  it('converts tags only', () => {
    const configData: Sheet = {
      columns: [
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
        {
          kind: ColumnKind.TAG,
          mapping: [
            { tagIds: [233, 200], value: 'Frontend' },
            { tagIds: [234, 200], value: 'Backend' },
          ],
          selected: true,
        },
        { kind: ColumnKind.UNKNOWN, selected: false },
      ],
      firstRowIsHeaders: true,
      rows: [
        {
          data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
        },
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          op: 'person.import',
          tags: [233, 200],
        },
        {
          op: 'person.import',
          tags: [234, 200],
        },
      ],
    });
  });
  it('converts simple fields with ID', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
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
        { kind: ColumnKind.UNKNOWN, selected: false },
      ],
      firstRowIsHeaders: true,
      rows: [
        {
          data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
        },
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          fields: {
            ext_id: '123',
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
        },
        {
          fields: {
            ext_id: '124',
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
        },
      ],
    });
  });
  it('converts ID, fields, tags and orgs', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
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
        {
          kind: ColumnKind.TAG,
          mapping: [
            { tagIds: [233, 200], value: 'Frontend' },
            { tagIds: [234, 200], value: 'Backend' },
          ],
          selected: true,
        },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [
            { orgIds: [272], value: 1 },
            { orgIds: [272, 100], value: 2 },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: true,
      rows: [
        {
          data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
        },
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          fields: {
            ext_id: '123',
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272],
          tags: [233, 200],
        },
        {
          fields: {
            ext_id: '124',
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272, 100],
          tags: [234, 200],
        },
      ],
    });
  });
  it('converts ID, fields and tags', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
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
        {
          kind: ColumnKind.TAG,
          mapping: [
            { tagIds: [233, 200], value: 'Frontend' },
            { tagIds: [234, 200], value: 'Backend' },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: true,
      rows: [
        {
          data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
        },
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          fields: {
            ext_id: '123',
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
          tags: [233, 200],
        },
        {
          fields: {
            ext_id: '124',
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
          tags: [234, 200],
        },
      ],
    });
  });
  it('converts other columns when ID column is not chosen', () => {
    const configData: Sheet = {
      columns: [
        { kind: ColumnKind.UNKNOWN, selected: false },
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
        {
          kind: ColumnKind.TAG,
          mapping: [
            { tagIds: [233, 200], value: 'Frontend' },
            { tagIds: [234, 200], value: 'Backend' },
          ],
          selected: true,
        },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [
            { orgIds: [272], value: 1 },
            { orgIds: [272, 100], value: 2 },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: true,
      rows: [
        {
          data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
        },
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          fields: {
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272],
          tags: [233, 200],
        },
        {
          fields: {
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272, 100],
          tags: [234, 200],
        },
      ],
    });
  });
});

describe('prepareImportOperations when first row is not header', () => {
  it('converts ID, fields, tags and orgs', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
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
        {
          kind: ColumnKind.TAG,
          mapping: [
            { tagIds: [233, 200], value: 'Frontend' },
            { tagIds: [234, 200], value: 'Backend' },
          ],
          selected: true,
        },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [
            { orgIds: [272], value: 1 },
            { orgIds: [272, 100], value: 2 },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          fields: {
            ext_id: '123',
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272],
          tags: [233, 200],
        },
        {
          fields: {
            ext_id: '124',
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272, 100],
          tags: [234, 200],
        },
      ],
    });
  });
  it('converts Id, fields and tag', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
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
        {
          kind: ColumnKind.TAG,
          mapping: [
            { tagIds: [233, 200], value: 'Frontend' },
            { tagIds: [234, 200], value: 'Backend' },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          fields: {
            ext_id: '123',
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
          tags: [233, 200],
        },
        {
          fields: {
            ext_id: '124',
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
          tags: [234, 200],
        },
      ],
    });
  });
  it('converts ID only', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          fields: {
            ext_id: '123',
          },
          op: 'person.import',
        },
        {
          fields: {
            ext_id: '124',
          },
          op: 'person.import',
        },
      ],
    });
  });
  it('converts fields only', () => {
    const configData: Sheet = {
      columns: [
        { kind: ColumnKind.UNKNOWN, selected: false },
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
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          fields: {
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
        },
        {
          fields: {
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
        },
      ],
    });
  });
  it('converts tags only', () => {
    const configData: Sheet = {
      columns: [
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
        { kind: ColumnKind.UNKNOWN, selected: false },
        {
          kind: ColumnKind.TAG,
          mapping: [
            { tagIds: [233, 200], value: 'Frontend' },
            { tagIds: [234, 200], value: 'Backend' },
          ],
          selected: true,
        },
        { kind: ColumnKind.UNKNOWN, selected: false },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          op: 'person.import',
          tags: [233, 200],
        },
        {
          op: 'person.import',
          tags: [234, 200],
        },
      ],
    });
  });
  it('converts other columns when ID column is not chosen', () => {
    const configData: Sheet = {
      columns: [
        { kind: ColumnKind.UNKNOWN, selected: false },
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
        {
          kind: ColumnKind.TAG,
          mapping: [
            { tagIds: [233, 200], value: 'Frontend' },
            { tagIds: [234, 200], value: 'Backend' },
          ],
          selected: true,
        },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [
            { orgIds: [272], value: 1 },
            { orgIds: [272, 100], value: 2 },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'Jane', 'Doe', 'Frontend', 1],
        },
        {
          data: ['124', 'John', 'Doe', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toMatchObject({
      ops: [
        {
          fields: {
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272],
          tags: [233, 200],
        },
        {
          fields: {
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272, 100],
          tags: [234, 200],
        },
      ],
    });
  });
});
