import { FC } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  AssignmentOutlined,
  EmailOutlined,
  EventOutlined,
  PhoneOutlined,
} from '@mui/icons-material';

import { SuborgLoadingError, SuborgResult, SuborgWithStats } from '../types';
import useOrganization from '../hooks/useOrganization';
import useSuborgsWithStats from '../hooks/useSuborgsWithStats';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';

export const isError = (result: SuborgResult): result is SuborgLoadingError => {
  return 'error' in result;
};

const SuborgListItem: FC<{ onSelect: () => void; suborg: SuborgWithStats }> = ({
  onSelect,
  suborg,
}) => {
  const themes = useEmailThemes(suborg.id).data || [];
  const configs = useEmailConfigs(suborg.id).data || [];
  const usesEmailFeature = configs.length > 0 && themes.length > 0;
  return (
    <Box
      onClick={() => onSelect()}
      sx={{
        alignContent: 'center',
        cursor: 'pointer',
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <Avatar alt="icon" src={`/api/orgs/${suborg.id}/avatar`} />
          <Typography variant="h5">{suborg.title}</Typography>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <Typography>{suborg.stats.numPeople}</Typography>
            <Typography color="secondary">people</Typography>
          </Box>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <Typography>{suborg.stats.numLists}</Typography>
            <Typography color="secondary">lists</Typography>
          </Box>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <Typography>{suborg.stats.numProjects}</Typography>
            <Typography color="secondary">projects</Typography>
          </Box>
        </Box>
      </Box>
      <Typography color="secondary">Activity in the past 30 days:</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <PhoneOutlined color="secondary" />
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <Typography>{suborg.stats.numCalls}</Typography>
            <Typography color="secondary">calls</Typography>
          </Box>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <AssignmentOutlined color="secondary" />
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <Typography>{suborg.stats.numSubmissions}</Typography>
            <Typography color="secondary">submissions</Typography>
          </Box>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <EventOutlined color="secondary" />
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <Typography>{suborg.stats.numEventParticipants}</Typography>
            <Typography color="secondary">participants in </Typography>
            <Typography>{suborg.stats.numEventsWithParticipants}</Typography>
            <Typography color="secondary">events</Typography>
          </Box>
        </Box>
        {usesEmailFeature && (
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <EmailOutlined color="secondary" />
            <Typography color="secondary">{`${suborg.stats.numEmailsSent} sent`}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const SuborgsList: FC<{
  onSelectSuborg: (suborgId: number) => void;
  orgId: number;
}> = ({ onSelectSuborg, orgId }) => {
  const organization = useOrganization(orgId).data;
  const suborgsWithStats = useSuborgsWithStats(orgId);

  if (suborgsWithStats.length == 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ZUIEmptyState
          message={
            organization ? `${organization.title} has no suborganizations` : ''
          }
        />
      </Box>
    );
  }

  return (
    <Paper>
      <Stack divider={<Divider />}>
        {suborgsWithStats.map((orgWithStats) => {
          if (isError(orgWithStats)) {
            if (orgWithStats.id == 'loadingError') {
              return (
                <Alert severity="error">{`Error loading suborg data`}</Alert>
              );
            }

            return (
              <Box
                sx={{
                  alignContent: 'center',
                  padding: 2,
                }}
              >
                <Alert severity="error">{`Error loading data for organization ${orgWithStats.id}`}</Alert>
              </Box>
            );
          }
          return (
            <SuborgListItem
              key={orgWithStats.id}
              onSelect={() => onSelectSuborg(orgWithStats.id)}
              suborg={orgWithStats}
            />
          );
        })}
      </Stack>
    </Paper>
  );
};

export default SuborgsList;
