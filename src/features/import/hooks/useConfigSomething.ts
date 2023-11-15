import { Field } from '../utils/types';
import { setCurrentlyConfiguring, setSelectedField } from '../store';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useConfigSomething() {
  const dispatch = useAppDispatch();

  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const currentlyConfiguring =
    pendingFile.sheets[pendingFile.selectedSheetIndex].currentlyConfiguring;

  const updateCurrentlyConfiguring = (columnId: number | null) => {
    dispatch(setCurrentlyConfiguring(columnId));
  };

  const updateSelectedField = (columnId: number, field: Field | undefined) =>
    dispatch(setSelectedField([columnId, field]));

  return {
    currentlyConfiguring,
    updateCurrentlyConfiguring,
    updateSelectedField,
  };
}
