import { FC } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import OrganizationTree from './OrganizationTree';
import RecentOrganizations from './RecentOrganizations';
import { RemoteList } from 'utils/storeUtils';
import { TreeItemData } from '../types';
import { useMessages } from 'core/i18n';

interface OrganizationSwitcherProps {
  onClearRecentOrgs: () => void;
  onSwitchOrg: () => void;
  orgData: TreeItemData[];
  orgId: number;
  recentOrganizations: (TreeItemData | undefined)[];
  showOrgSwitcher: boolean;
  showRecentOrgs: boolean;
  treeDataList: RemoteList<TreeItemData>;
}

const OrganizationSwitcher: FC<OrganizationSwitcherProps> = ({
  onClearRecentOrgs,
  onSwitchOrg,
  orgData,
  orgId,
  recentOrganizations,
  showOrgSwitcher,
  showRecentOrgs,
  treeDataList,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);

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
        <Box marginBottom={1}>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Typography fontSize={12} margin={1} variant="body2">
              {messages.sidebar.recent.title().toLocaleUpperCase()}
            </Typography>
            <Button
              onClick={onClearRecentOrgs}
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
            recentOrganizations={recentOrganizations}
          />
        </Box>
      )}
      {orgData.length > 0 && (
        <Box>
          <Typography fontSize={12} m={1} variant="body2">
            {messages.sidebar.allOrganizations().toLocaleUpperCase()}
          </Typography>
          <OrganizationTree
            onSwitchOrg={onSwitchOrg}
            orgId={orgId}
            treeItemData={orgData}
          />
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
