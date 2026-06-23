import { useMemo } from 'react';

import { IFuture } from 'core/caching/futures';
import useOrganizationsTree from './useOrganizationsTree';
import { TreeItemData } from '../types';

const findInTree = (node: TreeItemData, targetId: number): boolean => {
  if (node.id === targetId) {
    return true;
  }
  return node.children.some((child) => findInTree(child, targetId));
};

const useRootOrganization = (orgId: number): IFuture<TreeItemData> => {
  const treeFuture = useOrganizationsTree();

  return useMemo(() => {
    if (!treeFuture.data) {
      return {
        data: null,
        error: treeFuture.error || null,
        isLoading: !treeFuture.error,
      };
    }

    const parentOrg = treeFuture.data.find((topNode) =>
      findInTree(topNode, orgId)
    );

    return {
      data: parentOrg || null,
      error: null,
      isLoading: false,
    };
  }, [treeFuture.data, treeFuture.error, orgId]);
};

export default useRootOrganization;
