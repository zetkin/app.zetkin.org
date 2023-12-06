import { ZetkinPersonImportOp } from './prepareImportOperations';
import { ColumnKind, Sheet } from './types';

export default function createPreviewData(
  configuredSheet: Sheet,
  personIndex: number
) {
  const personPreviewOp: Partial<ZetkinPersonImportOp> = {};
  const row = configuredSheet.rows[personIndex].data;

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      //ID column and fields
      if (
        column.kind === ColumnKind.ID_FIELD ||
        column.kind === ColumnKind.FIELD
      ) {
        const fieldKey =
          column.kind === ColumnKind.ID_FIELD ? column.idField : column.field;

        if (row[colIdx]) {
          personPreviewOp.data = {
            ...personPreviewOp.data,
            [`${fieldKey}`]: row[colIdx],
          };
        }
      }
      //tags
      if (column.kind === ColumnKind.TAG) {
        column.mapping.forEach((mappedColumn) => {
          if (
            (!mappedColumn.value && !row[colIdx]) ||
            mappedColumn.value === row[colIdx]
          ) {
            if (!personPreviewOp.tags) {
              personPreviewOp.tags = [];
            }
            personPreviewOp.tags = [
              ...new Set(personPreviewOp.tags.concat(mappedColumn.tagIds)),
            ];
          }
        });
      }
      //orgs
      if (column.kind === ColumnKind.ORGANIZATION) {
        column.mapping.forEach((mappedColumn) => {
          if (mappedColumn.value === row[colIdx]) {
            personPreviewOp.organizations = [mappedColumn?.orgId as number];
          }
        });
      }
    }
  });

  return personPreviewOp;
}
