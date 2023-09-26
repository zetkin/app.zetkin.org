import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import { useSelector } from 'react-redux';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { organizationLoad, organizationLoaded } from '../store';
import { useApiClient, useEnv } from 'core/hooks';

const useOrganization = (orgId: number): IFuture<ZetkinOrganization> => {
  const env = useEnv();
  const apiClient = useApiClient();
  const organizationState = useSelector(
    (state: RootState) => state.organizations
  );

  return loadItemIfNecessary(organizationState.orgData, env.store, {
    actionOnLoad: () => organizationLoad(),
    actionOnSuccess: (data) => organizationLoaded(data),
    loader: () => apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`),
  });
};

export default useOrganization;
