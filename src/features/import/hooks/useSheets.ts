import { ConfiguringData } from '../utils/types';
import {
  createColumns,
  setCurrentlyConfiguring,
  setFirstRowIsHeaders,
  setSelectedSheetIndex,
} from '../store';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useSheets() {
  const dispatch = useAppDispatch();
  const importSlice = useAppSelector((state) => state.import);
  const pendingFile = importSlice.pendingFile;

  const selectedSheet = pendingFile.sheets[pendingFile.selectedSheetIndex];
  const sheets = pendingFile.sheets;

  const updateSelectedSheetIndex = (newIndex: number) => {
    dispatch(setSelectedSheetIndex(newIndex));
    dispatch(createColumns());
  };

  const updateFirstRowIsHeaders = (firstRowIsHeaders: boolean) => {
    dispatch(setFirstRowIsHeaders(firstRowIsHeaders));
    dispatch(createColumns());
  };

  const updateCurrentlyConfiguing = (configuring: ConfiguringData) => {
    dispatch(setCurrentlyConfiguring(configuring));
  };

  return {
    firstRowIsHeaders: selectedSheet.firstRowIsHeaders,
    selectedSheetIndex: pendingFile.selectedSheetIndex,
    sheets,
    updateCurrentlyConfiguing,
    updateFirstRowIsHeaders,
    updateSelectedSheetIndex,
  };
}
