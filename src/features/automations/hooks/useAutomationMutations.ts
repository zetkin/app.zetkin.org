import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinBulkAutomation,
  ZetkinBulkAutomationPatchBody,
} from '../types/api';
import { automationUpdated } from '../store';

export default function useAutomationMutations(
  orgId: number,
  automationId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    async updateAutomation(data: ZetkinBulkAutomationPatchBody) {
      const updatedAutomation = await apiClient.patch<
        ZetkinBulkAutomation,
        ZetkinBulkAutomationPatchBody
      >(`/api2/orgs/${orgId}/bulk/automations/${automationId}`, data);

      dispatch(automationUpdated(updatedAutomation));

      return updatedAutomation;
    },
  };
}
