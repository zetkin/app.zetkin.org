import { columnUpdate } from '../store';
import { useAppDispatch } from 'core/hooks';
import { Column, ColumnKind } from '../utils/types';

export default function useUpdateIdField(
  originalColumn: Column,
  index: number
) {
  const dispatch = useAppDispatch();

  return (idField: 'ext_id' | 'id') => {
    if (originalColumn.kind == ColumnKind.ID_FIELD) {
      dispatch(columnUpdate([index, { ...originalColumn, idField: idField }]));
    }
  };
}
