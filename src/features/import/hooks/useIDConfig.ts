import { columnUpdate } from '../store';
import hasWrongIDFormat from '../utils/hasWrongIDFormat';
import { IDFieldColumn } from '../utils/types';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useIDConfig(
  column: IDFieldColumn,
  columnIndex: number
) {
  const dispatch = useAppDispatch();

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

  const updateIDField = (idField: 'ext_id' | 'id') => {
    dispatch(columnUpdate([columnIndex, { ...column, idField: idField }]));
  };

  return { updateIDField, wrongIDFormat };
}
