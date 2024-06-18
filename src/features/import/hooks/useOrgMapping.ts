import { columnUpdate } from '../store';
import { useAppDispatch } from 'core/hooks';
import { CellData, Column, ColumnKind } from '../utils/types';

export default function useOrgMapping(column: Column, columnIndex: number) {
  const dispatch = useAppDispatch();

  const getSelectedOrgId = (value: CellData) => {
    if (column.kind == ColumnKind.ORGANIZATION) {
      const map = column.mapping.find((m) => m.value === value);
      return map?.orgId || null;
    }
    return null;
  };

  const selectOrg = (orgId: number, value: CellData) => {
    if (column.kind == ColumnKind.ORGANIZATION) {
      // Check if there is already a map for this row value to an org ID
      const map = column.mapping.find((map) => map.value == value);
      // If no map for that value
      if (!map) {
        const newMap = { orgId: orgId, value: value };
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
        const updatedMap = { ...map, orgId: orgId };

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

  const selectOrgs = (mapping: { orgId: number; value: CellData }[]) => {
    if (column.kind == ColumnKind.ORGANIZATION) {
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

  const deselectOrg = (value: CellData) => {
    if (column.kind == ColumnKind.ORGANIZATION) {
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

  return { deselectOrg, getSelectedOrgId, selectOrg, selectOrgs };
}
