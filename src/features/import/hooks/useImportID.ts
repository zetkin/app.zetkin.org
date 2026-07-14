import { importIDUpdate } from '../store';
import { ImportID } from '../types';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useImportID() {
  const dispatch = useAppDispatch();
  const importID = useAppSelector((state) => state.import.importID);

  const updateImportID = (importID: ImportID | null) => {
    dispatch(importIDUpdate(importID));
  };

  return {
    importID,
    updateImportID,
  };
}
