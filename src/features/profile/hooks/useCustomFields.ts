import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinCustomField } from 'utils/types/zetkin';
import { fieldsLoad, fieldsLoaded } from 'features/profile/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useCustomFields(
  orgId: number
): IFuture<ZetkinCustomField[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const fieldsList = useAppSelector((state) => state.profiles.fieldsList);

  return loadListIfNecessary(fieldsList, dispatch, {
    actionOnLoad: () => fieldsLoad(),
    actionOnSuccess: (fields) => fieldsLoaded(fields),
    loader: async () =>
      apiClient.get<ZetkinCustomField[]>(`/api/orgs/${orgId}/people/fields`),
  });
}
