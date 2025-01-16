import { AreaCardData } from '../types';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { areaGraphLoad, areaGraphLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useAssignmentAreaStats(
  orgId: number,
  areaAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) => state.areaAssignments.areaGraphByAssignmentId[areaAssId]
  );

  return loadListIfNecessary(stats, dispatch, {
    actionOnLoad: () => areaGraphLoad(areaAssId),
    actionOnSuccess: (data) => areaGraphLoaded([areaAssId, data]),
    loader: () =>
      apiClient.get<AreaCardData[]>(
        `/beta/orgs/${orgId}/areaassignments/${areaAssId}/areasgraph`
      ),
  });
}
