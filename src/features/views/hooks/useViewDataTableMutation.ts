import { columnAdded, rowAdded } from '../store';
import { useApiClient, useAppDispatch, useEnv } from 'core/hooks';
import { ZetkinViewColumn, ZetkinViewRow } from '../components/types';

interface UseViewDataTableMutationReturn {
  addColumn: (
    viewId: number,
    data: Omit<ZetkinViewColumn, 'id'>
  ) => Promise<void>;
  addPerson: (personId: number) => Promise<void>;
}

export default function useViewDataTableMutation(
  orgId: number,
  viewId: number
): UseViewDataTableMutationReturn {
  const apiClient = useApiClient();
  const env = useEnv();
  const dispatch = useAppDispatch();

  const addColumn = async (
    viewId: number,
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
  return { addColumn, addPerson };
}
