import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { organizationLoad, organizationLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

const useOrganization = (orgId: number): IFuture<ZetkinOrganization> => {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const orgItem = useAppSelector((state) =>
    state.organizations.orgList.items.find((item) => item.id == orgId)
  );

  return loadItemIfNecessary(orgItem, dispatch, {
    actionOnLoad: () => organizationLoad(orgId),
    actionOnSuccess: (data) => organizationLoaded(data),
    loader: () => apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`),
  });
};

export default useOrganization;
