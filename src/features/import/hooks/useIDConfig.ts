import hasWrongIDFormat from '../utils/hasWrongIDFormat';
import { IDFieldColumn } from '../utils/types';
import { useAppSelector } from 'core/hooks';

export default function useIDConfig(
  column: IDFieldColumn,
  columnIndex: number
) {
  const selectedSheetIndex = useAppSelector(
    (state) => state.import.pendingFile.selectedSheetIndex
  );
  const sheet = useAppSelector(
    (state) => state.import.pendingFile.sheets[selectedSheetIndex]
  );

  const firstRowIsHeaders = sheet.firstRowIsHeaders;
  const rows = sheet.rows;
  const cellValues = rows.map((row) => row.data[columnIndex]);

  const wrongIDFormat = hasWrongIDFormat(column, cellValues, firstRowIsHeaders);

  return { wrongIDFormat };
}
