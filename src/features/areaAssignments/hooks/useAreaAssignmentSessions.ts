import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinAreaAssignmentSession } from '../types';
import {
  areaAssignmentSessionsLoad,
  areaAssignmentSessionsLoaded,
} from '../store';

export default function useAreaAssignmentSessions(
  orgId: number,
  areaAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(
    (state) => state.areaAssignments.sessionsByAssignmentId[areaAssId]
  );

  return loadListIfNecessary(sessions, dispatch, {
    actionOnLoad: () => dispatch(areaAssignmentSessionsLoad(areaAssId)),

    actionOnSuccess: (data) =>
      dispatch(areaAssignmentSessionsLoaded([areaAssId, data])),
    loader: () =>
      apiClient.get<ZetkinAreaAssignmentSession[]>(
        `/beta/orgs/${orgId}/areaassignments/${areaAssId}/sessions`
      ),
  });
}
