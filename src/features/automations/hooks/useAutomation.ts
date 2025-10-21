import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';
import { automationLoad, automationLoaded } from '../store';
import { ZetkinBulkAutomation } from '../types/api';

export default function useAutomation(orgId: number, automationId: number) {
  const apiClient = useApiClient();
  const item = useAppSelector((state) =>
    state.automations.automationList.items.find(
      (item) => item.id == automationId
    )
  );

  return useRemoteItem(item, {
    actionOnLoad: () => automationLoad(automationId),
    actionOnSuccess: (data) => automationLoaded(data),
    loader: () =>
      apiClient.get<ZetkinBulkAutomation>(
        `/api2/orgs/${orgId}/bulk/automations/${automationId}`
      ),
  });
}
