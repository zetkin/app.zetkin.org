import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinBulkAutomation,
  ZetkinBulkAutomationPostBody,
} from '../types/api';
import { automationCreated } from '../store';

export default function useCreateAutomation(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async function createAutomation(data: ZetkinBulkAutomationPostBody) {
    const newAutomation = await apiClient.post<
      ZetkinBulkAutomation,
      ZetkinBulkAutomationPostBody
    >(`/api2/orgs/${orgId}/bulk/automations`, data);
    dispatch(automationCreated(newAutomation));
    return newAutomation;
  };
}
