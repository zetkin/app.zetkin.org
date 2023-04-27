import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { EventState } from 'features/events/models/EventDataModel';
import StatusDot from '../StatusDot';
import { ZetkinEvent } from 'utils/types/zetkin';

interface ClusterHeaderProps {
  event: ZetkinEvent;
  state: EventState;
}

const ClusterHeader: FC<ClusterHeaderProps> = ({ event, state }) => {
  return (
    <>
      <Typography variant="h5">
        {event.title || event.activity.title}
      </Typography>
      <Box alignItems="center" display="flex">
        <StatusDot state={state} />
        <Typography color="secondary">{event.activity.title}</Typography>
      </Box>
    </>
  );
};

export default ClusterHeader;
