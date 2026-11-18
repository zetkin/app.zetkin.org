import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { callsLoad, callsLoaded } from '../store';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinCall } from 'features/call/types';

export default function useCalls(orgId: number, callAssId: number) {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const calls = useAppSelector(
    (state) => state.callAssignments.callsByAssignmentId[callAssId]
  );

  return loadListIfNecessary(calls, dispatch, {
    actionOnLoad: () => callsLoad(callAssId),
    actionOnSuccess: (data) => callsLoaded([callAssId, data]),
    loader: () =>
      apiClient.get<ZetkinCall[]>(
        `/api/orgs/${orgId}/call_assignments/${callAssId}/calls`
      ),
  });
}
