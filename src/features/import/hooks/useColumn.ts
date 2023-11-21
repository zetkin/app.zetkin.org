import { Column } from '../utils/types';
import { updateColumn } from '../store';
import { useAppDispatch } from 'core/hooks';

export default function useColumn() {
  const dispatch = useAppDispatch();

  return (index: number, column: Column) => {
    dispatch(updateColumn([index, column]));
  };
}
