import { columnUpdate } from '../store';
import { DateColumn } from '../utils/types';
import { useAppDispatch } from 'core/hooks';

export default function useDateConfig(column: DateColumn, columnIndex: number) {
  const dispatch = useAppDispatch();

  return (dateFormat: string) => {
    dispatch(columnUpdate([columnIndex, { ...column, dateFormat }]));
  };
}
