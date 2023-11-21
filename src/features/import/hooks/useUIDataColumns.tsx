import messageIds from '../l10n/messageIds';
import { updateColumn } from '../store';
import { ZetkinTag } from 'utils/types/zetkin';
import { CellData, Column, ColumnKind } from '../utils/types';
import { Msg, useMessages } from 'core/i18n';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export type UIDataColumn = {
  assignTag: (tag: ZetkinTag, value: CellData) => void;
  columnValuesMessage: string;
  getAssignedTags: (value: CellData) => ZetkinTag[];
  numRowsByUniqueValue: Record<string | number, number>;
  numberOfEmptyRows: number;
  originalColumn: Column;
  renderMappingResultsMessage: () => JSX.Element | null;
  showColumnValuesMessage: boolean;
  showMappingResultMessage: boolean;
  showNeedsConfigMessage: boolean;
  title: string;
  unAssignTag: (tag: ZetkinTag, value: CellData) => void;
  uniqueValues: (string | number)[];
};

export default function useUIDataColumns(): UIDataColumn[] {
  const messages = useMessages(messageIds);
  const dispatch = useAppDispatch();
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
    const showColumnValuesMessage = !needsConfig;

    const showTagsConfigMessage =
      originalColumn.kind == ColumnKind.TAG &&
      originalColumn.mapping.length == 0;
    const showOrgConfigMessage =
      originalColumn.kind == ColumnKind.ORGANIZATION &&
      originalColumn.mapping.orgIds.length == 0;
    const showIdConfigMessage =
      originalColumn.kind == ColumnKind.ID_FIELD &&
      originalColumn.idField == null;
    const showNeedsConfigMessage =
      showTagsConfigMessage || showOrgConfigMessage || showIdConfigMessage;
    const showMappingResultMessage = needsConfig && !showNeedsConfigMessage;

    const numRowsByUniqueValue: Record<string | number, number> = {};
    uniqueValues.forEach((uniqueValue) => {
      numRowsByUniqueValue[uniqueValue] = cellValues.filter(
        (cellValue) => cellValue == uniqueValue
      ).length;
    });

    const renderMappingResultsMessage = () => {
      if (originalColumn.kind == ColumnKind.TAG) {
        let tags: ZetkinTag[] = [];
        let numPeople = 0;
        originalColumn.mapping.forEach((map) => {
          tags = tags.concat(map.tags);
          if (map.value) {
            numPeople += numRowsByUniqueValue[map.value];
          }
        });

        return (
          <Msg
            id={messageIds.configuration.mapping.finishedMappingTags}
            values={{
              numMappedTo: Array.from(new Set(tags)).length,
              numPeople,
            }}
          />
        );
      }
      return null;
    };

    const assignTag = (tag: ZetkinTag, value: CellData) => {
      if (originalColumn.kind == ColumnKind.TAG) {
        const map = originalColumn.mapping.find((map) => map.value == value);
        if (!map) {
          const newMap = { tags: [tag], value: value };
          dispatch(
            updateColumn([
              index,
              {
                ...originalColumn,
                mapping: [...originalColumn.mapping, newMap],
              },
            ])
          );
        } else {
          const filteredMapping = originalColumn.mapping.filter(
            (m) => m.value != value
          );
          const updatedTags = map.tags.concat(tag);
          const updatedMap = { ...map, tags: updatedTags };

          dispatch(
            updateColumn([
              index,
              {
                ...originalColumn,
                mapping: filteredMapping.concat(updatedMap),
              },
            ])
          );
        }
      }
    };

    const unAssignTag = (tag: ZetkinTag, value: CellData) => {
      if (originalColumn.kind == ColumnKind.TAG) {
        const map = originalColumn.mapping.find((map) => map.value == value);
        if (map) {
          const filteredMapping = originalColumn.mapping.filter(
            (m) => m.value != value
          );
          const updatedTags = map.tags.filter((t) => t.id != tag.id);

          if (updatedTags.length == 0) {
            dispatch(
              updateColumn([
                index,
                {
                  ...originalColumn,
                  mapping: filteredMapping,
                },
              ])
            );
          } else {
            const updatedMap = { ...map, tags: updatedTags };

            dispatch(
              updateColumn([
                index,
                {
                  ...originalColumn,
                  mapping: filteredMapping.concat(updatedMap),
                },
              ])
            );
          }
        }
      }
    };

    const getAssignedTags = (value: CellData) => {
      if (originalColumn.kind == ColumnKind.TAG) {
        const map = originalColumn.mapping.find((m) => m.value === value);
        return map?.tags || [];
      }
      return [];
    };

    return {
      assignTag,
      columnValuesMessage,
      getAssignedTags,
      numRowsByUniqueValue,
      numberOfEmptyRows,
      originalColumn,
      renderMappingResultsMessage,
      showColumnValuesMessage,
      showMappingResultMessage,
      showNeedsConfigMessage,
      title,
      unAssignTag,
      uniqueValues,
    };
  });

  return uiDataColumns;
}
