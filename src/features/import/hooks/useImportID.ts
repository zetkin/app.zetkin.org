import { importIDUpdate } from '../store';
import { ImportID } from '../utils/types';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useImportID() {
  const dispatch = useAppDispatch();
  const importID = useAppSelector((state) => state.import.importID);

  const updateImportID = (importID: ImportID) => {
    dispatch(importIDUpdate(importID));
  };

  return {
    importID,
    updateImportID,
  };
}
