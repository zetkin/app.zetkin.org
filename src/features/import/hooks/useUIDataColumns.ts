import messageIds from '../l10n/messageIds';
import { useAppSelector } from 'core/hooks';
import { useMessages } from 'core/i18n';
import { Column, ColumnKind } from '../utils/types';

export type UIDataColumn<CType extends Column> = {
  columnIndex: number;
  mappingResultsMessage: string;
  numRowsByUniqueValue: Record<string | number, number>;
  numberOfEmptyRows: number;
  originalColumn: CType;
  showColumnValuesMessage: boolean;
  showMappingResultMessage: boolean;
  showNeedsConfigMessage: boolean;
  title: string;
  uniqueValues: (string | number)[];
  wrongIDFormat: boolean;
};

interface UseUIDataColumnsReturn {
  forwardMessageDisabled: boolean;
  numRows: number;
  uiDataColumns: UIDataColumn<Column>[];
}

export default function useUIDataColumns(): UseUIDataColumnsReturn {
  const messages = useMessages(messageIds);
  const pendingFile = useAppSelector((state) => state.import.pendingFile);

  const sheet = pendingFile.sheets[pendingFile.selectedSheetIndex];
  const originalColumns = sheet.columns;
  const rows = sheet.rows;
  const firstRowIsHeaders = sheet.firstRowIsHeaders;

  const uiDataColumns = originalColumns.map((originalColumn, index) => {
    let numberOfEmptyRows = 0;
    const cellValues = rows.map((row) => row.data[index]);
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

    const uniqueValues = Array.from(numRowsByUniqueValue.keys());

    const valueInFirstRow = cellValues[0];
    const title =
      firstRowIsHeaders && valueInFirstRow != null
        ? valueInFirstRow.toString()
        : messages.configuration.mapping.defaultColumnHeader({
            columnIndex: index + 1,
          });

    let mappingResultsMessage = '';
    if (originalColumn.kind == ColumnKind.TAG) {
      let tags: { id: number }[] = [];
      let numRows = 0;
      originalColumn.mapping.forEach((map) => {
        tags = tags.concat(map.tags);
        if (map.value) {
          numRows += numRowsByUniqueValue.get(map.value) || 0;
        }
        if (!map.value) {
          numRows += numberOfEmptyRows;
        }
      });

      mappingResultsMessage =
        messages.configuration.mapping.finishedMappingTags({
          numMappedTo: Array.from(new Set(tags)).length,
          numRows,
        });
    } else if (
      originalColumn.kind == ColumnKind.ID_FIELD &&
      originalColumn.idField
    ) {
      mappingResultsMessage = messages.configuration.mapping.finishedMappingIds(
        {
          idField: originalColumn.idField,
          numValues: firstRowIsHeaders
            ? cellValues.length - 1
            : cellValues.length,
        }
      );
    } else if (originalColumn.kind == ColumnKind.ORGANIZATION) {
      let orgs: number[] = [];
      let numPeople = 0;
      originalColumn.mapping.forEach((map) => {
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

    const valuesAreValidZetkinIDs = cellValues.every((value, index) => {
      if (firstRowIsHeaders && index == 0) {
        return true;
      }

      if (!value) {
        return false;
      }
      const stringValue = value.toString();
      const parsedToNumber = Number(stringValue);

      if (isNaN(parsedToNumber)) {
        return false;
      } else {
        return true;
      }
    });

    const wrongIDFormat =
      !valuesAreValidZetkinIDs &&
      originalColumn.kind == ColumnKind.ID_FIELD &&
      originalColumn.idField == 'id';

    const isConfigurable = [
      ColumnKind.ID_FIELD,
      ColumnKind.ORGANIZATION,
      ColumnKind.TAG,
    ].includes(originalColumn.kind);

    const needsConfig = originalColumn.selected && isConfigurable;
    const showColumnValuesMessage = !needsConfig;

    const showTagsConfigMessage =
      originalColumn.kind == ColumnKind.TAG &&
      originalColumn.mapping.length == 0;
    const showOrgConfigMessage =
      originalColumn.kind == ColumnKind.ORGANIZATION &&
      originalColumn.mapping.length == 0;
    const showIdConfigMessage =
      originalColumn.kind == ColumnKind.ID_FIELD &&
      originalColumn.idField == null;
    const showNeedsConfigMessage =
      showTagsConfigMessage ||
      showOrgConfigMessage ||
      showIdConfigMessage ||
      wrongIDFormat;
    const showMappingResultMessage = needsConfig && !showNeedsConfigMessage;

    return {
      columnIndex: index,
      mappingResultsMessage,
      numRowsByUniqueValue: Object.fromEntries(numRowsByUniqueValue.entries()),
      numberOfEmptyRows,
      originalColumn,
      showColumnValuesMessage,
      showMappingResultMessage,
      showNeedsConfigMessage,
      title,
      uniqueValues,
      wrongIDFormat,
    };
  });

  const noSelectedColumns = uiDataColumns.every(
    (uiDataColumn) => uiDataColumn.originalColumn.selected == false
  );
  const unfinishedMapping = uiDataColumns.some((uiDataColumn) => {
    if (
      //A column was selected but not what to import it as
      (uiDataColumn.originalColumn.selected &&
        uiDataColumn.originalColumn.kind == ColumnKind.UNKNOWN) ||
      //A column that needs config was selected but config was not finished
      uiDataColumn.showNeedsConfigMessage == true ||
      //A selected column is used as Zetkin IDs but the format of the cell values are wrong
      uiDataColumn.wrongIDFormat
    ) {
      return true;
    }
    return false;
  });

  const forwardMessageDisabled = noSelectedColumns || unfinishedMapping;

  const numRows = firstRowIsHeaders ? rows.length - 1 : rows.length;

  return { forwardMessageDisabled, numRows, uiDataColumns };
}
