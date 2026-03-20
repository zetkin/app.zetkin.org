import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

import { ZetkinArea } from 'features/areas/types';

type Props = {
  areas: ZetkinArea[];
};

type AreaStatsData = {
  area_id: number;
  num_households: number;
  num_households_successfully_visited: number;
  num_households_visited: number;
  num_locations: number;
  num_locations_visited: number;
  num_successfull_visits: number;
};

const AreaStats: FC<Props> = ({ areas }) => {
  const [stats, setStats] = useState<AreaStatsData | null>(null);

  useEffect(() => {
    if (areas.length == 0) {
      return;
    }

    const areaId = areas[0].id;

    fetch(`/areaAssignmentStats/${areaId}.json`)
      .then((res) => res.json())
      .then((data: AreaStatsData) => {
        // eslint-disable-next-line no-console
        console.log('Fetched area stats:', data);
        setStats(data);
      });
  }, [areas]);

  if (!stats) {
    return <Typography>No stats for this area yet</Typography>;
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
