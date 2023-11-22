import { CellData, ColumnKind, Sheet } from './types';

export type OpsType = {
  fields?: Record<string, CellData>;
  op: 'person.import';
  organizations?: number | null;
  tags?: number[];
};
export interface ImportOpsProps {
  ops: OpsType[];
}

export function prepareImportOperations(
  configuredSheet: Sheet
): ImportOpsProps {
  const result: ImportOpsProps = { ops: [] };

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      configuredSheet.rows.forEach((row, rowIdx) => {
        const rowIndex = configuredSheet.firstRowIsHeaders
          ? rowIdx - 1
          : rowIdx;

        if (configuredSheet.firstRowIsHeaders && rowIdx === 0) {
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
          if (!result.ops[rowIndex]) {
            result.ops.push({ fields: {}, op: 'person.import' });
          }
          result.ops[rowIndex].fields![column.field] = row.data[colIdx];
        }

        //tags and orgs
        if (column.kind === ColumnKind.TAG) {
          if (!result.ops[rowIndex]) {
            result.ops.push({ op: 'person.import', tags: [] });
          }
          result.ops[rowIndex].tags = column.mapping[rowIndex].tagIds;
        }
        if (column.kind === ColumnKind.ORGANIZATION) {
          if (!result.ops[rowIndex]) {
            result.ops.push({
              op: 'person.import',
              organizations: null,
            });
          }
          result.ops[rowIndex].organizations = column.mapping[rowIndex].orgId;
        }
      });
    }
  });
  return result;
}
