import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinBulkAutomation } from '../types/api';
import { useApiClient, useAppSelector } from 'core/hooks';
import { automationsLoad, automationsLoaded } from '../store';

export default function useAutomations(orgId: number): ZetkinBulkAutomation[] {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.automations.automationList);
  return useRemoteList(list, {
    actionOnLoad: () => automationsLoad(),
    actionOnSuccess: (data) => automationsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinBulkAutomation[]>(
        `/api2/orgs/${orgId}/bulk/automations`
      ),
  });
}
