import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  areasByCanvassAssignmentLoad,
  areasByCanvassAssignmentLoaded,
} from '../store';
import { ZetkinCanvassAssignmentAreaStats } from '../types';

export default function useAreasStatsByCanvassAssignment(
  orgId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const areaStats = useAppSelector(
    (state) => state.areas.areasStatsByCanvassAssignmentId[canvassAssId]
  );

  return loadListIfNecessary(areaStats, dispatch, {
    actionOnLoad: () => areasByCanvassAssignmentLoad(canvassAssId),
    actionOnSuccess: (data) =>
      areasByCanvassAssignmentLoaded([canvassAssId, data]),
    loader: () =>
      apiClient.get<ZetkinCanvassAssignmentAreaStats[]>(
        `/beta/orgs/${orgId}/canvassassignments/${canvassAssId}/areasstats`
      ),
  });
}
