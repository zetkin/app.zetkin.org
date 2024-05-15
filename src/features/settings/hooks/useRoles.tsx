import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinOfficial } from 'utils/types/zetkin';
import { rolesLoad, rolesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useRoles(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const rolesList = useAppSelector((state) => state.roles.rolesList);

  return loadListIfNecessary(rolesList, dispatch, {
    actionOnLoad: () => rolesLoad(),
    actionOnSuccess: (data) => rolesLoaded(data),
    loader: () =>
      apiClient.get<ZetkinOfficial[]>(`/api/orgs/${orgId}/officials`),
  });
}
