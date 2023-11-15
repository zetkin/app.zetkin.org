import { setColumnSelected } from '../store';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useColumns() {
  const dispatch = useAppDispatch();

  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const columns = pendingFile.sheets[pendingFile.selectedSheetIndex].columns;

  const selectColumn = (columnId: number) => {
    dispatch(setColumnSelected(columnId));
  };

  return { columns, selectColumn };
}
