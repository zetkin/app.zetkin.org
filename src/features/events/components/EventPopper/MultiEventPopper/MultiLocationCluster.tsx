import { FC } from 'react';
import { Box, Divider } from '@mui/material';

import { CLUSTER_TYPE } from 'features/campaigns/hooks/useClusteredActivities';
import ClusterBody from './ClusterBody';
import ClusterHeader from './ClusterHeader';
import EventDataModel from 'features/events/models/EventDataModel';
import MultiEventListItem from './MultiEventListItem';
import useModel from 'core/useModel';
import { ZetkinEvent } from 'utils/types/zetkin';

interface MultiLocationClusterProps {
  events: ZetkinEvent[];
  onEventClick: (id: number) => void;
}

const MultiLocationCluster: FC<MultiLocationClusterProps> = ({
  events,
  onEventClick,
}) => {
  const model = useModel(
    (env) => new EventDataModel(env, events[0].organization.id, events[0].id)
  );

  return (
    <Box>
      <ClusterHeader event={events[0]} state={model.state} />
      <ClusterBody clusterType={CLUSTER_TYPE.MULTI_LOCATION} events={events} />
      <Divider />
      <Box paddingTop={1}>
        {events.map((event) => {
          return (
            <MultiEventListItem
              key={event.id}
              clusterType={CLUSTER_TYPE.MULTI_LOCATION}
              event={event}
              onEventClick={(id: number) => onEventClick(id)}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default MultiLocationCluster;
