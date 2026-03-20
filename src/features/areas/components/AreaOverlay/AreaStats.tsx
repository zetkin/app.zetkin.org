import { FC } from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

import useAreaStats from 'features/areas/hooks/useAreaStats';

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
    <Box padding={2}>
      <Typography variant="h6">Area Stats (ID: {stats.area_id})</Typography>
      <Typography>Households: {stats.num_households}</Typography>
      <Typography>Locations: {stats.num_locations}</Typography>
      <Typography>Sucessfull visits: {stats.num_successfull_visits}</Typography>
      <Typography>
        {Math.round(
          (stats.num_households_visited /
            stats.num_households_successfully_visited) *
            100
        )}
        % of households succesfully visited
      </Typography>
      <Typography>
        {Math.round((stats.num_locations_visited / stats.num_locations) * 100)}%
        of locations visited
      </Typography>
    </Box>
  );
};

export default AreaStats;
