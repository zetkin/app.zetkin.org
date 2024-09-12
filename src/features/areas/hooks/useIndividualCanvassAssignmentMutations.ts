import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinIndividualCanvassAssignment,
  ZetkinIndividualCanvassAssignmentPatchBody,
} from '../types';
import { individualAssignmentUpdated } from '../store';

export default function useIndividualCanvassAssignmentMutations(
  orgId: number,
  campId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (
    personId: number,
    data: ZetkinIndividualCanvassAssignmentPatchBody
  ) => {
    const updated = await apiClient.patch<
      ZetkinIndividualCanvassAssignment,
      ZetkinIndividualCanvassAssignmentPatchBody
    >(
      `/beta/orgs/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}/individualcanvassassignments/${personId}`,
      data
    );

    dispatch(individualAssignmentUpdated([canvassAssId, updated]));
  };
}
