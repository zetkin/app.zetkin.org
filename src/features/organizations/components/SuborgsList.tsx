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
  AssignmentTurnedIn,
  Email,
  EventOutlined,
  Group,
  Phone,
} from '@mui/icons-material';

import {
  SuborgLoadingError,
  SuborgWithFullStats,
  SuborgWithSimpleStats,
} from '../types';
import useOrganization from '../hooks/useOrganization';
import useSuborgsWithStats from '../hooks/useSuborgsWithStats';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';

export const isError = (
  result: SuborgWithSimpleStats | SuborgWithFullStats | SuborgLoadingError
): result is SuborgLoadingError => {
  return 'error' in result;
};

const SuborgListItem: FC<{
  onSelect: () => void;
  suborg: SuborgWithSimpleStats;
}> = ({ onSelect, suborg }) => {
  const themes = useEmailThemes(suborg.id).data || [];
  const configs = useEmailConfigs(suborg.id).data || [];
  const usesEmailFeature = configs.length > 0 && themes.length > 0;
  return (
    <Box
      onClick={() => onSelect()}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
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
          <Group color="secondary" />
          <Typography>{suborg.stats.numPeople}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
          <Phone color="secondary" />
          <Typography color="secondary">{suborg.stats.numCalls}</Typography>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
          <AssignmentTurnedIn color="secondary" />
          <Typography color="secondary">
            {suborg.stats.numSubmissions}
          </Typography>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
          <EventOutlined color="secondary" />
          <Typography color="secondary">
            {suborg.stats.numEventParticipants}
          </Typography>
        </Box>
        {usesEmailFeature && (
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
            <Email color="secondary" />
            <Typography color="secondary">
              {suborg.stats.numEmailsSent}
            </Typography>
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
    <Paper sx={{ padding: 2 }}>
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
