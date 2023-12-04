import { CellData, ColumnKind, Sheet } from './types';

export type ZetkinPersonImportOp = {
  data?: Record<string, CellData>;
  op: 'person.import';
  organizations?: number[];
  tags?: number[];
};

export default function prepareImportOperations(
  configuredSheet: Sheet
): ZetkinPersonImportOp[] {
  const personImportOps: ZetkinPersonImportOp[] = [];

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      configuredSheet.rows.forEach((row, rowIdx) => {
        if (configuredSheet.firstRowIsHeaders && rowIdx === 0) {
          return;
        }

        const rowIndex = configuredSheet.firstRowIsHeaders
          ? rowIdx - 1
          : rowIdx;

        if (!personImportOps[rowIndex]) {
          personImportOps.push({
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
            personImportOps[rowIndex].data = {
              ...personImportOps[rowIndex].data,
              [`${fieldKey}`]: row.data[colIdx],
            };
          }
        }

        //tags
        if (column.kind === ColumnKind.TAG) {
          column.mapping.forEach((mappedColumn) => {
            if (mappedColumn.value === row.data[colIdx]) {
              if (!personImportOps[rowIndex].tags) {
                personImportOps[rowIndex].tags = [];
              }
              personImportOps[rowIndex].tags = [
                ...new Set(
                  personImportOps[rowIndex].tags?.concat(mappedColumn.tagIds)
                ),
              ];
            }
          });
        }

        //orgs
        if (column.kind === ColumnKind.ORGANIZATION) {
          column.mapping.forEach((mappedColumn) => {
            if (mappedColumn.value === row.data[colIdx]) {
              personImportOps[rowIndex].organizations = [
                mappedColumn.orgId as number,
              ];
            }
          });
        }
      });
    }
  });
  return personImportOps;
}

export function prepareImportOperationsForRow(
  configuredSheet: Sheet,
  personIndex: number
) {
  const personImportOp: Partial<ZetkinPersonImportOp> = {};
  const row = configuredSheet.rows[personIndex].data;

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      personImportOp.op = 'person.import';
    }
    //ID column and fields
    if (
      column.kind === ColumnKind.ID_FIELD ||
      column.kind === ColumnKind.FIELD
    ) {
      const fieldKey =
        column.kind === ColumnKind.ID_FIELD ? column.idField : column.field;

      if (row[colIdx]) {
        personImportOp.data = {
          ...personImportOp.data,
          [`${fieldKey}`]: row[colIdx],
        };
      }
    }
    //tags
    if (column.kind === ColumnKind.TAG) {
      column.mapping.forEach((mappedColumn) => {
        if (mappedColumn.value === row[colIdx]) {
          if (!personImportOp.tags) {
            personImportOp.tags = [];
          }
          personImportOp.tags = [
            ...new Set(personImportOp.tags.concat(mappedColumn.tagIds)),
          ];
        }
      });
    }
    //orgs
    if (column.kind === ColumnKind.ORGANIZATION) {
      column.mapping.forEach((mappedColumn) => {
        if (mappedColumn.value === row[colIdx]) {
          personImportOp.organizations = [mappedColumn?.orgId as number];
        }
      });
    }
  });

  return personImportOp;
}
