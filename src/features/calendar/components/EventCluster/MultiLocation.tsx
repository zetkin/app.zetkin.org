import { FC } from 'react';

import calendarMessageIds from 'features/calendar/l10n/messageIds';
import eventMessageIds from 'features/events/l10n/messageIds';
import { fieldsToPresent } from './utils';
import MultiLocationIcon from 'zui/icons/MultiLocation';
import TopBadge from './TopBadge';
import { ZetkinEvent } from 'utils/types/zetkin';
import Event, { Field } from './Event';
import { Msg, useMessages } from 'core/i18n';

function createMultiLocationFields({
  events,
  unbookedSignups,
  remindersNotSent,
}: MultiLocationProps): Field[] {
  const totalRequiredParticipants: number = events.reduce(
    (acc, curr) => acc + curr.num_participants_required,
    0
  );
  const totalAvailableParticipants: number = events.reduce(
    (acc, curr) => acc + curr.num_participants_available,
    0
  );
  const noContactSelected = events.some((event) => !event?.contact);

  const fields: (Field | null)[] = [
    {
      kind: 'Participants',
      message: `${totalAvailableParticipants} / ${totalRequiredParticipants}`,
      requiresAction: totalRequiredParticipants > totalAvailableParticipants,
    },
    {
      kind: 'Location',
      message: (
        <Msg
          id={calendarMessageIds.event.differentLocations}
          values={{ numLocations: events.length }}
        />
      ),
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
    noContactSelected
      ? {
          kind: 'NoContactSelected',
          message: <Msg id={calendarMessageIds.event.noContactSelected} />,
          requiresAction: true,
        }
      : null,
  ];

  return fields.filter((field): field is Field => {
    return field !== null;
  });
}

export interface MultiLocationProps {
  events: ZetkinEvent[];
  height: number;
  remindersNotSent: null | number;
  showTopBadge: boolean;
  unbookedSignups: null | number;
  width: string;
}

const MultiLocation: FC<MultiLocationProps> = ({
  events,
  height,
  remindersNotSent,
  showTopBadge,
  unbookedSignups,
  width,
}) => {
  const fields = fieldsToPresent(
    createMultiLocationFields({
      events,
      height,
      remindersNotSent,
      showTopBadge,
      unbookedSignups,
      width,
    }),
    height
  );
  const messages = useMessages(eventMessageIds);
  const firstEventTitle =
    events[0].title || events[0].activity?.title || messages.common.noTitle();
  const anyEventIsCancelled = events.some((event) => event.cancelled);

  return (
    <Event
      cancelled={anyEventIsCancelled}
      events={events}
      fieldGroups={[fields]}
      height={height}
      title={firstEventTitle || ''}
      topBadge={
        showTopBadge && (
          <TopBadge
            cancelled={anyEventIsCancelled}
            icon={<MultiLocationIcon color="inherit" fontSize="inherit" />}
            text={events.length.toString()}
          />
        )
      }
      width={width}
    />
  );
};

export default MultiLocation;
