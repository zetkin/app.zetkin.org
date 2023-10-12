import { ZetkinQuery } from 'utils/types/zetkin';
import {
  columnAdded,
  columnDeleted,
  rowAdded,
  viewQueryUpdated,
} from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinViewColumn, ZetkinViewRow } from '../components/types';

interface UseViewDataTableMutationsReturn {
  addColumn: (data: Omit<ZetkinViewColumn, 'id'>) => Promise<void>;
  addPerson: (personId: number) => Promise<void>;
  deleteColumn: (columnId: number) => Promise<void>;
  deleteContentQuery: () => Promise<void>;
  updateContentQuery: (data: Pick<ZetkinQuery, 'filter_spec'>) => Promise<void>;
}

export default function useViewDataTableMutations(
  orgId: number,
  viewId: number
): UseViewDataTableMutationsReturn {
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

  const updateContentQuery = async (data: Pick<ZetkinQuery, 'filter_spec'>) => {
    const query = await apiClient.patch<ZetkinQuery>(
      `/api/orgs/${orgId}/people/views/${viewId}/content_query`,
      data
    );
    dispatch(viewQueryUpdated([viewId, query]));
  };
  return {
    addColumn,
    addPerson,
    deleteColumn,
    deleteContentQuery,
    updateContentQuery,
  };
}
