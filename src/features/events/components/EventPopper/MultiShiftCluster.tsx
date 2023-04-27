import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import ClusterBody from './ClusterBody';
import EventDataModel from 'features/events/models/EventDataModel';
import StatusDot from './StatusDot';
import useModel from 'core/useModel';
import { ZetkinEvent } from 'utils/types/zetkin';
import MultiEventListItem, { CLUSTER_TYPE } from './MultiEventListItem';

interface MultiShiftClusterProps {
  events: ZetkinEvent[];
  onEventClick: (id: number) => void;
}

const MultiShiftCluster: FC<MultiShiftClusterProps> = ({
  events,
  onEventClick,
}) => {
  const model = useModel(
    (env) => new EventDataModel(env, events[0].organization.id, events[0].id)
  );

  return (
    <Box>
      <Typography variant="h5">
        {events[0].title || events[0].activity.title}
      </Typography>
      <Box alignItems="center" display="flex">
        <StatusDot state={model.state} />
        <Typography color="secondary">{events[0].activity.title}</Typography>
      </Box>
      <ClusterBody clusterType={CLUSTER_TYPE.SHIFT} events={events} />
      <Divider />
      <Box paddingTop={1}>
        {events.map((event) => {
          return (
            <MultiEventListItem
              key={event.id}
              clusterType={CLUSTER_TYPE.SHIFT}
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

export default MultiShiftCluster;
