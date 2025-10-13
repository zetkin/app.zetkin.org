import { useIntl } from 'react-intl';
import { FC, MouseEvent } from 'react';
import {
  GroupWorkOutlined,
  LocationOnOutlined,
  WatchLaterOutlined,
} from '@mui/icons-material';

import MyActivityListItem from './MyActivityListItem';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinEventWithStatus } from '../types';
import { removeOffset } from 'utils/dateUtils';
import { timeSpanToString } from 'zui/utils/timeSpanString';
import { EventSignupButton } from './EventSignupButton';

type Props = {
  event: ZetkinEventWithStatus;
  href?: string;
  onClickSignUp?: (ev: MouseEvent) => void;
};

const EventListItem: FC<Props> = ({ event, href, onClickSignUp }) => {
  const intl = useIntl();
  const messages = useMessages(messageIds);

  const actions = [
    <EventSignupButton
      key="signup"
      event={event}
      onClickSignUp={onClickSignUp}
    />,
  ];

  return (
    <MyActivityListItem
      actions={actions}
      description={event.info_text}
      href={href}
      image={event.cover_file?.url}
      info={[
        {
          Icon: GroupWorkOutlined,
          labels: [
            event.campaign && {
              href: `/o/${event.organization.id}/projects/${event.campaign.id}`,
              text: event.campaign.title,
            },
            {
              href: `/o/${event.organization.id}/`,
              text: event.organization.title,
            },
          ].filter((label) => !!label) as string[],
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
            event.location
              ? {
                  href: `https://www.google.com/maps?q=${event.location.lat.toFixed(
                    4
                  )},${event.location.lng.toFixed(4)}(${encodeURIComponent(
                    event.location.title
                  )})`,
                  openNewTab: true,
                  text: event.location.title,
                }
              : messages.defaultTitles.noLocation(),
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
