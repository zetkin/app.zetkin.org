import getUserOrganizationsTree from 'features/organizations/rpc/getUserOrgTree';
import { IFuture } from 'core/caching/futures';
import { RootState } from 'core/store';
import { useSelector } from 'react-redux';
import {
  loadItemIfNecessary,
  loadListIfNecessary,
} from 'core/caching/cacheUtils';
import {
  organizationLoad,
  organizationLoaded,
  treeDataLoad,
  treeDataLoaded,
  userOrganizationsLoad,
  userOrganizationsLoaded,
} from '../store';
import { useApiClient, useEnv } from 'core/hooks';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

interface useOrganizationsReturn {
  getOrganization: (orgId: number) => IFuture<ZetkinOrganization>;
  getOrganizationsTree: () => void;
  getUserOrganizations: () => IFuture<ZetkinMembership['organization'][]>;
}

function useOrganizations(): useOrganizationsReturn {
  const env = useEnv();
  const apiClient = useApiClient();
  const organizationState = useSelector(
    (state: RootState) => state.organizations
  );

  const getOrganization = (orgId: number): IFuture<ZetkinOrganization> => {
    return loadItemIfNecessary(organizationState.orgData, env.store, {
      actionOnLoad: () => organizationLoad(),
      actionOnSuccess: (data) => organizationLoaded(data),
      loader: () => apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`),
    });
  };

  const getUserOrganizations = (): IFuture<
    ZetkinMembership['organization'][]
  > => {
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

  const getOrganizationsTree = () => {
    return loadListIfNecessary(organizationState.treeDataList, env.store, {
      actionOnLoad: () => treeDataLoad(),
      actionOnSuccess: (data) => treeDataLoaded(data),
      loader: () => apiClient.rpc(getUserOrganizationsTree, {}),
    });
  };

  return { getOrganization, getOrganizationsTree, getUserOrganizations };
}

export default useOrganizations;
