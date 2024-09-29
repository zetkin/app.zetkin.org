import { useAppSelector } from 'core/hooks';
import { IDFieldColumn } from '../utils/types';

const useIdColumns = (): IDFieldColumn[] =>
  useAppSelector((state) =>
    state.import.pendingFile.sheets[
      state.import.pendingFile.selectedSheetIndex
    ].columns.filter((c) => c.kind === 'id')
  ) as IDFieldColumn[];
export default useIdColumns;
