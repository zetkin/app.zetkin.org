import { columnUpdate } from '../store';
import { useAppDispatch } from 'core/hooks';
import { CellData, Column, ColumnKind } from '../utils/types';

export const genders = ['f', 'm', 'o'] as const;
export type Gender = typeof genders[keyof typeof genders];

export default function useGenderMapping(column: Column, columnIndex: number) {
  const dispatch = useAppDispatch();

  const getSelectedGender = (value: CellData) => {
    if (column.kind == ColumnKind.GENDER) {
      const map = column.mapping.find((m) => m.value === value);
      return map?.gender ?? null;
    }
    return null;
  };

  const selectGender = (gender: Gender, value: CellData) => {
    if (column.kind !== ColumnKind.GENDER) {
      return;
    }

    // Check if there is already a map for this row value to an org ID
    const map = column.mapping.find((map) => map.value == value);
    // If no map for that value
    if (!map) {
      const newMap = { gender, value: value };
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
      // New orgId for that row value
      const updatedMap = { ...map, gender };

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
  };

  const deselectGender = (value: CellData) => {
    if (column.kind != ColumnKind.GENDER) {
      return;
    }

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
  };

  return {
    deselectGender,
    getSelectedGender,
    selectGender,
  };
}
