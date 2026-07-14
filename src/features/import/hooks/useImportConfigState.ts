import hasUnfinishedMapping from '../utils/hasUnfinishedMapping';
import hasWrongIDFormat from '../utils/hasWrongIDFormat';
import { useAppSelector } from 'core/hooks';

interface UseUIDataColumnsReturn {
  configIsIncomplete: boolean;
  numColumns: number;
  numRows: number;
}

export default function useImportConfigState(): UseUIDataColumnsReturn {
  const pendingFile = useAppSelector((state) => state.import.pendingFile);

  const sheet = pendingFile.sheets[pendingFile.selectedSheetIndex];
  const originalColumns = sheet.columns;
  const rows = sheet.rows;

  const firstRowIsHeaders = sheet.firstRowIsHeaders;

  let unfinishedMapping = false;

  originalColumns.forEach((originalColumn, index) => {
    const cellValues = rows.map((row) => row.data[index]);
    const wrongIDFormat = hasWrongIDFormat(
      originalColumn,
      cellValues,
      firstRowIsHeaders
    );

    if (hasUnfinishedMapping(originalColumn) || wrongIDFormat) {
      unfinishedMapping = true;
    }
  });

  const noSelectedColumns = originalColumns.every(
    (column) => column.selected == false
  );

  return {
    configIsIncomplete: noSelectedColumns || unfinishedMapping,
    numColumns: originalColumns.length,
    numRows: firstRowIsHeaders ? rows.length - 1 : rows.length,
  };
}
