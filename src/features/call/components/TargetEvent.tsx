import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

import { ZetkinCallTarget } from '../types';
import useEventCallActions from '../hooks/useEventCallActions';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import { removeOffset } from 'utils/dateUtils';
import { ZetkinEvent } from 'utils/types/zetkin';

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

  const responses = target.action_responses;
  const futureEvents = target.future_actions;

  return (
    <Box m={2}>
      <Typography variant="h6">{event.title || 'Untitled event'}</Typography>
      <ZUITimeSpan
        end={new Date(removeOffset(event.end_time))}
        start={new Date(removeOffset(event.start_time))}
      />
      <Box>
        {futureEvents.some((futureEvent) => futureEvent.id === event.id) && (
          <Typography key="booked" variant="body2">
            {target.first_name} is already booked
          </Typography>
        )}
        {responses.some((response) => response.action_id == event.id) && (
          <Box>
            <Typography>{target.first_name} is signed up</Typography>
            <Button onClick={() => undoSignup()}>Undo Sign-up</Button>
          </Box>
        )}
        {!responses.some((response) => response.action_id === event.id) &&
          !futureEvents.some((futureEvent) => futureEvent.id === event.id) && (
            <Button
              key="action"
              onClick={() => signUp()}
              size="small"
              variant="contained"
            >
              Sign Up
            </Button>
          )}
      </Box>
    </Box>
  );
};

export default TargetEvent;
