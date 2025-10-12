import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinHouseholdAssignment,
  ZetkinHouseholdAssignmentPostBody,
} from '../types';
import { householdAssignmentCreated } from '../store';

export default function useCreateHouseholdsAssignment(
  orgId: number,
  campId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinHouseholdAssignmentPostBody) => {
    const created = await apiClient.post<ZetkinHouseholdAssignment>(
      `/beta/orgs/${orgId}/projects/${campId}/householdsassignments`,
      data
    );
    dispatch(householdAssignmentCreated(created));
  };
}
