import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';
import { fieldLoad, fieldLoaded } from 'features/profile/store';
import { ZetkinCustomField } from 'utils/types/zetkin';

export default function useCustomField(orgId: number, fieldId: number) {
  const apiClient = useApiClient();
  const fieldItems = useAppSelector((state) => state.profiles.fieldsList.items);

  const fieldItem = fieldItems.find((item) => item.id == fieldId);

  return useRemoteItem(fieldItem, {
    actionOnLoad: () => fieldLoad(fieldId),
    actionOnSuccess: (data) => fieldLoaded(data),
    loader: () =>
      apiClient.get<ZetkinCustomField>(
        `/api/orgs/${orgId}/people/fields/${fieldId}`
      ),
  });
}
