import { FC } from 'react';
import { Box, Divider } from '@mui/material';

import ClusterBody from './ClusterBody';
import { ZetkinEvent } from 'utils/types/zetkin';
import MultiEventListItem, { CLUSTER_TYPE } from './MultiEventListItem';

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
              compact={false}
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
