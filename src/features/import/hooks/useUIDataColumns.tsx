import messageIds from '../l10n/messageIds';
import notEmpty from 'utils/notEmpty';
import { updateColumn } from '../store';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import { CellData, Column, ColumnKind } from '../utils/types';
import { Msg, useMessages } from 'core/i18n';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export type UIDataColumn = {
  assignTag: (tagId: number, value: CellData) => void;
  columnValuesMessage: string;
  deselectOrg: (value: CellData) => void;
  getAssignedTags: (value: CellData) => ZetkinTag[];
  getSelectedOrgId: (value: CellData) => number | null;
  numRowsByUniqueValue: Record<string | number, number>;
  numberOfEmptyRows: number;
  originalColumn: Column;
  renderMappingResultsMessage: () => JSX.Element | null;
  selectOrg: (orgId: number, value: CellData) => void;
  showColumnValuesMessage: boolean;
  showMappingResultMessage: boolean;
  showNeedsConfigMessage: boolean;
  title: string;
  unAssignTag: (tagId: number, value: CellData) => void;
  uniqueValues: (string | number)[];
  updateIdField: (field: 'ext_id' | 'id') => void;
  wrongIDFormat: boolean;
};

export default function useUIDataColumns(orgId: number): UIDataColumn[] {
  const messages = useMessages(messageIds);
  const dispatch = useAppDispatch();
  const tagsFuture = useTags(orgId);
  const tags = tagsFuture.data;
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
      originalColumn.mapping.length == 0;
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
        let tagIds: number[] = [];
        let numRows = 0;
        originalColumn.mapping.forEach((map) => {
          tagIds = tagIds.concat(map.tagIds);
          if (map.value) {
            numRows += numRowsByUniqueValue[map.value];
          }
          if (!map.value) {
            numRows += numberOfEmptyRows;
          }
        });

        return (
          <Msg
            id={messageIds.configuration.mapping.finishedMappingTags}
            values={{
              numMappedTo: Array.from(new Set(tagIds)).length,
              numRows,
            }}
          />
        );
      }

      if (originalColumn.kind == ColumnKind.ID_FIELD) {
        if (!originalColumn.idField) {
          return null;
        }

        return (
          <Msg
            id={messageIds.configuration.mapping.finishedMappingIds}
            values={{
              idField: originalColumn.idField,
              numValues: rowsWithValues.length + numberOfEmptyRows,
            }}
          />
        );
      }

      if (originalColumn.kind == ColumnKind.ORGANIZATION) {
        let orgs: number[] = [];
        let numPeople = 0;
        originalColumn.mapping.forEach((map) => {
          if (map.orgId) {
            orgs = orgs.concat(map.orgId);
          }
          if (map.value) {
            numPeople += numRowsByUniqueValue[map.value];
          }
          if (!map.value) {
            numPeople += numberOfEmptyRows;
          }
        });

        return (
          <Msg
            id={messageIds.configuration.mapping.finishedMappingOrganizations}
            values={{
              numMappedTo: Array.from(new Set(orgs)).length,
              numPeople,
            }}
          />
        );
      }

      return null;
    };

    const assignTag = (tagId: number, value: CellData) => {
      if (originalColumn.kind == ColumnKind.TAG && tags != null) {
        const map = originalColumn.mapping.find((map) => map.value == value);

        if (!map) {
          const newMap = { tagIds: [tagId], value: value };
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
          const updatedTagIds = map.tagIds.concat([tagId]);
          const updatedMap = { ...map, tagIds: updatedTagIds };

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

    const unAssignTag = (tagId: number, value: CellData) => {
      if (originalColumn.kind == ColumnKind.TAG) {
        const map = originalColumn.mapping.find((map) => map.value == value);
        if (map) {
          const filteredMapping = originalColumn.mapping.filter(
            (m) => m.value != value
          );
          const updatedTagIds = map.tagIds.filter((t) => t != tagId);

          if (updatedTagIds.length == 0) {
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
            const updatedMap = { ...map, tagIds: updatedTagIds };

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

    const getAssignedTags = (value: CellData): ZetkinTag[] => {
      if (originalColumn.kind == ColumnKind.TAG && tags != null) {
        const map = originalColumn.mapping.find((m) => m.value === value);
        const assignedTags = map?.tagIds
          .map((tagId) => tags.find((tag) => tag.id == tagId))
          .filter(notEmpty);
        return assignedTags || [];
      }
      return [];
    };

    const updateIdField = (idField: 'ext_id' | 'id') => {
      if (originalColumn.kind == ColumnKind.ID_FIELD) {
        dispatch(
          updateColumn([index, { ...originalColumn, idField: idField }])
        );
      }
    };

    const valuesAreValidZetkinIDs = cellValues.every((value, index) => {
      if (index == 0 && firstRowIsHeaders) {
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

    const getSelectedOrgId = (value: CellData) => {
      if (originalColumn.kind == ColumnKind.ORGANIZATION) {
        const map = originalColumn.mapping.find((m) => m.value === value);
        return map?.orgId || null;
      }
      return null;
    };

    const selectOrg = (orgId: number, value: CellData) => {
      if (originalColumn.kind == ColumnKind.ORGANIZATION) {
        const map = originalColumn.mapping.find((map) => map.value == value);
        if (!map) {
          const newMap = { orgId: orgId, value: value };
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
          const updatedMap = { ...map, orgId: orgId };

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

    const deselectOrg = (value: CellData) => {
      if (originalColumn.kind == ColumnKind.ORGANIZATION) {
        const map = originalColumn.mapping.find((map) => map.value == value);
        if (map) {
          const filteredMapping = originalColumn.mapping.filter(
            (m) => m.value != value
          );

          dispatch(
            updateColumn([
              index,
              {
                ...originalColumn,
                mapping: filteredMapping,
              },
            ])
          );
        }
      }
    };

    return {
      assignTag,
      columnValuesMessage,
      deselectOrg,
      getAssignedTags,
      getSelectedOrgId,
      numRowsByUniqueValue,
      numberOfEmptyRows,
      originalColumn,
      renderMappingResultsMessage,
      selectOrg,
      showColumnValuesMessage,
      showMappingResultMessage,
      showNeedsConfigMessage,
      title,
      unAssignTag,
      uniqueValues,
      updateIdField,
      wrongIDFormat,
    };
  });

  return uiDataColumns;
}
