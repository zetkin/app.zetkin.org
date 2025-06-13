import { useApiClient, useAppSelector } from 'core/hooks';
import { assignmentAreasLoad, assignmentAreasLoaded } from '../store';
import { ZetkinArea } from 'features/areas/types';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useAssignmentAreas(
  orgId: number,
  areaAssignmentId: number
) {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.areaAssignments.areasByAssignmentId[areaAssignmentId]
  );

  return useRemoteList(list, {
    actionOnLoad: () => assignmentAreasLoad(areaAssignmentId),
    actionOnSuccess: (data) => assignmentAreasLoaded([areaAssignmentId, data]),
    loader: () =>
      apiClient.get<ZetkinArea[]>(
        `/api2/orgs/${orgId}/area_assignments/${areaAssignmentId}/areas`
      ),
  });
}
