import { FC } from 'react';
import { useIntl } from 'react-intl';
import {
  Event,
  GroupWorkOutlined,
  LocationOnOutlined,
  WatchLaterOutlined,
} from '@mui/icons-material';

import MyActivityListItem from 'features/my/components/MyActivityListItem';
import { timeSpanToString } from 'zui/utils/timeSpanString';
import { removeOffset } from 'utils/dateUtils';
import useEventCallActions from '../hooks/useEventCallActions';
import { useAppSelector } from 'core/hooks';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinCallTarget } from '../types';
import ZUISignUpChip from 'zui/components/ZUISignUpChip';
import messageIds from '../l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

type EventCardProps = {
  event: ZetkinEvent;
  target: ZetkinCallTarget;
};

const EventCard: FC<EventCardProps> = ({ event, target }) => {
  const messages = useMessages(messageIds);
  const intl = useIntl();
  const { signUp, undoSignup } = useEventCallActions(
    event.organization.id,
    event.id,
    target.id
  );

  const isTargetBooked = target.future_actions.some(
    (futureEvent) => futureEvent.id === event.id
  );

  const idsOfEventsRespondedTo = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].respondedEventIds
  );
  const isSignedUp = idsOfEventsRespondedTo.includes(event.id);

  return (
    <MyActivityListItem
      actions={
        isTargetBooked
          ? [
              <ZUIText key={event.id}>
                <Msg
                  id={messageIds.activities.events.alreadyBooked}
                  values={{ name: target.first_name }}
                />
              </ZUIText>,
            ]
          : [
              <>
                <ZUIButton
                  key={event.id}
                  label={
                    isSignedUp
                      ? messages.activities.events.undoSignUp()
                      : messages.activities.events.signUp()
                  }
                  onClick={() => (isSignedUp ? undoSignup() : signUp())}
                  variant="primary"
                />
                {event.num_participants_available <
                  event.num_participants_required &&
                  !isSignedUp && <ZUISignUpChip status="needed" />}
                {isSignedUp && (
                  <ZUISignUpChip name={target.first_name} status="signedUp" />
                )}
              </>,
            ]
      }
      iconTitle={Event}
      image={event.cover_file?.url}
      info={[
        {
          Icon: GroupWorkOutlined,
          key: 'project',
          labels: [
            event.campaign?.title ?? messages.activities.untitled.project(),
            event.organization.title,
          ],
        },
        {
          Icon: WatchLaterOutlined,
          key: 'time',
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
          key: 'location',
          labels: [
            event.location?.title ?? messages.activities.events.noLocation(),
          ],
        },
      ]}
      title={
        event.title ||
        event.activity?.title ||
        messages.activities.untitled.event()
      }
    />
  );
};

export default EventCard;
