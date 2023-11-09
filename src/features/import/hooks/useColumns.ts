import messageIds from '../l10n/messageIds';
import range from 'utils/range';
import { useMessages } from 'core/i18n';
import { Column, Row } from '../utils/types';

export default function useColumns(
  firstRowIsHeaders: boolean,
  rows: Row[]
): Column[] {
  const messages = useMessages(messageIds);
  const numberOfColumns = rows.length > 0 ? rows[0].data.length : 0;

  const columns: Column[] = [];
  range(numberOfColumns).forEach((number) =>
    columns.push({ data: [], id: number + 1, title: '' })
  );

  rows?.forEach((row, rowIndex) => {
    row.data.forEach((cellValue, cellIndex) => {
      const column = columns[cellIndex];
      if (rowIndex == 0) {
        if (firstRowIsHeaders && cellValue !== null) {
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

  return columns;
}
