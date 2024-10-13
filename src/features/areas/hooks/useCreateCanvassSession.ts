import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinCanvassSession, ZetkinCanvassSessionPostBody } from '../types';
import { canvassSessionCreated } from '../store';

export default function useCreateCanvassSession(
  orgId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinCanvassSessionPostBody) => {
    const created = await apiClient.post<
      ZetkinCanvassSession,
      ZetkinCanvassSessionPostBody
    >(`/beta/orgs/${orgId}/canvassassignments/${canvassAssId}/sessions`, data);
    dispatch(canvassSessionCreated(created));
  };
}
