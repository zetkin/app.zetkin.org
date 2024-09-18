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
  const sessions = useAppSelector((state) => state.areas.canvassSessionList);

  return loadListIfNecessary(sessions, dispatch, {
    actionOnLoad: () => dispatch(canvassSessionsLoad()),

    actionOnSuccess: (data) => dispatch(canvassSessionsLoaded(data)),
    loader: () =>
      apiClient.get<ZetkinCanvassSession[]>(
        `/beta/orgs/${orgId}/canvassassignments/${canvassAssId}/sessions`
      ),
  });
}
