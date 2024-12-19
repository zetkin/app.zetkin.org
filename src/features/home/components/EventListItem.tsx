import { FC, ReactNode } from 'react';
import { Box, Button, Fade, Typography } from '@mui/material';
import {
  Event,
  GroupWorkOutlined,
  LocationOnOutlined,
  WatchLaterOutlined,
} from '@mui/icons-material';

import MyActivityListItem from './MyActivityListItem';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinEventWithStatus } from '../types';
import useEventActions from '../hooks/useEventActions';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import { removeOffset } from 'utils/dateUtils';

type Props = {
  event: ZetkinEventWithStatus;
  showIcon?: boolean;
};

const EventListItem: FC<Props> = ({ event, showIcon = false }) => {
  const messages = useMessages(messageIds);
  const { signUp, undoSignup } = useEventActions(
    event.organization.id,
    event.id
  );

  const actions: ReactNode[] = [];
  if (event.status == 'booked') {
    actions.push(
      <Typography key="booked" variant="body2">
        <Msg
          id={messageIds.activityList.eventStatus.booked}
          values={{ org: event.organization.title }}
        />
      </Typography>
    );
  } else if (event.status == 'signedUp') {
    actions.push(
      <Button
        key="action"
        onClick={() => undoSignup()}
        size="small"
        variant="outlined"
      >
        <Msg id={messageIds.activityList.actions.undoSignup} />
      </Button>,
      <Fade appear in style={{ transitionDelay: '0.3s' }}>
        <Box
          key="signedUp"
          sx={{
            bgcolor: '#C1EEC1',
            borderRadius: 4,
            color: '#080',
            px: 1,
            py: 0.3,
          }}
        >
          <Typography variant="body2">
            <Msg id={messageIds.activityList.eventStatus.signedUp} />
          </Typography>
        </Box>
      </Fade>
    );
  } else {
    actions.push(
      <Button
        key="action"
        onClick={() => signUp()}
        size="small"
        variant="contained"
      >
        <Msg id={messageIds.activityList.actions.signUp} />
      </Button>
    );

    if (event.num_participants_available < event.num_participants_required) {
      actions.push(
        <Box
          key="needed"
          sx={{
            bgcolor: '#FFE5C1',
            borderRadius: 4,
            color: '#f40',
            px: 1,
            py: 0.3,
          }}
        >
          <Typography variant="body2">
            <Msg id={messageIds.activityList.eventStatus.needed} />
          </Typography>
        </Box>
      );
    }
  }

  return (
    <MyActivityListItem
      actions={actions}
      Icon={showIcon ? Event : null}
      image={event.cover_file?.url}
      info={[
        {
          Icon: GroupWorkOutlined,
          labels: [event.campaign?.title, event.organization.title],
        },
        {
          Icon: WatchLaterOutlined,
          labels: [
            <Typography key={`event-time-${event.id}`} variant="body2">
              <ZUITimeSpan
                end={new Date(removeOffset(event.end_time))}
                start={new Date(removeOffset(event.start_time))}
              />
            </Typography>,
          ],
        },
        {
          Icon: LocationOnOutlined,
          labels: [
            event.location?.title || messages.defaultTitles.noLocation(),
          ],
        },
      ]}
      title={
        event.title || event.activity?.title || messages.defaultTitles.event()
      }
    />
  );
};

export default EventListItem;
