import { setSelectedSheetIndex } from '../store';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useSheets() {
  const dispatch = useAppDispatch();
  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const selectedSheetIndex = useAppSelector(
    (state) => state.import.selectedSheetIndex
  );

  const selectedSheet = pendingFile.sheets[selectedSheetIndex];
  const sheets = pendingFile.sheets;

  const updateSelectedSheetIndex = (newIndex: number) => {
    dispatch(setSelectedSheetIndex(newIndex));
  };

  return {
    selectedSheet,
    selectedSheetIndex,
    sheets,
    updateSelectedSheetIndex,
  };
}
