import getUserOrganizationsTree from 'features/organizations/rpc/getUserOrgTree';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import { TreeItemData } from '../types';
import { useSelector } from 'react-redux';
import { treeDataLoad, treeDataLoaded } from '../store';
import { useApiClient, useEnv } from 'core/hooks';

const useOrganizationsTree = (): IFuture<TreeItemData[]> => {
  const env = useEnv();
  const apiClient = useApiClient();
  const organizationState = useSelector(
    (state: RootState) => state.organizations
  );

  const orgsTree = loadListIfNecessary(
    organizationState.treeDataList,
    env.store,
    {
      actionOnLoad: () => treeDataLoad(),
      actionOnSuccess: (data) => treeDataLoaded(data),
      loader: () => apiClient.rpc(getUserOrganizationsTree, {}),
    }
  );

  return orgsTree;
};

export default useOrganizationsTree;
