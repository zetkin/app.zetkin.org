import { FC } from 'react';
import { Box } from '@mui/system';
import { Divider, Typography } from '@mui/material';

import useAreaStats from 'features/areas/hooks/useAreaStats';
import { Msg } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';

type Props = {
  areaId: number;
};

const AreaStats: FC<Props> = ({ areaId }) => {
  const getAreaStats = useAreaStats();
  const stats = getAreaStats(areaId);

  if (!stats) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingTop: 2 }}
      >
        <Typography variant="h6">
          <Msg id={messageIds.areas.areaDetails.title} />
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ width: '50%' }}>
            <Typography color="primary" variant="h5">
              {stats.count_locations}
            </Typography>
            <Typography>
              <Msg id={messageIds.areas.areaDetails.locations} />
            </Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography color="primary" variant="h5">
              {stats.count_households}
            </Typography>
            <Typography>
              <Msg id={messageIds.areas.areaDetails.households} />
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider flexItem />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography variant="h6">
          <Msg id={messageIds.areas.assignmentStats.title} />
        </Typography>
        <Box>
          <Typography color="primary" variant="h5">
            {stats.sum_successful_visits}
          </Typography>
          <Typography>
            <Msg id={messageIds.areas.assignmentStats.successfulVisits} />
          </Typography>
        </Box>
        <Box>
          <Typography color="primary" variant="h5">
            {Math.round(
              (stats.count_unique_locations_visited / stats.count_locations) *
                100
            ) / 100}
            %
          </Typography>
          <Typography>
            <Msg id={messageIds.areas.assignmentStats.percentVisited} />
          </Typography>
        </Box>
        {stats.count_unique_households_visited > 0 && (
          <Box>
            <Typography color="primary" variant="h5">
              {Math.round(
                (stats.count_unique_households_visited +
                  stats.count_unique_locations_visited /
                    stats.sum_successful_visits) *
                  100
              ) / 100}
              %
            </Typography>
            <Typography>
              <Msg
                id={
                  messageIds.areas.assignmentStats
                    .percentSuccessfulHouseholdVisits
                }
              />
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AreaStats;
