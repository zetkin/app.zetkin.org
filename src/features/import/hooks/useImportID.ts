import { importIDUpdate } from '../store';
import { Column, ColumnKind, ImportID } from '../utils/types';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useImportID() {
  const dispatch = useAppDispatch();

  const importID = useAppSelector((state) => state.import.importID);

  const handleColumnDeselection = (
    column: Column,
    currentImportID: string | null,
    onChange: (newColumn: Column) => void
  ): void => {
    resetImportIDIfNeeded(column, currentImportID);

    onChange({
      ...column,
      kind: ColumnKind.UNKNOWN,
      selected: false,
    });
  };

  const isColumnCurrentImportID = (
    column: Column,
    currentImportID: string | null
  ): boolean | null => {
    return (
      column.kind == ColumnKind.ID_FIELD &&
      column.idField &&
      currentImportID == column.idField
    );
  };

  const resetImportIDIfNeeded = (
    column: Column,
    currentImportID: string | null
  ): boolean => {
    if (isColumnCurrentImportID(column, currentImportID)) {
      updateImportID(null);
      return true;
    }
    return false;
  };

  const updateImportID = (importID: ImportID) => {
    dispatch(importIDUpdate(importID));
  };

  return {
    handleColumnDeselection,
    importID,
    isColumnCurrentImportID,
    resetImportIDIfNeeded,
    updateImportID,
  };
}
