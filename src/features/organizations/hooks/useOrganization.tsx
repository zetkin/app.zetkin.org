import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { organizationLoad, organizationLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseOrganizationReturn {
  data: ZetkinOrganization | null;
  error: unknown | null;
  isLoading: boolean;
}

const useOrganization = (orgId: number): UseOrganizationReturn => {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const organizationState = useAppSelector((state) => state.organizations);

  const organization = loadItemIfNecessary(
    organizationState.orgData,
    dispatch,
    {
      actionOnLoad: () => organizationLoad(),
      actionOnSuccess: (data) => organizationLoaded(data),
      loader: () => apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`),
    }
  );

  return {
    data: organization.data,
    error: organization.error,
    isLoading: organization.isLoading,
  };
};

export default useOrganization;
