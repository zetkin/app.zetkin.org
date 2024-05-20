import { Column, ColumnKind } from './types';

export default function hasUnfinishedMapping(column: Column) {
  if (column.kind === ColumnKind.FIELD) {
    return false;
  }

  if (column.kind === ColumnKind.UNKNOWN) {
    return column.selected;
  }

  if (column.kind === ColumnKind.ID_FIELD) {
    return column.idField === null;
  }

  if (column.kind === ColumnKind.TAG) {
    return column.mapping.length === 0;
  }

  if (column.kind === ColumnKind.DATE) {
    return column.dateFormat === null;
  }

  //Column kind must be ORGANIZATION
  return column.mapping.length === 0;
}
