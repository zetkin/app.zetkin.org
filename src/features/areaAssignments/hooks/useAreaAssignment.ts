import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinAreaAssignment } from '../types';
import { areaAssignmentLoad, areaAssignmentLoaded } from '../store';

export default function useAreaAssignment(orgId: number, areaAssId: string) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const areaAssignmenList = useAppSelector(
    (state) => state.areaAssignments.areaAssignmentList.items
  );
  const areaAssignmentItem = areaAssignmenList.find(
    (item) => item.id == areaAssId
  );

  return loadItemIfNecessary(areaAssignmentItem, dispatch, {
    actionOnLoad: () => areaAssignmentLoad(areaAssId),
    actionOnSuccess: (data) => areaAssignmentLoaded(data),
    loader: () =>
      apiClient.get<ZetkinAreaAssignment>(
        `/beta/orgs/${orgId}/areaassignments/${areaAssId}`
      ),
  });
}
