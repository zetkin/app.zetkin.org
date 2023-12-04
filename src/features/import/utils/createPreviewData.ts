import { ZetkinPersonImportOp } from './prepareImportOperations';
import { ColumnKind, Sheet } from './types';

export default function createPreviewData(
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
          personImportOp.organization = [mappedColumn?.orgId as number];
        }
      });
    }
  });

  return personImportOp;
}
