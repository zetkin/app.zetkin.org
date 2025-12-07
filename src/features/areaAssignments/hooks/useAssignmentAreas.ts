import { useApiClient, useAppSelector } from 'core/hooks';
import { assignmentAreasLoad, assignmentAreasLoaded } from '../store';
import { Zetkin2Area } from 'features/areas/types';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useAssignmentAreas(orgId: number, areaAssId: number) {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.areaAssignments.areasByAssignmentId[areaAssId]
  );

  return useRemoteList(list, {
    actionOnLoad: () => assignmentAreasLoad(areaAssId),
    actionOnSuccess: (data) => assignmentAreasLoaded([areaAssId, data]),
    cacheKey: `assignment-areas-${orgId}-${areaAssId}`,
    loader: () =>
      apiClient.get<Zetkin2Area[]>(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}/areas`
      ),
  });
}
