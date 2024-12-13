import { FC } from 'react';
import { FormattedTime } from 'react-intl';
import {
  Event,
  LocationOnOutlined,
  WatchLaterOutlined,
} from '@mui/icons-material';

import MyActivityListItem from './MyActivityListItem';
import ZUIDate from 'zui/ZUIDate';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinEvent } from 'utils/types/zetkin';

type Props = {
  event: ZetkinEvent;
};

const EventListItem: FC<Props> = ({ event }) => {
  const messages = useMessages(messageIds);
  return (
    <MyActivityListItem
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
