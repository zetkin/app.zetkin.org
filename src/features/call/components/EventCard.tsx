import { FC } from 'react';
import { useIntl } from 'react-intl';
import {
  Event,
  GroupWorkOutlined,
  LocationOnOutlined,
  WatchLaterOutlined,
} from '@mui/icons-material';

import MyActivityListItem from 'features/home/components/MyActivityListItem';
import { timeSpanToString } from 'zui/utils/timeSpanString';
import { removeOffset } from 'utils/dateUtils';
import useEventCallActions from '../hooks/useEventCallActions';
import { useAppSelector } from 'core/hooks';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinCallTarget } from '../types';
import ZUISignUpChip from 'zui/components/ZUISignUpChip';

type EventCardProps = {
  event: ZetkinEvent;
  target: ZetkinCallTarget;
};

const EventCard: FC<EventCardProps> = ({ event, target }) => {
  const intl = useIntl();
  const { signUp, undoSignup } = useEventCallActions(
    event.organization.id,
    event.id,
    target.id
  );

  const isTargetBooked = target.future_actions.some(
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
    <MyActivityListItem
      actions={
        isTargetBooked
          ? [
              <ZUIText key={event.id}>
                {`${target.first_name} is already booked.`}{' '}
              </ZUIText>,
            ]
          : [
              <>
                <ZUIButton
                  key={event.id}
                  label={isSignup ? 'Undo sign up' : 'Sign up'}
                  onClick={() => (isSignup ? undoSignup() : signUp())}
                  variant="primary"
                />
                {event.num_participants_available <
                  event.num_participants_required &&
                  !isSignup && <ZUISignUpChip status="needed" />}
                {isSignup && <ZUISignUpChip status="signedUp" />}
              </>,
            ]
      }
      iconTitle={Event}
      image={event.cover_file?.url}
      info={[
        {
          Icon: GroupWorkOutlined,
          labels: [
            event.campaign?.title ?? 'Untitled project',
            event.organization.title,
          ],
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
          labels: [event.location?.title ?? 'No location'],
        },
      ]}
      title={event.title || event.activity?.title || 'Untitled event'}
    />
  );
};

export default EventCard;
