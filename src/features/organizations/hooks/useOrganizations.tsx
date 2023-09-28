import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import { useSelector } from 'react-redux';
import { useApiClient, useEnv } from 'core/hooks';
import { userOrganizationsLoad, userOrganizationsLoaded } from '../store';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

const useOrganizations = (): IFuture<
  Pick<ZetkinOrganization, 'title' | 'id'>[] | null
> => {
  const env = useEnv();
  const apiClient = useApiClient();
  const organizationState = useSelector(
    (state: RootState) => state.organizations
  );

  const organizations = loadListIfNecessary(
    organizationState.userOrgList,
    env.store,
    {
      actionOnLoad: () => userOrganizationsLoad(),
      actionOnSuccess: (data) => userOrganizationsLoaded(data),
      loader: () =>
        apiClient
          .get<ZetkinMembership[]>(`/api/users/me/memberships`)
          .then((response) => response.filter((m) => m.role != null))
          .then((filteredResponse) =>
            filteredResponse.map((m) => m.organization)
          ),
    }
  );

  return organizations;
};

export default useOrganizations;
