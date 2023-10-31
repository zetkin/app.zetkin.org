import getUserOrganizationsTree from 'features/organizations/rpc/getUserOrgTree';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { TreeItemData } from '../types';
import { treeDataLoad, treeDataLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

const useOrganizationsTree = (): IFuture<TreeItemData[]> => {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const organizationState = useAppSelector((state) => state.organizations);

  const orgsTree = loadListIfNecessary(
    organizationState.treeDataList,
    dispatch,
    {
      actionOnLoad: () => treeDataLoad(),
      actionOnSuccess: (data) => treeDataLoaded(data),
      loader: () => apiClient.rpc(getUserOrganizationsTree, {}),
    }
  );

  return orgsTree;
};

export default useOrganizationsTree;
