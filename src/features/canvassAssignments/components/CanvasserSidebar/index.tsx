import { FC } from 'react';
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import { ZetkinCanvassAssignment } from '../../types';

type Props = {
  assignment: ZetkinCanvassAssignment;
};

const CanvasserSidebar: FC<Props> = ({ assignment }) => {
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
          <Typography variant="h5">12</Typography>
        </Box>
        <Box textAlign="right">1</Box>
        <Box>Team</Box>
        <Box textAlign="right">53</Box>
        <Box textAlign="right">7</Box>
        <Box gridColumn="span 3">
          <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
        </Box>
        <Box>All time</Box>
        <Box textAlign="right">465</Box>
        <Box textAlign="right">48</Box>
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
            <Typography variant="body2">Synced 7 minutes ago.</Typography>
          </Box>
          <Box>
            <Button>Sync now</Button>
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
