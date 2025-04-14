import { useIntl } from 'react-intl';
import { FC, MouseEvent, ReactNode } from 'react';
import { Box, Button, Fade, Typography } from '@mui/material';
import {
  GroupWorkOutlined,
  LocationOnOutlined,
  WatchLaterOutlined,
} from '@mui/icons-material';

import MyActivityListItem from './MyActivityListItem';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinEventWithStatus } from '../types';
import useEventActions from '../hooks/useEventActions';
import { removeOffset } from 'utils/dateUtils';
import { timeSpanToString } from 'zui/utils/timeSpanString';

type Props = {
  event: ZetkinEventWithStatus;
  onClickSignUp?: (ev: MouseEvent) => void;
};

const EventListItem: FC<Props> = ({ event, onClickSignUp }) => {
  const intl = useIntl();
  const messages = useMessages(messageIds);
  const { requiresConnect, signUp, undoSignup } = useEventActions(
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
      <Fade key="signedUp" appear in style={{ transitionDelay: '0.3s' }}>
        <Box
          sx={{
            bgcolor: '#C1EEC1',
            borderRadius: 4,
            color: '#080',
            px: 1,
            py: 0.3,
          }}
        >
          <Typography sx={{ pointerEvents: 'none' }} variant="body2">
            <Msg id={messageIds.activityList.eventStatus.signedUp} />
          </Typography>
        </Box>
      </Fade>
    );
  } else {
    const msgId = requiresConnect
      ? messageIds.activityList.actions.connectAndSignUp
      : messageIds.activityList.actions.signUp;

    actions.push(
      <Button
        key="action"
        onClick={(ev) => {
          if (onClickSignUp) {
            onClickSignUp(ev);
          }

          if (!ev.isDefaultPrevented()) {
            signUp();
          }
        }}
        size="small"
        variant="contained"
      >
        <Msg id={msgId} />
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
          <Typography sx={{ pointerEvents: 'none' }} variant="body2">
            <Msg id={messageIds.activityList.eventStatus.needed} />
          </Typography>
        </Box>
      );
    }
  }

  return (
    <MyActivityListItem
      actions={actions}
      image={event.cover_file?.url}
      info={[
        {
          Icon: GroupWorkOutlined,
          labels: [event.campaign?.title, event.organization.title].filter(
            (label) => !!label
          ) as string[],
        },
        {
          Icon: WatchLaterOutlined,
          labels: [
            timeSpanToString(
              new Date(removeOffset(event.start_time)),
              new Date(removeOffset(event.end_time)),
              intl
            ),
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
