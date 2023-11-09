import { setFirstRowIsHeaders, setSelectedSheetIndex } from '../store';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useSheets() {
  const dispatch = useAppDispatch();
  const importSlice = useAppSelector((state) => state.import);
  const pendingFile = importSlice.pendingFile;
  const selectedSheetIndex = importSlice.selectedSheetIndex;
  const firstRowIsHeaders = importSlice.firstRowIsHeaders;

  const selectedSheet = pendingFile.sheets[selectedSheetIndex];
  const sheets = pendingFile.sheets;

  const updateSelectedSheetIndex = (newIndex: number) => {
    dispatch(setSelectedSheetIndex(newIndex));
  };

  const updateFirstRowIsHeaders = () => dispatch(setFirstRowIsHeaders());

  return {
    firstRowIsHeaders,
    selectedSheet,
    selectedSheetIndex,
    sheets,
    updateFirstRowIsHeaders,
    updateSelectedSheetIndex,
  };
}
