import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinCanvassAssignment } from '../types';
import { canvassAssignmentLoad, canvassAssignmentLoaded } from '../store';

export default function useCanvassAssignment(
  orgId: number,
  campId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const canvassAssignmenList = useAppSelector(
    (state) => state.areas.canvassAssignmentList.items
  );
  const canvassAssignmentItem = canvassAssignmenList.find(
    (item) => item.id == canvassAssId
  );

  return loadItemIfNecessary(canvassAssignmentItem, dispatch, {
    actionOnLoad: () => canvassAssignmentLoad(canvassAssId),
    actionOnSuccess: (data) => canvassAssignmentLoaded(data),
    loader: () =>
      apiClient.get<ZetkinCanvassAssignment>(
        `/beta/orgs/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}`
      ),
  });
}
