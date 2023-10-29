import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinDataField } from 'utils/types/zetkin';
import { fieldsLoad, fieldsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useCustomFields(orgId: number): ZetkinDataField[] {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const fieldsList = useAppSelector((state) => state.smartSearch.fieldsList);

  const fields = loadListIfNecessary(fieldsList, dispatch, {
    actionOnLoad: () => fieldsLoad(),
    actionOnSuccess: (fields) => fieldsLoaded(fields),
    loader: async () =>
      apiClient.get<ZetkinDataField[]>(`/api/orgs/${orgId}/people/fields`),
  });

  return fields.data ?? [];
}
