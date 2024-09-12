import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinIndividualCanvassAssignment } from '../types';
import { individualAssignmentAdd, individualAssignmentAdded } from '../store';

export default function useAddIndividualCanvassAssignment(
  orgId: number,
  campId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (personId: number) => {
    dispatch(individualAssignmentAdd([canvassAssId, personId]));
    const individualCanvassAss =
      await apiClient.put<ZetkinIndividualCanvassAssignment>(
        `/beta/orgs/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}/individualcanvassassignments/${personId}`
      );
    dispatch(individualAssignmentAdded([canvassAssId, individualCanvassAss]));
  };
}
