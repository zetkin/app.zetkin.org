import { Column } from '../utils/types';
import { updateColumn } from '../store';
import { useAppDispatch } from 'core/hooks';

export default function useColumnMutations() {
  const dispatch = useAppDispatch();

  return {
    updateColumn: (index: number, column: Column) => {
      dispatch(updateColumn([index, column]));
    },
  };
}
