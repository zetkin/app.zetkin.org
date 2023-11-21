import { CellData, ColumnKind, Sheet } from './types';

export type OpsType = {
  fields?: Record<string, CellData>;
  op: 'person.import';
  organizations?: number[];
  tags?: number[];
};
export interface ImportOpsProp {
  ops: OpsType[];
}

export function prepareImportOperations(configData: Sheet): ImportOpsProp {
  const result: ImportOpsProp = { ops: [] };

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
