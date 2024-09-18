import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinCanvassSession } from '../types';
import { canvassSessionsLoad, canvassSessionsLoaded } from '../store';

export default function useCanvassSessions(
  orgId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(
    (state) => state.areas.sessionsByAssignmentId[canvassAssId]
  );

  return loadListIfNecessary(sessions, dispatch, {
    actionOnLoad: () => dispatch(canvassSessionsLoad(canvassAssId)),

    actionOnSuccess: (data) =>
      dispatch(canvassSessionsLoaded([canvassAssId, data])),
    loader: () =>
      apiClient.get<ZetkinCanvassSession[]>(
        `/beta/orgs/${orgId}/canvassassignments/${canvassAssId}/sessions`
      ),
  });
}
