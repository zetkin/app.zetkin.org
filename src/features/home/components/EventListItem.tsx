import { FC, ReactNode } from 'react';
import { FormattedTime } from 'react-intl';
import { Button } from '@mui/material';
import {
  Event,
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
        <Msg id={messageIds.actions.undoSignup} />
      </Button>
    );
  } else {
    actions.push(
      <Button
        key="action"
        onClick={() => signUp()}
        size="small"
        variant="contained"
      >
        <Msg id={messageIds.actions.signUp} />
      </Button>
    );
  }

  return (
    <MyActivityListItem
      actions={actions}
      Icon={Event}
      image={event.cover_file?.url}
      info={[
        {
          Icon: WatchLaterOutlined,
          labels: [
            <ZUIDate key="date" datetime={event.start_time} />,
            <FormattedTime key="time" value={event.start_time} />,
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
