import { FC } from 'react';
import { FilterListOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';

import messageIds from '../../l10n/messageIds';
import OrganizationTree from '../OrganizationTree';
import RecentOrganizations from '../RecentOrganizations';
import SearchResults from '../SearchResults';
import { useMessages } from 'core/i18n';
import useOrganizationsTree from 'features/organizations/hooks/useOrganizationsTree';
import useOrgSwitcher from './useOrgSwitcher';

interface OrganizationSwitcherProps {
  open: boolean;
  orgId: number;
  searchString: string;
}

const OrganizationSwitcher: FC<OrganizationSwitcherProps> = ({
  open,
  orgId,
  searchString,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const organizations = useOrganizationsTree();

  const {
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
  } = useOrgSwitcher(orgId, searchString);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottomColor: open ? 'transparent' : theme.palette.grey[300],
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        height: open ? 'calc(100% - 130px)' : 0,
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
      {showLoadingState && (
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {showEmptyState && (
        <Box alignItems="center" display="flex" flexDirection="column">
          <FilterListOutlined color="secondary" sx={{ fontSize: '12em' }} />
          <Typography color="secondary">
            {messages.sidebar.filter.noResults()}
          </Typography>
        </Box>
      )}
      {showRecentOrgs && (
        <Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Typography fontSize={12} margin={1} variant="body2">
              {messages.sidebar.recent.title().toLocaleUpperCase()}
              {hasMatchesInRecentOrgs &&
                ` (${messages.sidebar.filtered().toLocaleUpperCase()})`}
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
            recentOrganizations={
              hasMatchesInRecentOrgs ? filteredRecentOrgs : recentOrgs
            }
          />
        </Box>
      )}
      {showOrgTree && organizations && (
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
              matchingOrgs={filteredAllOrgs}
              onSwitchOrg={onSwitchOrg}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default OrganizationSwitcher;
