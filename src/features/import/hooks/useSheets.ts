import { sheetSettingsUpdated, setSelectedSheetIndex } from '../store';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { SheetSettings } from '../types';

export default function useSheets() {
  const dispatch = useAppDispatch();
  const importSlice = useAppSelector((state) => state.import);
  const pendingFile = importSlice.pendingFile;

  const selectedSheet = pendingFile.sheets[pendingFile.selectedSheetIndex];
  const sheets = pendingFile.sheets;

  const updateSelectedSheetIndex = (newIndex: number) => {
    dispatch(setSelectedSheetIndex(newIndex));
  };

  const updateSheetSettings = (settings: Partial<SheetSettings>) => {
    dispatch(sheetSettingsUpdated(settings));
  };

  return {
    firstRowIsHeaders: selectedSheet.firstRowIsHeaders,
    selectedSheetIndex: pendingFile.selectedSheetIndex,
    sheets,
    skipUnknown: !!selectedSheet.skipUnknown,
    updateSelectedSheetIndex,
    updateSheetSettings,
  };
}
