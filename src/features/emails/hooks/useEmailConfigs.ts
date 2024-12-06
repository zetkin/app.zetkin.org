import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinEmailConfig } from 'utils/types/zetkin';
import { configsLoad, configsLoaded } from '../store';

export default function useEmailConfigs(
  orgId: number
): IFuture<ZetkinEmailConfig[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const configList = useAppSelector((state) => state.emails.configList);

  return loadListIfNecessary(configList, dispatch, {
    actionOnLoad: () => configsLoad(),
    actionOnSuccess: (items) => configsLoaded(items),
    loader: () =>
      apiClient.get<ZetkinEmailConfig[]>(`/api/orgs/${orgId}/emails/configs`),
  });
}
