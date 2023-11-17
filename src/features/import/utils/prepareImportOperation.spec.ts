import { CellData, ColumnKind, Sheet } from './types';
import { describe, it } from '@jest/globals';

type OpsType = {
  fields: Record<string, CellData>;
  op: 'person.import';
};
type ImportOpsObj = {
  ops: OpsType[];
};

function prepareImportOperations(configData: Sheet): ImportOpsObj {
  const result: ImportOpsObj = { ops: [] };

  configData.columns.forEach((column, colIdx) => {
    if (column.selected) {
      configData.rows.forEach((row, rowIdx) => {
        if (configData.firstRowIsHeaders && rowIdx === 0) {
          return;
        }
        if (column.kind === ColumnKind.ID_FIELD) {
          result.ops.push({
            fields: {
              [`${column.idField}`]: row.data[colIdx],
            },
            op: 'person.import',
          });
        } else if (column.kind === ColumnKind.FIELD) {
          if (result.ops.length > 0) {
            result.ops[rowIdx - 1]['fields'][`${column.field}`] =
              row.data[colIdx];
          }
        }
      });

      // else if (column.kind === ColumnKind.FIELD) {
      //   if (result.ops.length > 0) {
      //     console.log(result.ops[personIdx], ' what');
      //     // result.ops[personIdx].fields[`${column.field}`] =
      //     //   configData.rows[colIdx + 1].data[colIdx];
      //     // result.ops[personIdx].fields[`${column.field}`] =
      //     //   configData.rows[colIdx + 1].data[colIdx];
      //     // result.ops[personIdx].fields.op = 'person.import';
      //   }
      // }
      // personIdx++;
      // if (item.kind === ColumnKind.ID_FIELD) {
      //   result.ops.push({
      //     fields: {
      //       [`${item.idField}`]: configData.rows[index + 1].data[index],
      //     },
      //     op: 'person.import',
      //   });
      // } else if (item.kind === ColumnKind.FIELD) {
      //   result.ops[index]?.fields[`${item.field}`] =
      //     configData.rows[index + 1].data[index];
      // }
    }
  });

  console.log(result.ops[0].fields, ' result');
  return result;
}

describe('prepareImportOperations', () => {
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
          data: ['ID', 'First name', 'Last Name', 'DevTag'],
        },
        {
          data: ['123', 'Jane', 'Doe', 'DevTag'],
        },
        {
          data: ['124', 'John', 'Doe', 'DevTag'],
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
  //   it('skips first row if first row is header', () => {});
});
