import Link from 'next/link';
import { ListItem, ListItemText, Typography } from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIDateTime from 'zui/ZUIDateTime';

interface EventListItemProps {
  event: ZetkinEvent;
  hrefBase: string;
}

const EventListItem = ({
  event,
  hrefBase,
}: EventListItemProps): JSX.Element => {
  const { id, title, activity, location, start_time, end_time } = event;
  const messages = useMessages(messageIds);

  return (
    <Link href={hrefBase + `/calendar/events/${id}`} passHref>
      <ListItem button component="a">
        <ListItemText>
          <Typography component="h5" variant="body1">
            {title || activity?.title || messages.common.noTitle()}
          </Typography>
          <Typography color="textPrimary" variant="body2">
            <ZUIDateTime datetime={removeOffset(start_time)} />
            {` - `}
            <ZUIDateTime datetime={removeOffset(end_time)} />
          </Typography>
          {location && (
            <Typography color="textPrimary" variant="body2">
              {location.title}
            </Typography>
          )}
        </ListItemText>
      </ListItem>
    </Link>
  );
};

export default EventListItem;
