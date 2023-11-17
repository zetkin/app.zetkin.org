import messageIds from '../l10n/messageIds';
import { useAppSelector } from 'core/hooks';
import { useMessages } from 'core/i18n';
import { Column, ColumnKind } from '../utils/types';

export type UIDataColumn = {
  columnValuesMessage: string;
  numRowsByUniqueValue: Record<string | number, number>;
  numberOfEmptyRows: number;
  originalColumn: Column;
  showColumnValuesMessage: boolean;
  showMappingResultMessage: boolean;
  showNeedsConfigMessage: boolean;
  title: string;
  uniqueValues: (string | number)[];
};

export default function useUIDataColumns(): UIDataColumn[] {
  const messages = useMessages(messageIds);

  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const sheet = pendingFile.sheets[pendingFile.selectedSheetIndex];
  const originalColumns = sheet.columns;
  const rows = sheet.rows;
  const firstRowIsHeaders = sheet.firstRowIsHeaders;

  const uiDataColumns = originalColumns.map((originalColumn, index) => {
    const rowsWithValues: (string | number)[] = [];
    let numberOfEmptyRows = 0;
    const cellValues = rows.map((row) => row.data[index]);

    cellValues.forEach((rowValue, index) => {
      if (index == 0 && firstRowIsHeaders) {
        return;
      }
      if (typeof rowValue === 'string' || typeof rowValue === 'number') {
        rowsWithValues.push(rowValue);
      } else {
        numberOfEmptyRows += 1;
      }
    });

    const uniqueValues = Array.from(new Set(rowsWithValues));

    let columnValuesMessage = '';

    if (numberOfEmptyRows > 0 && uniqueValues.length == 0) {
      columnValuesMessage = messages.configuration.mapping.messages.onlyEmpty({
        numEmpty: numberOfEmptyRows,
      });
    } else if (numberOfEmptyRows > 0 && uniqueValues.length == 1) {
      columnValuesMessage =
        messages.configuration.mapping.messages.oneValueAndEmpty({
          firstValue: uniqueValues[0],
          numEmpty: numberOfEmptyRows,
        });
    } else if (numberOfEmptyRows > 0 && uniqueValues.length == 2) {
      columnValuesMessage =
        messages.configuration.mapping.messages.twoValuesAndEmpty({
          firstValue: uniqueValues[0],
          numEmpty: numberOfEmptyRows,
          secondValue: uniqueValues[1],
        });
    } else if (numberOfEmptyRows > 0 && uniqueValues.length == 3) {
      columnValuesMessage =
        messages.configuration.mapping.messages.threeValuesAndEmpty({
          firstValue: uniqueValues[0],
          numEmpty: numberOfEmptyRows,
          secondValue: uniqueValues[1],
          thirdValue: uniqueValues[2],
        });
    } else if (numberOfEmptyRows > 0 && uniqueValues.length > 3) {
      columnValuesMessage =
        messages.configuration.mapping.messages.manyValuesAndEmpty({
          firstValue: uniqueValues[0],
          numEmpty: numberOfEmptyRows,
          numMoreValues: uniqueValues.length - 3,
          secondValue: uniqueValues[1],
          thirdValue: uniqueValues[2],
        });
    } else if (numberOfEmptyRows == 0 && uniqueValues.length == 1) {
      columnValuesMessage =
        messages.configuration.mapping.messages.oneValueNoEmpty({
          firstValue: uniqueValues[0],
        });
    } else if (numberOfEmptyRows == 0 && uniqueValues.length == 2) {
      columnValuesMessage =
        messages.configuration.mapping.messages.twoValuesNoEmpty({
          firstValue: uniqueValues[0],
          secondValue: uniqueValues[1],
        });
    } else if (numberOfEmptyRows == 0 && uniqueValues.length == 3) {
      columnValuesMessage =
        messages.configuration.mapping.messages.threeValuesNoEmpty({
          firstValue: uniqueValues[0],
          secondValue: uniqueValues[1],
          thirdValue: uniqueValues[2],
        });
    } else if (numberOfEmptyRows == 0 && uniqueValues.length > 3) {
      columnValuesMessage =
        messages.configuration.mapping.messages.manyValuesNoEmpty({
          firstValue: uniqueValues[0],
          numMoreValues: uniqueValues.length - 3,
          secondValue: uniqueValues[1],
          thirdValue: uniqueValues[2],
        });
    }

    const valueInFirstRow = cellValues[0];
    const title =
      firstRowIsHeaders && valueInFirstRow != null
        ? valueInFirstRow.toString()
        : messages.configuration.mapping.defaultColumnHeader({
            columnIndex: index,
          });

    const isConfigurable = [
      ColumnKind.ID_FIELD,
      ColumnKind.ORGANIZATION,
      ColumnKind.TAG,
    ].includes(originalColumn.kind);

    const needsConfig = originalColumn.selected && isConfigurable;
    const showColumnValuesMessage =
      !originalColumn.selected ||
      originalColumn.kind != ColumnKind.FIELD ||
      !needsConfig;
    const showNeedsConfigMessage = originalColumn.selected && needsConfig; //&& !mappingResults
    const showMappingResultMessage = originalColumn.selected && needsConfig; //&& mappingResults

    const numRowsByUniqueValue: Record<string | number, number> = {};
    uniqueValues.forEach((uniqueValue) => {
      numRowsByUniqueValue[uniqueValue] = cellValues.filter(
        (cellValue) => cellValue == uniqueValue
      ).length;
    });

    return {
      columnValuesMessage,
      numRowsByUniqueValue,
      numberOfEmptyRows,
      originalColumn,
      showColumnValuesMessage,
      showMappingResultMessage,
      showNeedsConfigMessage,
      title,
      uniqueValues,
    };
  });

  return uiDataColumns;
}
