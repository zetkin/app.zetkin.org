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

import { SuborgError, SuborgResult } from '../types';
import useOrganization from '../hooks/useOrganization';
import useSuborgsWithStats from '../hooks/useSuborgsWithStats';
import ZUIEmptyState from 'zui/ZUIEmptyState';

export const isError = (result: SuborgResult): result is SuborgError => {
  return 'error' in result;
};

const SuborgsList: FC<{ orgId: number }> = ({ orgId }) => {
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
              return <Alert severity="error">{orgWithStats.message}</Alert>;
            }

            return (
              <Box
                sx={{
                  alignContent: 'center',
                  padding: 2,
                }}
              >
                <Alert severity="error">{orgWithStats.message}</Alert>
              </Box>
            );
          }
          return (
            <Box
              key={orgWithStats.id}
              sx={{
                alignContent: 'center',
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
                  <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
                  <Typography variant="h5">{orgWithStats.title}</Typography>
                </Box>
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                    <Typography>{orgWithStats.stats.numPeople}</Typography>
                    <Typography color="secondary">people</Typography>
                  </Box>
                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                    <Typography>{orgWithStats.stats.numLists}</Typography>
                    <Typography color="secondary">lists</Typography>
                  </Box>
                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                    <Typography>{orgWithStats.stats.numProjects}</Typography>
                    <Typography color="secondary">projects</Typography>
                  </Box>
                </Box>
              </Box>
              <Typography color="secondary">
                Activity in the past 30 days:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <PhoneOutlined color="secondary" />
                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                    <Typography>{orgWithStats.stats.numCalls}</Typography>
                    <Typography color="secondary">calls</Typography>
                  </Box>
                </Box>
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <AssignmentOutlined color="secondary" />
                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                    <Typography>{orgWithStats.stats.numSubmissions}</Typography>
                    <Typography color="secondary">submissions</Typography>
                  </Box>
                </Box>
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <EventOutlined color="secondary" />
                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                    <Typography>
                      {orgWithStats.stats.numEventParticipants}
                    </Typography>
                    <Typography color="secondary">participants in </Typography>
                    <Typography>
                      {orgWithStats.stats.numEventsWithParticipants}
                    </Typography>
                    <Typography color="secondary">events</Typography>
                  </Box>
                </Box>
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <EmailOutlined color="secondary" />
                  <Typography color="secondary">{`${orgWithStats.stats.numEmailsSent} sent`}</Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default SuborgsList;
