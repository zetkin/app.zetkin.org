import { FC } from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import { ZetkinAreaAssignment } from '../../../areaAssignments/types';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import { Msg } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';

type Props = {
  assignment: ZetkinAreaAssignment;
};

const CanvassSidebar: FC<Props> = ({ assignment }) => {
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
      </Box>
      <List>
        {assignment.instructions && (
          <ListItem sx={{ display: 'block', px: 1 }}>
            <ListItemText
              primary={<Msg id={messageIds.sidebar.instructions.title} />}
              sx={{ pb: 2 }}
            />
            <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
            <Typography sx={{ pb: 2, pt: 2 }} variant="body2">
              <ZUIMarkdown markdown={assignment.instructions} />
            </Typography>
            <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
          </ListItem>
        )}
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
