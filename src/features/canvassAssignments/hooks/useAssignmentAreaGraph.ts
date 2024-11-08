import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { areaGraphLoad, areaGraphLoaded } from '../store';
import { GraphData } from '../types';

export default function useAssignmentAreaStats(
  orgId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) => state.canvassAssignments.areaGraphByAssignmentId[canvassAssId]
  );

  return loadListIfNecessary(stats, dispatch, {
    actionOnLoad: () => areaGraphLoad(canvassAssId),
    actionOnSuccess: (data) => areaGraphLoaded([canvassAssId, data]),
    loader: () =>
      apiClient.get<GraphData[]>(
        `/beta/orgs/${orgId}/canvassassignments/${canvassAssId}/areasgraph`
      ),
  });
}
