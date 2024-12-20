import { FC } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import { ZetkinAreaAssignment } from '../../../areaAssignments/types';
import useSidebarStats from 'features/canvass/hooks/useSidebarStats';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { Msg } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';

type Props = {
  assignment: ZetkinAreaAssignment;
};

const CanvassSidebar: FC<Props> = ({ assignment }) => {
  const { loading, stats, sync, synced } = useSidebarStats(
    assignment.organization.id,
    assignment.id
  );

  return (
    <Box
      sx={(theme) => ({
        background: `linear-gradient(90deg, ${theme.palette.grey[300]} 0, white 2rem)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        overflowY: 'auto',
        p: 2,
      })}
    >
      <Box
        sx={{
          columnGap: 1,
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          mx: 1,
          rowGap: 2,
        }}
      >
        <Box gridColumn="span 3">
          <Typography variant="h5">{assignment.title}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">
            <Msg id={messageIds.sidebar.progress.header.title} />
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="body2">
            <Msg id={messageIds.sidebar.progress.header.households} />
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="body2">
            <Msg id={messageIds.sidebar.progress.header.locations} />
          </Typography>
        </Box>
        <Box gridColumn="span 3">
          <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
        </Box>
        <Box gridColumn="span 3">
          <Msg id={messageIds.sidebar.progress.session.title} />
        </Box>
        <Box>
          <Msg id={messageIds.sidebar.progress.session.you} />
        </Box>
        <Box textAlign="right">
          <Typography variant="h5">{stats.today.numUserHouseholds}</Typography>
        </Box>
        <Box textAlign="right">{stats.today.numUserLocations}</Box>
        <Box>
          <Msg id={messageIds.sidebar.progress.session.team} />
        </Box>
        <Box textAlign="right">{stats.today.numHouseholds}</Box>
        <Box textAlign="right">{stats.today.numLocations}</Box>
        <Box gridColumn="span 3">
          <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
        </Box>
        <Box>
          <Msg id={messageIds.sidebar.progress.allTime.title} />
        </Box>
        <Box textAlign="right">{stats.allTime.numHouseholds}</Box>
        <Box textAlign="right">{stats.allTime.numLocations}</Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gridColumn: 'span 3',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="body2">
              {!loading && synced && (
                <Msg
                  id={messageIds.sidebar.progress.sync.label.hasLoaded}
                  values={{
                    timestamp: <ZUIRelativeTime datetime={synced} />,
                  }}
                />
              )}
              {!loading && !synced && (
                <Msg id={messageIds.sidebar.progress.sync.label.neverLoaded} />
              )}
            </Typography>
          </Box>
          <Box>
            <Button
              disabled={loading}
              onClick={() => sync()}
              startIcon={loading ? <CircularProgress size={24} /> : null}
            >
              <Msg
                id={
                  loading
                    ? messageIds.sidebar.progress.sync.syncButton.loading
                    : messageIds.sidebar.progress.sync.syncButton.label
                }
              />
            </Button>
          </Box>
        </Box>
        <Box sx={{ gridColumn: 'span 3' }}>
          <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
        </Box>
      </Box>
      <List>
        <ListItemButton href="/my/home" sx={{ px: 1 }}>
          <ListItemText
            primary={<Msg id={messageIds.sidebar.menuOptions.home} />}
          />
        </ListItemButton>
        <ListItemButton href="/logout" sx={{ px: 1 }}>
          <ListItemText
            primary={<Msg id={messageIds.sidebar.menuOptions.logOut} />}
          />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default CanvassSidebar;
