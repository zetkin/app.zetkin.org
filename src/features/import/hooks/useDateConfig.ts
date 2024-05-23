import { columnUpdate } from '../store';
import { DateColumn } from '../utils/types';
import parseDate from '../utils/parseDate';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useDateConfig(column: DateColumn, columnIndex: number) {
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

  const wrongDateFormat = cellValues.some((value, index) => {
    if (index === 0 && firstRowIsHeaders) {
      return false;
    }

    if (!value) {
      return false;
    }

    if (column.dateFormat) {
      return !parseDate(value, column.dateFormat);
    }

    return false;
  });

  const updateDateFormat = (dateFormat: string) => {
    dispatch(columnUpdate([columnIndex, { ...column, dateFormat }]));
  };

  return { updateDateFormat, wrongDateFormat };
}
