import getUserOrganizationsTree from 'features/organizations/rpc/getUserOrgTree';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import { useSelector } from 'react-redux';
import { treeDataLoad, treeDataLoaded } from '../store';
import { useApiClient, useEnv } from 'core/hooks';

const useOrganizationsTree = () => {
  const env = useEnv();
  const apiClient = useApiClient();
  const organizationState = useSelector(
    (state: RootState) => state.organizations
  );

  const getOrgTree = () => {
    return loadListIfNecessary(organizationState.treeDataList, env.store, {
      actionOnLoad: () => treeDataLoad(),
      actionOnSuccess: (data) => treeDataLoaded(data),
      loader: () => apiClient.rpc(getUserOrganizationsTree, {}),
    });
  };

  return {
    treeData: getOrgTree().data,
    treeError: getOrgTree().error,
    treeIsLoading: getOrgTree().isLoading,
  };
};

export default useOrganizationsTree;
