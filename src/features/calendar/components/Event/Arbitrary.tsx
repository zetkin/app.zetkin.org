import { EventOutlined } from '@mui/icons-material';
import { FC } from 'react';

import { fieldsToPresent } from './utils';
import messageIds from 'features/calendar/l10n/messageIds';
import TopBadge from './TopBadge';
import { ZetkinEvent } from 'utils/types/zetkin';
import Event, { Field } from '.';
import { Msg, useMessages } from 'core/i18n';

export interface ArbitraryProps {
  events: ZetkinEvent[];
  height: number;
  remindersNotSent: null | number;
  eventsWithUnbookedSignups: null | number;
  width: string;
}

function createArbitraryFields({
  events,
  eventsWithUnbookedSignups,
  remindersNotSent,
}: ArbitraryProps): Field[] {
  const totalEventsWithoutContact = events.filter(
    (event) => !event.contact
  ).length;

  const totalUnderbookedEvents = events.filter(
    (event) =>
      event.num_participants_available < event.num_participants_required
  ).length;

  const fields: (Field | null)[] = [
    totalUnderbookedEvents > 0
      ? {
          kind: 'Participants',
          message: (
            <Msg
              id={messageIds.event.underbooked}
              values={{ numUnderbooked: totalUnderbookedEvents }}
            />
          ),
          requiresAction: true,
        }
      : null,
    remindersNotSent
      ? {
          kind: 'RemindersNotSent',
          message: (
            <Msg
              id={messageIds.event.remindersNotSent}
              values={{ numNotSent: remindersNotSent }}
            />
          ),
          requiresAction: true,
        }
      : null,
    eventsWithUnbookedSignups
      ? {
          kind: 'UnbookedSignups',
          message: (
            <Msg
              id={messageIds.event.withSignups}
              values={{ numWithSignups: eventsWithUnbookedSignups }}
            />
          ),
          requiresAction: true,
        }
      : null,
    totalEventsWithoutContact
      ? {
          kind: 'NoContactSelected',
          message: (
            <Msg
              id={messageIds.event.withoutContact}
              values={{ numWithoutContact: totalEventsWithoutContact }}
            />
          ),
          requiresAction: true,
        }
      : null,
  ];

  return fields.filter((field): field is Field => {
    return field !== null;
  });
}

const Arbitrary: FC<ArbitraryProps> = ({
  events,
  height,
  eventsWithUnbookedSignups,
  remindersNotSent,
  width,
}) => {
  const messages = useMessages(messageIds);
  const fields = fieldsToPresent(
    createArbitraryFields({
      events,
      eventsWithUnbookedSignups,
      height,
      remindersNotSent,
      width,
    }),
    height
  );
  const anyEventIsCancelled = events.some((event) => event.cancelled);

  return (
    <Event
      cancelled={anyEventIsCancelled}
      fieldGroups={[fields]}
      height={height}
      title={messages.event.events()}
      topBadge={
        <TopBadge
          cancelled={anyEventIsCancelled}
          icon={<EventOutlined color="inherit" fontSize="inherit" />}
          text={events.length.toString()}
        />
      }
      width={width}
    />
  );
};

export default Arbitrary;
