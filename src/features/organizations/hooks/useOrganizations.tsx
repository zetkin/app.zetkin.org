import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import { useSelector } from 'react-redux';
import { ZetkinMembership } from 'utils/types/zetkin';
import { useApiClient, useEnv } from 'core/hooks';
import { userOrganizationsLoad, userOrganizationsLoaded } from '../store';

const useOrganizations = (): IFuture<ZetkinMembership['organization'][]> => {
  const env = useEnv();
  const apiClient = useApiClient();
  const organizationState = useSelector(
    (state: RootState) => state.organizations
  );

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

export default useOrganizations;
