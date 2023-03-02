import React from 'react';
import { Card, Divider, ListItem, ListItemText } from '@mui/material';

import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIList from 'zui/ZUIList';

import EventListItem from './EventListItem';
import { Msg, useMessages } from 'core/i18n';

import messageIds from 'features/events/l10n/messageIds';

interface EventListProps {
  hrefBase: string;
  events: ZetkinEvent[];
}

const EventList = ({ hrefBase, events }: EventListProps): JSX.Element => {
  const messages = useMessages(messageIds);

  return (
    <Card>
      <ZUIList aria-label={messages.list.events()} initialLength={5}>
        {events.length === 0 ? (
          <ListItem>
            <ListItemText>
              <Msg id={messageIds.list.noEvents} />
            </ListItemText>
          </ListItem>
        ) : (
          events.map((event, index) => (
            <React.Fragment key={index}>
              <EventListItem key={event.id} event={event} hrefBase={hrefBase} />
              {
                // Show divider under all items except last
                index !== events.length - 1 && <Divider />
              }
            </React.Fragment>
          ))
        )}
      </ZUIList>
    </Card>
  );
};

export default EventList;
