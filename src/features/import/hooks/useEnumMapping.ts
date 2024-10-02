import { columnUpdate } from '../store';
import { useAppDispatch } from 'core/hooks';
import { CellData, Column, ColumnKind } from '../utils/types';
import { EnumChoice } from 'utils/types/zetkin';

export default function useEnumMapping(column: Column, columnIndex: number) {
  const dispatch = useAppDispatch();

  const getSelectedOption = (value: CellData) => {
    if (column.kind == ColumnKind.ENUM) {
      const map = column.mapping.find((m) => m.value === value);
      return map?.key || null;
    }
    return null;
  };

  const selectOption = (key: string, value: CellData) => {
    if (column.kind == ColumnKind.ENUM) {
      // Check if there is already a map for this row value to a key
      const map = column.mapping.find((map) => map.value == value);
      // If no map for that value
      if (!map) {
        const newMap = { key: key, value: value };
        dispatch(
          // Add value to mapping for the column
          columnUpdate([
            columnIndex,
            {
              ...column,
              mapping: [...column.mapping, newMap],
            },
          ])
        );
      } else {
        // If there is already a map, replace it
        // Find mappings that are not for this row value
        const filteredMapping = column.mapping.filter((m) => m.value != value);
        // New key for that row value
        const updatedMap = { ...map, key: key };

        dispatch(
          columnUpdate([
            columnIndex,
            {
              ...column,
              mapping: filteredMapping.concat(updatedMap), // Add the new mapping along side existing ones
            },
          ])
        );
      }
    }
  };

  const selectOptions = (mapping: { key: string; value: CellData }[]) => {
    if (column.kind == ColumnKind.ENUM) {
      dispatch(
        columnUpdate([
          columnIndex,
          {
            ...column,
            mapping,
          },
        ])
      );
    }
  };

  const deselectOption = (value: CellData) => {
    if (column.kind == ColumnKind.ENUM) {
      const map = column.mapping.find((map) => map.value == value);
      if (map) {
        const filteredMapping = column.mapping.filter((m) => m.value != value);

        dispatch(
          columnUpdate([
            columnIndex,
            {
              ...column,
              mapping: filteredMapping,
            },
          ])
        );
      }
    }
  };

  return {
    deselectOption,
    getSelectedOption,
    selectOption,
    selectOptions,
  };
}
