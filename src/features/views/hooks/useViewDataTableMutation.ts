import {
  columnAdded,
  columnDeleted,
  rowAdded,
  viewQueryUpdated,
} from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinViewColumn, ZetkinViewRow } from '../components/types';

interface UseViewDataTableMutationReturn {
  addColumn: (data: Omit<ZetkinViewColumn, 'id'>) => Promise<void>;
  addPerson: (personId: number) => Promise<void>;
  deleteColumn: (columnId: number) => Promise<void>;
  deleteContentQuery: () => Promise<void>;
}

export default function useViewDataTableMutation(
  orgId: number,
  viewId: number
): UseViewDataTableMutationReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const addColumn = async (
    data: Omit<ZetkinViewColumn, 'id'>
  ): Promise<void> => {
    const column = await apiClient.post<
      ZetkinViewColumn,
      Omit<ZetkinViewColumn, 'id'>
    >(`/api/orgs/${orgId}/people/views/${viewId}/columns`, data);

    dispatch(columnAdded([viewId, column]));
  };

  const addPerson = async (personId: number): Promise<void> => {
    const row = await apiClient.put<ZetkinViewRow>(
      `/api/orgs/${orgId}/people/views/${viewId}/rows/${personId}`
    );
    dispatch(rowAdded([viewId, row]));
  };

  const deleteColumn = async (columnId: number) => {
    await apiClient.delete(
      `/api/orgs/${orgId}/people/views/${viewId}/columns/${columnId}`
    );
    dispatch(columnDeleted([viewId, columnId]));
  };

  const deleteContentQuery = async () => {
    await apiClient.delete(
      `/api/orgs/${orgId}/people/views/${viewId}/content_query`
    );
    dispatch(viewQueryUpdated([viewId, null]));
  };
  return { addColumn, addPerson, deleteColumn, deleteContentQuery };
}
