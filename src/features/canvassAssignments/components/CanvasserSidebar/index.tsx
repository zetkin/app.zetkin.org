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

import { ZetkinCanvassAssignment } from '../../types';
import useSidebarStats from 'features/canvassAssignments/hooks/useSidebarStats';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

type Props = {
  assignment: ZetkinCanvassAssignment;
};

const CanvasserSidebar: FC<Props> = ({ assignment }) => {
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
          <Typography variant="body1">Progress</Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="body2">Households</Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="body2">Places</Typography>
        </Box>
        <Box gridColumn="span 3">
          <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
        </Box>
        <Box gridColumn="span 3">Session (today)</Box>
        <Box>You</Box>
        <Box textAlign="right">
          <Typography variant="h5">{stats.today.numUserHouseholds}</Typography>
        </Box>
        <Box textAlign="right">{stats.today.numUserPlaces}</Box>
        <Box>Team</Box>
        <Box textAlign="right">{stats.today.numHouseholds}</Box>
        <Box textAlign="right">{stats.today.numPlaces}</Box>
        <Box gridColumn="span 3">
          <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
        </Box>
        <Box>All time</Box>
        <Box textAlign="right">{stats.allTime.numHouseholds}</Box>
        <Box textAlign="right">{stats.allTime.numPlaces}</Box>
        <Box
          sx={{
            alignItems: 'center',
            bgcolor: '#ddd',
            display: 'flex',
            gridColumn: 'span 3',
            height: '100px',
            justifyContent: 'center',
          }}
        >
          Chart goes here
        </Box>
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
                <>
                  Synced <ZUIRelativeTime datetime={synced} />
                </>
              )}
              {!loading && !synced && `Never synced`}
            </Typography>
          </Box>
          <Box>
            <Button
              disabled={loading}
              onClick={() => sync()}
              startIcon={loading ? <CircularProgress size={24} /> : null}
            >
              {loading ? 'Syncing' : 'Sync now'}
            </Button>
          </Box>
        </Box>
        <Box sx={{ gridColumn: 'span 3' }}>
          <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
        </Box>
      </Box>
      <List>
        <ListItemButton href="/my/canvassassignments" sx={{ px: 1 }}>
          <ListItemText primary="My assignments" />
        </ListItemButton>
        <ListItemButton href="/logout" sx={{ px: 1 }}>
          <ListItemText primary="Log out" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default CanvasserSidebar;
