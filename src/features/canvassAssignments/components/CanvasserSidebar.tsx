import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import { ZetkinCanvassAssignment } from '../types';

type Props = {
  assignment: ZetkinCanvassAssignment;
};

const CanvasserSidebar: FC<Props> = ({ assignment }) => {
  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.palette.grey[800],
        color: theme.palette.common.white,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        overflowY: 'auto',
        p: 2,
      })}
    >
      <Box>
        <Typography variant="h5">Your session</Typography>
        <Typography color="red" variant="body2">
          This part of the sidebar will show the current stats for the users
          canvassing session, and when the data from the session was most
          recently synced with the server/team.
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'gray' }} />
      <Box>
        <Typography variant="h5">Team progress</Typography>
        <Typography color="red" variant="body2">
          This part of the sidebar will show the collective progress for the
          entire assignment.
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'gray' }} />
      <Box>
        <Typography variant="h5">{assignment.title}</Typography>
        <Typography>Instructions</Typography>
        <Typography>List</Typography>
        <Typography>Map</Typography>
      </Box>
      <Divider sx={{ bgcolor: 'gray' }} />
      <Box>
        <Typography>My Page</Typography>
        <Typography>Organize</Typography>
        <Typography>Settings</Typography>
      </Box>
    </Box>
  );
};

export default CanvasserSidebar;
