import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinHouseholdAssignment,
  ZetkinHouseholdAssignmentPatchbody,
} from '../types';
import {
  householdAssignmentDeleted,
  householdAssignmentUpdated,
} from '../store';

export default function useHouseholdAssignmentMutations(
  campId: number,
  orgId: number,
  householdsAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    deleteHouseholdAssignment: async () => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}`
      );
      dispatch(householdAssignmentDeleted(householdsAssId));
    },
    updateHouseholdAssignment: async (
      data: ZetkinHouseholdAssignmentPatchbody
    ) => {
      const updated = await apiClient.patch<
        ZetkinHouseholdAssignment,
        ZetkinHouseholdAssignmentPatchbody
      >(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}`,
        data
      );

      dispatch(householdAssignmentUpdated([updated, Object.keys(data)]));
    },
  };
}
