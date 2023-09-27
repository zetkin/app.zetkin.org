import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import { useSelector } from 'react-redux';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { organizationLoad, organizationLoaded } from '../store';
import { useApiClient, useEnv } from 'core/hooks';

interface UseOrganizationReturn {
  orgData: ZetkinOrganization | null;
  orgError: unknown;
  orgIsLoading: boolean;
}

const useOrganization = (orgId: number): UseOrganizationReturn => {
  const env = useEnv();
  const apiClient = useApiClient();
  const organizationState = useSelector(
    (state: RootState) => state.organizations
  );

  const getOrganization = () => {
    return loadItemIfNecessary(organizationState.orgData, env.store, {
      actionOnLoad: () => organizationLoad(),
      actionOnSuccess: (data) => organizationLoaded(data),
      loader: () => apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`),
    });
  };

  return {
    orgData: getOrganization().data,
    orgError: getOrganization().error,
    orgIsLoading: getOrganization().isLoading,
  };
};

export default useOrganization;
