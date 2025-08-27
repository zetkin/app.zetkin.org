import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { ZetkinAreaAssignment } from '../types';
import useLocations from '../hooks/useLocations';
import { Msg } from 'core/i18n';
import areaAssignmentMessageIds from '../l10n/messageIds';

type AreaStatsProps = {
  assignment: ZetkinAreaAssignment;
  selectedArea: number;
};

const AreaStats: FC<AreaStatsProps> = ({ assignment, selectedArea }) => {
  const locationsInArea =
    useLocations(assignment.organization_id, assignment.id, selectedArea)
      .data ?? [];

  const { totalVisited, totalHouseholds } = locationsInArea?.reduce(
    (acc, location) => {
      acc.totalHouseholds += location.num_known_households ?? 0;
      acc.totalVisited += location.num_visits ?? 0;
      return acc;
    },
    { totalHouseholds: 0, totalVisited: 0 }
  ) ?? { totalHouseholds: 0, totalVisited: 0 };

  return (
    <>
      <Box alignItems="start" display="flex" flexDirection="column" gap={1}>
        <Box alignItems="center" display="flex">
          <Typography
            color="secondary"
            sx={(theme) => ({ color: theme.palette.primary.main })}
            variant="h5"
          >
            {totalVisited || 0}
          </Typography>
          <Typography color="secondary" ml={0.5} variant="h5">
            / {totalHouseholds}
          </Typography>
        </Box>
        <Typography color="secondary" textAlign="center" variant="caption">
          <Msg
            id={areaAssignmentMessageIds.map.areaInfo.stats.households}
            values={{ numHouseholds: totalHouseholds }}
          />
        </Typography>
      </Box>
      <Box alignItems="start" display="flex" flexDirection="column" gap={1}>
        <Typography color="secondary" variant="h5">
          {locationsInArea.length}
        </Typography>
        <Typography color="secondary" textAlign="center" variant="caption">
          <Msg
            id={areaAssignmentMessageIds.map.areaInfo.stats.locations}
            values={{ numLocations: locationsInArea.length || 0 }}
          />
        </Typography>
      </Box>
    </>
  );
};

export default AreaStats;
