import { FC } from 'react';

import calendarMessageIds from 'features/calendar/l10n/messageIds';
import eventMessageIds from 'features/events/l10n/messageIds';
import { fieldsToPresent } from './utils';
import LocationLabel from 'features/events/components/LocationLabel';
import { ZetkinEvent } from 'utils/types/zetkin';
import Event, { Field } from './Event';
import { Msg, useMessages } from 'core/i18n';

function createSingleFields({
  event,
  remindersNotSent,
  unbookedSignups,
}: SingleProps): Field[] {
  const fields: (Field | null)[] = [
    {
      kind: 'Participants',
      message: `${event.num_participants_available} / ${event.num_participants_required}`,
      requiresAction:
        event.num_participants_required > event.num_participants_available,
    },
    {
      kind: 'Location',
      message: <LocationLabel location={event.location} />,
      requiresAction: false,
    },
    remindersNotSent
      ? {
          kind: 'RemindersNotSent',
          message: (
            <Msg
              id={calendarMessageIds.event.remindersNotSent}
              values={{ numNotSent: remindersNotSent }}
            />
          ),
          requiresAction: true,
        }
      : null,
    unbookedSignups
      ? {
          kind: 'UnbookedSignups',
          message: (
            <Msg
              id={calendarMessageIds.event.unbookedSignups}
              values={{ numUnbooked: unbookedSignups }}
            />
          ),
          requiresAction: true,
        }
      : null,
    event.contact
      ? null
      : {
          kind: 'NoContactSelected',
          message: <Msg id={calendarMessageIds.event.noContactSelected} />,
          requiresAction: true,
        },
  ];

  return fields.filter((field): field is Field => {
    return field !== null;
  });
}

export interface SingleProps {
  event: ZetkinEvent;
  remindersNotSent: null | number;
  unbookedSignups: null | number;
  height: number;
  width: string;
}

const Single: FC<SingleProps> = ({
  event,
  height,
  remindersNotSent,
  unbookedSignups,
  width,
}) => {
  const fields = fieldsToPresent(
    createSingleFields({
      event,
      height,
      remindersNotSent,
      unbookedSignups,
      width,
    }),
    height
  );

  const messages = useMessages(eventMessageIds);
  const eventTitle =
    event.title || event.activity?.title || messages.common.noTitle();

  return (
    <Event
      cancelled={Boolean(event?.cancelled)}
      events={[event.id]}
      fieldGroups={[fields]}
      height={height}
      title={eventTitle}
      width={width}
    />
  );
};

export default Single;
