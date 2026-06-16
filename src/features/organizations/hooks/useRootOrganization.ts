import { IFuture } from 'core/caching/futures';
import useOrganizationsTree from './useOrganizationsTree';
import { TreeItemData } from '../types';

const useRootOrganization = (orgId: number): IFuture<TreeItemData> => {
  const treeFuture = useOrganizationsTree();

  if (treeFuture.data) {
    const findInTree = (node: TreeItemData, targetId: number): boolean => {
      if (node.id === targetId) {
        return true;
      }

      for (const child of node.children) {
        if (findInTree(child, targetId)) {
          return true;
        }
      }

      return false;
    };

    const parentOrg = treeFuture.data.find((topNode) =>
      findInTree(topNode, orgId)
    );

    return {
      data: parentOrg || null,
      error: null,
      isLoading: false,
    };
  }
  if (treeFuture.error) {
    return {
      data: null,
      error: treeFuture.error,
      isLoading: false,
    };
  }
  return {
    data: null,
    error: null,
    isLoading: true,
  };
};

export default useRootOrganization;
