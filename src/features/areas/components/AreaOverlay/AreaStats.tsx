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
  const { getAreaStats } = useAreaStats();
  const stats = getAreaStats(areaId);

  if (!stats) {
    return null;
  }

  const percentVisited = stats.count_locations
    ? Math.round(
        (stats.count_unique_locations_visited / stats.count_locations) * 10000
      ) / 100
    : 0;

  const percentSuccessfulVisits =
    stats.sum_visits > 0
      ? Math.round((stats.sum_successful_visits / stats.sum_visits) * 10000) /
        100
      : // If no visits
        0;

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
            {percentVisited}%
          </Typography>
          <Typography>
            <Msg id={messageIds.areas.assignmentStats.percentVisited} />
          </Typography>
        </Box>
        {percentSuccessfulVisits > 0 && (
          <Box>
            <Typography color="primary" variant="h5">
              {percentSuccessfulVisits}%
            </Typography>
            <Typography>
              <Msg
                id={messageIds.areas.assignmentStats.percentSuccessfulVisits}
              />
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AreaStats;
