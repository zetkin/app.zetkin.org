import { CellData, ColumnKind, Sheet } from './types';

export type ZetkinPersonImportOp = {
  fields?: Record<string, CellData>;
  op: 'person.import';
  organizations?: number | null;
  tags?: number[];
};

export default function prepareImportOperations(
  configuredSheet: Sheet
): ZetkinPersonImportOp[] {
  const result: ZetkinPersonImportOp[] = [];

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      configuredSheet.rows.forEach((row, rowIdx) => {
        if (configuredSheet.firstRowIsHeaders && rowIdx === 0) {
          return;
        }

        const rowIndex = configuredSheet.firstRowIsHeaders
          ? rowIdx - 1
          : rowIdx;

        if (!result[rowIndex]) {
          result.push({
            op: 'person.import',
          });
        }

        //ID column and fields
        if (
          column.kind === ColumnKind.ID_FIELD ||
          column.kind === ColumnKind.FIELD
        ) {
          const fieldKey =
            column.kind === ColumnKind.ID_FIELD ? column.idField : column.field;

          if (row.data[colIdx]) {
            result[rowIndex].fields = {
              ...result[rowIndex].fields,
              [`${fieldKey}`]: row.data[colIdx],
            };
          }
        }
        //tags
        if (column.kind === ColumnKind.TAG) {
          column.mapping.forEach((mappedColumn) => {
            if (mappedColumn.value === row.data[colIdx]) {
              result[rowIndex].tags = mappedColumn.tagIds;
            }
          });
        }
        //orgs
        if (column.kind === ColumnKind.ORGANIZATION) {
          column.mapping.forEach((mappedColumn) => {
            if (mappedColumn.value === row.data[colIdx]) {
              result[rowIndex].organizations = mappedColumn.orgId;
            }
          });
        }
      });
    }
  });
  return result;
}
