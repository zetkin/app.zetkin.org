import Fuse from 'fuse.js';
import { RootState } from 'core/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import notEmpty from 'utils/notEmpty';
import { TreeItemData } from 'features/organizations/types';
import useLocalStorage from 'zui/hooks/useLocalStorage';

function makeFlatOrgData(orgData: TreeItemData[]): TreeItemData[] {
  let children = [] as TreeItemData[];
  const flatOrgData = orgData.map((org) => {
    if (org.children && org.children.length) {
      children = [...children, ...org.children];
    }
    return org;
  });

  return flatOrgData.concat(
    children.length ? makeFlatOrgData(children) : children
  );
}

function useOrgSwitcher(orgId: number, searchString: string) {
  const treeDataList = useSelector(
    (state: RootState) => state.organizations.treeDataList
  );
  const orgData = treeDataList.items.map((item) => item.data).filter(notEmpty);

  const flatOrgData = useMemo(() => {
    return makeFlatOrgData(orgData);
  }, [orgData]);

  const [recentOrganizationIds, setRecentOrganizationIds] = useLocalStorage(
    'recentOrganizationIds',
    [] as number[]
  );

  function onSwitchOrg() {
    setRecentOrganizationIds([
      orgId,
      ...recentOrganizationIds.filter((id) => id != orgId),
    ]);
  }

  const recentOrgs = recentOrganizationIds
    .map((id) => flatOrgData.find((org) => org.id === id))
    .filter((org) => org?.id != orgId);

  const recentOrgsFuse = useMemo(() => {
    return new Fuse(recentOrgs, {
      keys: ['title'],
      shouldSort: false,
      threshold: 0.4,
    });
  }, [recentOrgs]);

  const filteredRecentOrgs = useMemo(() => {
    return searchString
      ? recentOrgsFuse.search(searchString).map((fuseResult) => fuseResult.item)
      : recentOrgs;
  }, [searchString]);

  const allOrgsFuse = useMemo(() => {
    return new Fuse(flatOrgData, {
      keys: ['title'],
      shouldSort: false,
      threshold: 0.4,
    });
  }, [flatOrgData]);

  const filteredAllOrgs = useMemo(() => {
    return searchString
      ? allOrgsFuse.search(searchString).map((fuseResult) => fuseResult.item)
      : flatOrgData;
  }, [searchString]);

  const showLoadingState = treeDataList.isLoading;
  const showEmptyState = searchString.length > 0 && filteredAllOrgs.length == 0;
  const showOrgTree = orgData.length > 0 && !showEmptyState;
  const hasMatchesInRecentOrgs =
    searchString.length > 0 && filteredRecentOrgs.length > 0;
  const hasRecentOrgs =
    searchString.length == 0 &&
    recentOrgs.length > 0 &&
    flatOrgData.length >= 5 &&
    !showEmptyState;
  const showRecentOrgs = hasRecentOrgs || hasMatchesInRecentOrgs;

  return {
    filteredAllOrgs,
    filteredRecentOrgs,
    flatOrgData,
    hasMatchesInRecentOrgs,
    onSwitchOrg,
    orgData,
    recentOrgs,
    setRecentOrganizationIds,
    showEmptyState,
    showLoadingState,
    showOrgTree,
    showRecentOrgs,
  };
}

export default useOrgSwitcher;
