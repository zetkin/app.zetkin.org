import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import { useSelector } from 'react-redux';
import { useApiClient, useEnv } from 'core/hooks';
import { userOrganizationsLoad, userOrganizationsLoaded } from '../store';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

interface UseOrganizationsReturn {
  orgsData: Pick<ZetkinOrganization, 'title' | 'id'>[] | null;
  orgsError: unknown;
  orgsIsLoading: boolean;
}

const useOrganizations = (): UseOrganizationsReturn => {
  const env = useEnv();
  const apiClient = useApiClient();
  const organizationState = useSelector(
    (state: RootState) => state.organizations
  );

  const getOrganizations = () => {
    return loadListIfNecessary(organizationState.userOrgList, env.store, {
      actionOnLoad: () => userOrganizationsLoad(),
      actionOnSuccess: (data) => userOrganizationsLoaded(data),
      loader: () =>
        apiClient
          .get<ZetkinMembership[]>(`/api/users/me/memberships`)
          .then((response) => response.filter((m) => m.role != null))
          .then((filteredResponse) =>
            filteredResponse.map((m) => m.organization)
          ),
    });
  };

  return {
    orgsData: getOrganizations().data,
    orgsError: getOrganizations().error,
    orgsIsLoading: getOrganizations().isLoading,
  };
};

export default useOrganizations;
