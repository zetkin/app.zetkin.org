import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

import { ZetkinCallTarget } from '../types';
import useEventCallActions from '../hooks/useEventCallActions';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import { removeOffset } from 'utils/dateUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { useAppSelector } from 'core/hooks';

interface TargetEventProps {
  event: ZetkinEvent;
  target: ZetkinCallTarget;
}

const TargetEvent: FC<TargetEventProps> = ({ event, target }) => {
  const { signUp, undoSignup } = useEventCallActions(
    event.organization.id,
    event.id,
    target.id
  );

  const targetIsBooked = target.future_actions.some(
    (futureEvent) => futureEvent.id === event.id
  );
  const eventList = useAppSelector(
    (state) => state.call.eventsByTargetId[target.id].items || []
  );

  const isSignup = eventList.some(
    (eventInList) =>
      eventInList.data?.status == 'signedUp' && eventInList.data.id == event.id
  );

  return (
    <Box m={2}>
      <Typography variant="h6">{event.title || 'Untitled event'}</Typography>
      <ZUITimeSpan
        end={new Date(removeOffset(event.end_time))}
        start={new Date(removeOffset(event.start_time))}
      />
      <Box mt={1}>
        {targetIsBooked ? (
          <Typography variant="body2">
            {target.first_name} is already booked
          </Typography>
        ) : (
          <Box>
            {isSignup ? (
              <Button onClick={undoSignup} size="small" variant="outlined">
                Undo Sign up
              </Button>
            ) : (
              <Button onClick={signUp} size="small" variant="contained">
                Sign up
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TargetEvent;
