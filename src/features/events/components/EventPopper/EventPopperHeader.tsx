import { Box, Checkbox, Typography } from '@mui/material';

import { EventState } from 'features/events/models/EventDataModel';
import StatusDot from './StatusDot';
import { ZetkinEvent } from 'utils/types/zetkin';

interface EventPopperHeaderProps {
  event: ZetkinEvent;
  state: EventState;
}

function EventPopperHeader({ event, state }: EventPopperHeaderProps) {
  return (
    <>
      <Box alignItems="center" display="flex">
        <Checkbox size="medium" />
        <Typography variant="h5">
          {event.title || event.activity.title}
        </Typography>
      </Box>
      <Box alignItems="center" display="flex" sx={{ ml: 1 }}>
        <StatusDot state={state} />
        <Typography color="secondary" sx={{ ml: 1 }}>
          {event.activity.title}
        </Typography>
      </Box>
    </>
  );
}

export default EventPopperHeader;
