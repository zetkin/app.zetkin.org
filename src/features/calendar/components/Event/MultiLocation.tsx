import { FC } from 'react';
import { ScheduleOutlined } from '@mui/icons-material';

import { fieldsToPresent } from './utils';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import TopBadge from './TopBadge';
import { ZetkinEvent } from 'utils/types/zetkin';
import Event, { Field } from '.';

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
          id={messageIds.event.differentLocations}
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
              id={messageIds.event.remindersNotSent}
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
              id={messageIds.event.unbookedSignups}
              values={{ numUnbooked: unbookedSignups }}
            />
          ),
          requiresAction: true,
        }
      : null,
    noContactSelected
      ? {
          kind: 'NoContactSelected',
          message: <Msg id={messageIds.event.noContactSelected} />,
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
  unbookedSignups: null | number;
  width: string;
}

const MultiLocation: FC<MultiLocationProps> = ({
  events,
  height,
  remindersNotSent,
  unbookedSignups,
  width,
}) => {
  const fields = fieldsToPresent(
    createMultiLocationFields({
      events,
      height,
      remindersNotSent,
      unbookedSignups,
      width,
    }),
    height
  );
  const firstEventTitle = events[0].title || events[0].activity.title;
  const anyEventIsCancelled = events.some((event) => event.cancelled);

  return (
    <Event
      cancelled={anyEventIsCancelled}
      fieldGroups={[fields]}
      height={height}
      title={firstEventTitle || ''}
      topBadge={
        <TopBadge
          cancelled={anyEventIsCancelled}
          icon={<ScheduleOutlined color="inherit" fontSize="inherit" />}
          text={events.length.toString()}
        />
      }
      width={width}
    />
  );
};

export default MultiLocation;
