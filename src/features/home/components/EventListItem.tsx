import { FC, MouseEvent, ReactNode } from 'react';
import { Box, Fade } from '@mui/material';
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
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';

type Props = {
  event: ZetkinEventWithStatus;
  onClickSignUp?: (ev: MouseEvent) => void;
  showIcon?: boolean;
};

const EventListItem: FC<Props> = ({
  event,
  onClickSignUp,
  showIcon = false,
}) => {
  const messages = useMessages(messageIds);
  const { requiresConnect, signUp, undoSignup } = useEventActions(
    event.organization.id,
    event.id
  );

  const actions: ReactNode[] = [];
  if (event.status == 'booked') {
    actions.push(
      <ZUIText key="booked" variant="bodySmRegular">
        <Msg
          id={messageIds.activityList.eventStatus.booked}
          values={{ org: event.organization.title }}
        />
      </ZUIText>
    );
  } else if (event.status == 'signedUp') {
    actions.push(
      <ZUIButton
        key="action"
        label={messages.activityList.actions.undoSignup()}
        onClick={() => undoSignup()}
        size="small"
        variant="secondary"
      />,
      <Fade key="signedUp" appear in style={{ transitionDelay: '0.3s' }}>
        <Box
          sx={{
            bgcolor: '#C1EEC1',
            borderRadius: 4,
            color: '#080',
            pointerEvents: 'none',
            px: 1,
            py: 0.3,
          }}
        >
          <ZUIText variant="bodySmRegular">
            <Msg id={messageIds.activityList.eventStatus.signedUp} />
          </ZUIText>
        </Box>
      </Fade>
    );
  } else {
    const label = requiresConnect
      ? messages.activityList.actions.connectAndSignUp()
      : messages.activityList.actions.signUp();

    actions.push(
      <ZUIButton
        key="action"
        label={label}
        onClick={(ev) => {
          if (onClickSignUp) {
            onClickSignUp(ev);
          }

          if (!ev.isDefaultPrevented()) {
            signUp();
          }
        }}
        size="small"
        variant="primary"
      />
    );

    if (event.num_participants_available < event.num_participants_required) {
      actions.push(
        <Box
          key="needed"
          sx={{
            bgcolor: '#FFE5C1',
            borderRadius: 4,
            color: '#f40',
            pointerEvents: 'none',
            px: 1,
            py: 0.3,
          }}
        >
          <ZUIText variant="bodySmRegular">
            <Msg id={messageIds.activityList.eventStatus.needed} />
          </ZUIText>
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
            <ZUIText
              key={`event-time-${event.id}`}
              noWrap
              variant="bodySmRegular"
            >
              <ZUITimeSpan
                end={new Date(removeOffset(event.end_time))}
                start={new Date(removeOffset(event.start_time))}
              />
            </ZUIText>,
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
