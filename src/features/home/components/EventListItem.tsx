import { useIntl } from 'react-intl';
import { FC, MouseEvent } from 'react';
import { Fade } from '@mui/material';
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
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import ZUISignUpChip from 'zui/components/ZUISignUpChip';

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

  const actions: JSX.Element[] = [];
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
        size="large"
        variant="secondary"
      />,
      <Fade key="signedUp" appear in style={{ transitionDelay: '0.3s' }}>
        <span>
          <ZUISignUpChip status="signedUp" />
        </span>
      </Fade>
    );
  } else {
    const buttonLabel = requiresConnect
      ? messages.activityList.actions.connectAndSignUp()
      : messages.activityList.actions.signUp();

    actions.push(
      <ZUIButton
        key="action"
        label={buttonLabel}
        onClick={(ev) => {
          if (onClickSignUp) {
            onClickSignUp(ev);
          }

          if (!ev.isDefaultPrevented()) {
            signUp();
          }
        }}
        size="large"
        variant="primary"
      />
    );

    if (event.num_participants_available < event.num_participants_required) {
      actions.push(<ZUISignUpChip status="needed" />);
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
