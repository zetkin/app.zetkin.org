import Fuse from 'fuse.js';
import { RootState } from 'core/store';
import { TreeItemData } from 'features/organizations/types';
import useLocalStorage from 'zui/hooks/useLocalStorage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

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
  function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
  }

  const treeDataList = useSelector(
    (state: RootState) => state.organizations.treeDataList
  );
  const orgData = treeDataList.items.map((item) => item.data).filter(notEmpty);

  const flatOrgData = makeFlatOrgData(orgData);

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

  const filteredRecentOrgs = useMemo(() => {
    const fuse = new Fuse(recentOrgs, {
      keys: ['title'],
      threshold: 0.4,
    });

    return searchString
      ? fuse.search(searchString).map((fuseResult) => fuseResult.item)
      : flatOrgData;
  }, [searchString]);

  const filteredAllOrgs = useMemo(() => {
    const fuse = new Fuse(flatOrgData, {
      keys: ['title'],
      threshold: 0.4,
    });

    return searchString
      ? fuse.search(searchString).map((fuseResult) => fuseResult.item)
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
