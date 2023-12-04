import { ColumnKind } from '../utils/types';
import { useAppSelector } from 'core/hooks';

export default function useSelectedOptions() {
  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const columns = pendingFile.sheets[pendingFile.selectedSheetIndex].columns;

  const allSelectedColumns = columns.filter(
    (column) => column.selected && column.kind != ColumnKind.UNKNOWN
  );

  const selectedColumns = allSelectedColumns.filter(
    (column) => column.kind != ColumnKind.TAG
  );
  return (value: string) => {
    if (value == 'tag') {
      return false;
    }
    if (value == 'org') {
      return !!selectedColumns.find(
        (column) => column.kind == ColumnKind.ORGANIZATION
      );
    }
    if (value == 'id') {
      return !!allSelectedColumns.find(
        (column) => column.kind == ColumnKind.ID_FIELD
      );
    }

    const exists = selectedColumns.find((column) => {
      return column.kind == ColumnKind.FIELD && column.field == value.slice(6);
    });

    return !!exists;
  };
}
