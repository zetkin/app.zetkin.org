import hasWrongIDFormat from '../utils/hasWrongIDFormat';
import messageIds from '../l10n/messageIds';
import { useAppSelector } from 'core/hooks';
import { useMessages } from 'core/i18n';
import { Column, ColumnKind } from '../utils/types';

export type UIDataColumn<CType extends Column> = {
  columnIndex: number;
  configIsIncomplete: boolean;
  mappingResultsMessage: string;
  needsConfig: boolean;
  numRowsByUniqueValue: Record<string | number, number>;
  numberOfEmptyRows: number;
  originalColumn: CType;
  title: string;
  uniqueValues: (string | number)[];
  wrongIDFormat: boolean;
};

export default function useUIDataColumn(
  columnIndex: number
): UIDataColumn<Column> {
  const messages = useMessages(messageIds);
  const pendingFile = useAppSelector((state) => state.import.pendingFile);

  const sheet = pendingFile.sheets[pendingFile.selectedSheetIndex];
  const rows = sheet.rows;
  const firstRowIsHeaders = sheet.firstRowIsHeaders;
  const column = sheet.columns[columnIndex];

  let numberOfEmptyRows = 0;
  const cellValues = rows.map((row) => row.data[columnIndex]);
  const numRowsByUniqueValue = new Map<string | number, number>();

  cellValues.forEach((value, idx) => {
    if (firstRowIsHeaders && idx == 0) {
      return;
    }

    if (value) {
      const currentCount = numRowsByUniqueValue.get(value);
      if (!currentCount) {
        numRowsByUniqueValue.set(value, 1);
      } else {
        numRowsByUniqueValue.set(value, currentCount + 1);
      }
    } else {
      numberOfEmptyRows++;
    }
  });

  const valueInFirstRow = cellValues[0];
  const title =
    firstRowIsHeaders && valueInFirstRow != null
      ? valueInFirstRow.toString()
      : messages.configuration.mapping.defaultColumnHeader({
          columnIndex: columnIndex + 1,
        });

  let mappingResultsMessage = '';
  if (column.kind == ColumnKind.TAG) {
    let tags: { id: number }[] = [];
    let numRows = 0;
    column.mapping.forEach((map) => {
      tags = tags.concat(map.tags);
      if (map.value) {
        numRows += numRowsByUniqueValue.get(map.value) || 0;
      }
      if (!map.value) {
        numRows += numberOfEmptyRows;
      }
    });

    mappingResultsMessage = messages.configuration.mapping.finishedMappingTags({
      numMappedTo: Array.from(new Set(tags)).length,
      numRows,
    });
  } else if (column.kind == ColumnKind.ID_FIELD && column.idField) {
    mappingResultsMessage = messages.configuration.mapping.finishedMappingIds({
      idField: column.idField,
      numValues: firstRowIsHeaders ? cellValues.length - 1 : cellValues.length,
    });
  } else if (column.kind == ColumnKind.ORGANIZATION) {
    let orgs: number[] = [];
    let numPeople = 0;
    column.mapping.forEach((map) => {
      if (map.orgId) {
        orgs = orgs.concat(map.orgId);
      }
      if (map.value) {
        numPeople += numRowsByUniqueValue.get(map.value) || 0;
      }
      if (!map.value) {
        numPeople += numberOfEmptyRows;
      }
    });

    mappingResultsMessage =
      messages.configuration.mapping.finishedMappingOrganizations({
        numMappedTo: Array.from(new Set(orgs)).length,
        numPeople,
      });
  }

  const wrongIDFormat = hasWrongIDFormat(column, cellValues, firstRowIsHeaders);

  const isConfigurable = [
    ColumnKind.ID_FIELD,
    ColumnKind.ORGANIZATION,
    ColumnKind.TAG,
  ].includes(column.kind);

  const unfinishedTagConfig =
    column.kind == ColumnKind.TAG && column.mapping.length == 0;
  const unfinishedOrgConfig =
    column.kind == ColumnKind.ORGANIZATION && column.mapping.length == 0;
  const unfinishedIdConfig =
    (column.kind == ColumnKind.ID_FIELD && column.idField == null) ||
    wrongIDFormat;

  const configIsIncomplete =
    unfinishedTagConfig || unfinishedOrgConfig || unfinishedIdConfig;

  return {
    columnIndex,
    configIsIncomplete,
    mappingResultsMessage,
    needsConfig: column.selected && isConfigurable,
    numRowsByUniqueValue: Object.fromEntries(numRowsByUniqueValue.entries()),
    numberOfEmptyRows,
    originalColumn: column,
    title,
    uniqueValues: Array.from(numRowsByUniqueValue.keys()),
    wrongIDFormat,
  };
}
