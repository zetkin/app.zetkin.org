import { CellData, Column, ColumnKind } from '../types';

export default function hasWrongIDFormat(
  column: Column,
  cellValues: CellData[],
  firstRowIsHeaders: boolean
) {
  if (column.kind != ColumnKind.ID_FIELD) {
    return false;
  }

  if (
    column.idField == 'email' ||
    column.idField == 'ext_id' ||
    column.idField == null
  ) {
    return false;
  }

  //idField must be "id"
  return cellValues.some((value, index) => {
    if (firstRowIsHeaders && index == 0) {
      return false;
    }

    if (!value) {
      return false;
    }
    const stringValue = value.toString();

    const parsedToNumber = Number(stringValue);
    if (isNaN(parsedToNumber)) {
      return true;
    } else {
      return false;
    }
  });
}
