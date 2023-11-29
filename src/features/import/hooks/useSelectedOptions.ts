import { useAppSelector } from 'core/hooks';
import { ColumnKind, FieldColumn } from '../utils/types';

export default function useSelectedOptions() {
  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const columns = pendingFile.sheets[pendingFile.selectedSheetIndex].columns;

  const allSelectedColumns = columns.filter(
    (column) => column.selected && column.kind != ColumnKind.UNKNOWN
  );

  const selectedFieldColumns: FieldColumn[] = allSelectedColumns
    .filter((column) => column.kind == ColumnKind.FIELD)
    .map((column) => column as FieldColumn);

  return (value: string) => {
    if (value == 'org' || value == 'tag') {
      return false;
    }

    if (value == 'id') {
      return !!allSelectedColumns.find(
        (column) => column.kind == ColumnKind.ID_FIELD
      );
    }

    const exists = selectedFieldColumns.find(
      (column) => column.field == value.slice(6)
    );

    return !!exists;
  };
}
