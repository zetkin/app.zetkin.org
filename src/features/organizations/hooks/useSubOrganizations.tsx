import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  organizationLoaded,
  subOrganizationsLoad,
  subOrganizationsLoaded,
  userOrganizationsLoad,
  userOrganizationsLoaded,
} from '../store';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

const useSubOrganizations = (
  orgId: number
): IFuture<ZetkinOrganization[] | null> => {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const organizationState = useAppSelector((state) => state.organizations);

  const organizations = loadListIfNecessary(
    organizationState.subOrgsData,
    dispatch,
    {
      actionOnLoad: () => subOrganizationsLoad(),
      actionOnSuccess: (data) => subOrganizationsLoaded(data),
      loader: () =>
        apiClient.get<ZetkinOrganization[]>(
          `/api/orgs/${orgId}/sub_organizations`
        ),
    }
  );

  return organizations;
};

export default useSubOrganizations;
