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
      if (!map) {
        return null;
      }
      return map.gender ?? 'unknown';
    }
    return null;
  };

  const selectGender = (gender: Gender | null, value: CellData) => {
    if (column.kind !== ColumnKind.GENDER) {
      return;
    }

    dispatch(
      columnUpdate([
        columnIndex,
        {
          ...column,
          mapping: [
            ...column.mapping.filter((m) => m.value !== value),
            { gender, value },
          ],
        },
      ])
    );
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
