import { useApiClient, useAppSelector } from 'core/hooks';
import { assignmentAreasLoad, assignmentAreasLoaded } from '../store';
import { Zetkin2Area } from 'features/areas/types';
import useRemoteList from 'core/hooks/useRemoteList';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';

export default function useAssignmentAreas(orgId: number, areaAssId: number) {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.areaAssignments.areasByAssignmentId[areaAssId]
  );

  return useRemoteList(list, {
    actionOnLoad: () => assignmentAreasLoad(areaAssId),
    actionOnSuccess: (data) => assignmentAreasLoaded([areaAssId, data]),
    loader: async () =>
      fetchAllPaginated<Zetkin2Area>((page) =>
        apiClient.get(
          `/api2/orgs/${orgId}/area_assignments/${areaAssId}/areas?size=100&page=${page}`
        )
      ),
  });
}
