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
import { Zetkin2Area } from 'features/areas/types';
import useLocations from 'features/areaAssignments/hooks/useLocations';

type Props = {
  assignment: ZetkinAreaAssignment;
  selectedArea: Zetkin2Area;
};

const CanvassSidebar: FC<Props> = ({ assignment, selectedArea }) => {
  const locations = useLocations(
    assignment.organization_id,
    assignment.id,
    selectedArea.id
  );

  const {
    numHouseholds,
    numHouseholdsSuccessful,
    numHouseholdsVisited,
    numSuccessfulVisits,
    numVisits,
  } = locations.data?.reduce(
    (acc, c) => ({
      numHouseholds:
        acc.numHouseholds +
        (c.num_known_households || c.num_estimated_households),
      numHouseholdsSuccessful:
        acc.numHouseholdsSuccessful + (c.num_households_successful ?? 0),
      numHouseholdsVisited:
        acc.numHouseholdsVisited + (c.num_households_visited ?? 0),
      numSuccessfulVisits: acc.numSuccessfulVisits + c.num_successful_visits,
      numVisits: acc.numVisits + c.num_visits,
    }),
    {
      numHouseholds: 0,
      numHouseholdsSuccessful: 0,
      numHouseholdsVisited: 0,
      numSuccessfulVisits: 0,
      numVisits: 0,
    }
  ) || {
    numHouseholds: 0,
    numHouseholdsSuccessful: 0,
    numHouseholdsVisited: 0,
    numSuccessfulVisits: 0,
    numVisits: 0,
  };

  return (
    <Box
      sx={(theme) => ({
        background:
          theme.palette.mode === 'dark'
            ? theme.palette.grey[800]
            : `linear-gradient(90deg, ${theme.palette.grey[300]} 0, white 2rem)`,
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
      <Box sx={{ mx: 1 }}>
        <Typography variant="h6">{selectedArea.title}</Typography>
      </Box>
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
          <Typography variant="h5">{numHouseholds}</Typography>
        </Box>
        <Box gridColumn="span 2">
          <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
        </Box>
        {assignment.reporting_level == 'location' && (
          <>
            <Box>
              <Typography variant="body1">
                <Msg id={messageIds.sidebar.progress.header.visits} />
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h5">{numVisits}</Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                <Msg id={messageIds.sidebar.progress.header.successfulVisits} />
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h5">{numSuccessfulVisits}</Typography>
            </Box>
            <Box gridColumn="span 2">
              <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
            </Box>
          </>
        )}

        {assignment.reporting_level == 'household' && (
          <>
            <Box>
              <Typography variant="body1">
                <Msg
                  id={messageIds.sidebar.progress.header.householdsVisited}
                />
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h5">{numHouseholdsVisited}</Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                <Msg
                  id={messageIds.sidebar.progress.header.householdsSuccessful}
                />
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h5">{numHouseholdsSuccessful}</Typography>
            </Box>
            <Box gridColumn="span 2">
              <Divider sx={(theme) => ({ bgcolor: theme.palette.grey[100] })} />
            </Box>
          </>
        )}
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
