import { FC, ReactNode } from 'react';
import { FormattedTime } from 'react-intl';
import { Box, Button, Fade, Typography } from '@mui/material';
import {
  Event,
  GroupWorkOutlined,
  LocationOnOutlined,
  WatchLaterOutlined,
} from '@mui/icons-material';

import MyActivityListItem from './MyActivityListItem';
import ZUIDate from 'zui/ZUIDate';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinEventWithStatus } from '../types';
import useEventActions from '../hooks/useEventActions';

type Props = {
  event: ZetkinEventWithStatus;
};

const EventListItem: FC<Props> = ({ event }) => {
  const messages = useMessages(messageIds);
  const { signUp, undoSignup } = useEventActions(
    event.organization.id,
    event.id
  );

  const actions: ReactNode[] = [];
  if (event.status == 'booked') {
    // TODO: Add some kind of instructions on how to cancel
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
            <Msg id={messageIds.activityList.signedUp} />
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
            <Msg id={messageIds.activityList.needed} />
          </Typography>
        </Box>
      );
    }
  }

  return (
    <MyActivityListItem
      actions={actions}
      Icon={Event}
      image={event.cover_file?.url}
      info={[
        {
          Icon: GroupWorkOutlined,
          labels: [event.campaign?.title, event.organization.title],
        },
        {
          Icon: WatchLaterOutlined,
          labels: [
            <Typography key="date" variant="body2">
              <ZUIDate datetime={event.start_time} />
            </Typography>,
            <Typography key="time" variant="body2">
              <FormattedTime value={event.start_time} />
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
