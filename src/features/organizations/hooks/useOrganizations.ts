import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { userOrganizationsLoad, userOrganizationsLoaded } from '../store';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

const useOrganizations = (): IFuture<
  Pick<ZetkinOrganization, 'title' | 'id'>[] | null
> => {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const organizationState = useAppSelector((state) => state.organizations);

  const organizations = loadListIfNecessary(
    organizationState.userMembershipList,
    dispatch,
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
