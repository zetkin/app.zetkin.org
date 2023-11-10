import { Column } from '../utils/types';
import messageIds from '../l10n/messageIds';
import range from 'utils/range';
import { setSelectedColumnIds } from '../store';
import { useMessages } from 'core/i18n';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useColumns() {
  const messages = useMessages(messageIds);
  const dispatch = useAppDispatch();

  const pendingFile = useAppSelector((state) => state.import.pendingFile);

  const sheet = pendingFile.sheets[pendingFile.selectedSheetIndex];
  const rows = sheet.data;

  const selectedColumnIds = sheet?.selectedColumnIds || [];

  const updateSelectedColumnIds = (columnIds: number[]) =>
    dispatch(setSelectedColumnIds(columnIds));

  const numberOfColumns = rows.length > 0 ? rows[0].data.length : 0;

  const allColumns: Column[] = [];
  range(numberOfColumns).forEach((number) =>
    allColumns.push({ data: [], id: number + 1, title: '' })
  );

  rows?.forEach((row, rowIndex) => {
    row.data.forEach((cellValue, cellIndex) => {
      const column = allColumns[cellIndex];
      if (rowIndex == 0) {
        if (sheet.firstRowIsHeaders && cellValue !== null) {
          column.title = cellValue as string;
        } else {
          column.title = messages.configuration.mapping.defaultColumnHeader({
            columnIndex: cellIndex + 1,
          });
          column.data.push(cellValue);
        }
      } else {
        column.data.push(cellValue);
      }
    });
  });

  return { allColumns, selectedColumnIds, updateSelectedColumnIds };
}
