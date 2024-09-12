import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinIndividualCanvassAssignment } from '../types';
import {
  individualAssignmentsLoad,
  individualAssignmentsLoaded,
} from '../store';

export default function useIndividualCanvassAssignments(
  orgId: number,
  campId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const assigneeList = useAppSelector(
    (state) =>
      state.areas.individualAssignmentsByCanvassAssignmentId[canvassAssId]
  );

  return loadListIfNecessary(assigneeList, dispatch, {
    actionOnLoad: () => individualAssignmentsLoad(canvassAssId),
    actionOnSuccess: (data) =>
      individualAssignmentsLoaded([canvassAssId, data]),
    loader: () =>
      apiClient.get<ZetkinIndividualCanvassAssignment[]>(
        `/beta/orgs/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}/individualcanvassassignments`
      ),
  });
}
