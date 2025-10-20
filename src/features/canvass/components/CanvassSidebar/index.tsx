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
import useAreaAssignmentStats from 'features/areaAssignments/hooks/useAreaAssignmentStats';
import ZUIFutures from 'zui/ZUIFutures';

type Props = {
  assignment: ZetkinAreaAssignment;
};

const CanvassSidebar: FC<Props> = ({ assignment }) => {
  const statsFuture = useAreaAssignmentStats(
    assignment.organization_id,
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
      <Box sx={{ mx: 1 }}>
        <Typography variant="h5">{assignment.title}</Typography>
      </Box>
      <ZUIFutures
        futures={{
          stats: statsFuture,
        }}
      >
        {({ data: { stats } }) => {
          return (
            <Box
              sx={{
                columnGap: 1,
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                mx: 1,
                rowGap: 2,
              }}
            >
              <Box>
                <Typography variant="body1">
                  <Msg id={messageIds.sidebar.progress.header.households} />
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="h5">{stats.num_households}</Typography>
              </Box>
              <Box gridColumn="span 2">
                <Divider
                  sx={(theme) => ({ bgcolor: theme.palette.grey[100] })}
                />
              </Box>
              <Box>
                <Typography variant="body1">
                  <Msg id={messageIds.sidebar.progress.header.visits} />
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="h5">{stats.num_visits}</Typography>
              </Box>
              <Box>
                <Typography variant="body1">
                  <Msg
                    id={messageIds.sidebar.progress.header.successfulVisits}
                  />
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="h5">
                  {stats.num_successful_visits}
                </Typography>
              </Box>
              <Box gridColumn="span 2">
                <Divider
                  sx={(theme) => ({ bgcolor: theme.palette.grey[100] })}
                />
              </Box>
              {stats.num_households_visited != null && (
                <>
                  <Box>
                    <Typography variant="body1">
                      <Msg
                        id={messageIds.sidebar.progress.header.householdVisits}
                      />
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h5">
                      {stats.num_households_visited}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">
                      <Msg
                        id={
                          messageIds.sidebar.progress.header
                            .successfulHouseholdVisits
                        }
                      />
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h5">
                      {stats.num_households_successfully_visited}
                    </Typography>
                  </Box>
                  <Box gridColumn="span 2">
                    <Divider
                      sx={(theme) => ({ bgcolor: theme.palette.grey[100] })}
                    />
                  </Box>
                </>
              )}
            </Box>
          );
        }}
      </ZUIFutures>
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
