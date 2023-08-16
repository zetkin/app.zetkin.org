import Fuse from 'fuse.js';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useMemo } from 'react';

import messageIds from '../l10n/messageIds';
import OrganizationTree from './OrganizationTree';
import RecentOrganizations from './RecentOrganizations';
import { RootState } from 'core/store';
import SearchResults from './SearchResults';
import { TreeItemData } from '../types';
import useLocalStorage from 'zui/hooks/useLocalStorage';
import { useMessages } from 'core/i18n';
import { useSelector } from 'react-redux';

interface OrganizationSwitcherProps {
  orgId: number;
  searchString: string;
  showOrgSwitcher: boolean;
}

const OrganizationSwitcher: FC<OrganizationSwitcherProps> = ({
  orgId,
  searchString,
  showOrgSwitcher,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
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

  function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
  }

  const treeDataList = useSelector(
    (state: RootState) => state.organizations.treeDataList
  );

  const orgData = treeDataList.items.map((item) => item.data).filter(notEmpty);

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

  const flatOrgData = makeFlatOrgData(orgData);

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

  const showRecentOrgs =
    searchString.length === 0 &&
    recentOrgs.length > 0 &&
    flatOrgData.length >= 5;

  const showFilteredRecentOrgs =
    searchString.length > 0 &&
    filteredRecentOrgs.length > 0 &&
    flatOrgData.length >= 5;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottomColor: showOrgSwitcher
          ? 'transparent'
          : theme.palette.grey[300],
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        height: showOrgSwitcher ? 'calc(100% - 130px)' : 0,
        overflowY: 'auto',
        position: 'absolute',
        transition: theme.transitions.create(['borderBottomColor', 'height'], {
          duration: theme.transitions.duration.short,
          easing: theme.transitions.easing.sharp,
        }),
        width: '100%',
        zIndex: 1000,
      }}
    >
      {showRecentOrgs && (
        <Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Typography fontSize={12} margin={1} variant="body2">
              {messages.sidebar.recent.title().toLocaleUpperCase()}
            </Typography>
            <Button
              onClick={() => setRecentOrganizationIds([])}
              size="small"
              sx={{ marginRight: 2 }}
              variant="text"
            >
              {messages.sidebar.recent.clear()}
            </Button>
          </Box>
          <RecentOrganizations
            onSwitchOrg={onSwitchOrg}
            orgId={orgId}
            recentOrganizations={recentOrgs}
          />
        </Box>
      )}
      {showFilteredRecentOrgs && (
        <Box>
          <Typography fontSize={12} margin={1} variant="body2">
            {`${messages.sidebar.recent
              .title()
              .toLocaleUpperCase()} (${messages.sidebar
              .filtered()
              .toLocaleUpperCase()})`}
          </Typography>
          <RecentOrganizations
            onSwitchOrg={onSwitchOrg}
            orgId={orgId}
            recentOrganizations={filteredRecentOrgs}
          />
        </Box>
      )}
      {orgData.length > 0 && (
        <Box>
          <Typography fontSize={12} m={1} variant="body2">
            {messages.sidebar.allOrganizations().toLocaleUpperCase()}
            {searchString.length > 0 &&
              ` (${messages.sidebar.filtered().toLocaleUpperCase()})`}
          </Typography>
          {searchString.length == 0 && (
            <OrganizationTree
              onSwitchOrg={onSwitchOrg}
              orgId={orgId}
              treeItemData={orgData}
            />
          )}
          {searchString.length > 0 && (
            <SearchResults
              flatOrgData={flatOrgData}
              onSwitchOrg={onSwitchOrg}
              searchString={searchString}
            />
          )}
        </Box>
      )}
      {treeDataList.isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: 3 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default OrganizationSwitcher;
