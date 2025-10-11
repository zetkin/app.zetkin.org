import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinDoorAssignment,
  ZetkinDoorAssignmentPostBody,
} from '../types';
import { HouseholdAssignmentCreate, HouseholdAssignmentCreated } from '../store';

export default function useCreateHouseholdsAssignment(
  orgId: number,
  campId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinDoorAssignmentPostBody) => {
    dispatch(householdAssignmentCreate());
    const created = await apiClient.post<ZetkinDoorAssignment>(
      `/beta/orgs/${orgId}/projects/${campId}/householdsassignments`,
      data
    );
    dispatch(householdAssignmentCreated(created));
  };
}
