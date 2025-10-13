import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { allOrganizationsLoaded, allOrganizationsLoad } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

const useOrganizations = (): IFuture<ZetkinOrganization[]> => {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const organizationState = useAppSelector((state) => state.organizations);

  return loadItemIfNecessary(organizationState.allOrganizations, dispatch, {
    actionOnLoad: () => allOrganizationsLoad(),
    actionOnSuccess: (data) => allOrganizationsLoaded(data),
    loader: () => apiClient.get<ZetkinOrganization[]>(`/api/orgs`),
  });
};

export default useOrganizations;
