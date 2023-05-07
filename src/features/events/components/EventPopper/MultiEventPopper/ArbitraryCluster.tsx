import { FC } from 'react';
import { Box, Divider } from '@mui/material';

import { CLUSTER_TYPE } from 'features/campaigns/hooks/useClusteredActivities';
import ClusterBody from './ClusterBody';
import MultiEventListItem from './MultiEventListItem';
import { ZetkinEvent } from 'utils/types/zetkin';

interface ArbitraryClusterProps {
  events: ZetkinEvent[];
  onEventClick: (id: number) => void;
}

const ArbitraryCluster: FC<ArbitraryClusterProps> = ({
  events,
  onEventClick,
}) => {
  return (
    <Box>
      <ClusterBody clusterType={CLUSTER_TYPE.ARBITRARY} events={events} />
      <Divider />
      <Box paddingTop={1}>
        {events.map((event) => {
          return (
            <MultiEventListItem
              key={event.id}
              clusterType={CLUSTER_TYPE.ARBITRARY}
              event={event}
              onEventClick={(id: number) => onEventClick(id)}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ArbitraryCluster;
