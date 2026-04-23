import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinAreaAssignment } from '../types';
import { areaAssignmentLoad, areaAssignmentLoaded } from '../store';

export default function useAreaAssignment(orgId: number, areaAssId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const areaAssignmenList = useAppSelector(
    (state) => state.areaAssignments.areaAssignmentsByOrgId[orgId]?.items ?? []
  );
  const areaAssignmentItem = areaAssignmenList.find(
    (item) => item.id == areaAssId
  );

  return loadItemIfNecessary(areaAssignmentItem, dispatch, {
    actionOnLoad: () => areaAssignmentLoad([orgId, areaAssId]),
    actionOnSuccess: (data) => areaAssignmentLoaded([orgId, data]),
    loader: () =>
      apiClient.get<ZetkinAreaAssignment>(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}`
      ),
  });
}
