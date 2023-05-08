import { FC } from 'react';
import { ScheduleOutlined } from '@mui/icons-material';

import { fieldsToPresent } from './utils';
import TopBadge from './TopBadge';
import { ZetkinEvent } from 'utils/types/zetkin';
import Event, { Field } from '.';

function createMultiLocationFields(props: MultiLocationProps): Field[] {
  const totalRequiredParticipants: number = props.events.reduce(
    (acc, curr) => acc + curr.num_participants_required,
    0
  );
  const totalAvailableParticipants: number = props.events.reduce(
    (acc, curr) => acc + curr.num_participants_available,
    0
  );
  const noContactSelected = props.events.some((event) => !event?.contact);

  const fields: (Field | null)[] = [
    {
      kind: 'Participants',
      message: `${totalAvailableParticipants} / ${totalRequiredParticipants}`,
      requiresAction: totalRequiredParticipants > totalAvailableParticipants,
    },
    {
      kind: 'Location',
      message: `${props.events.length} different locations`,
      requiresAction: false,
    },
    props.remindersNotSent
      ? {
          kind: 'RemindersNotSent',
          message: `${props.remindersNotSent} reminders not sent`,
          requiresAction: true,
        }
      : null,
    props.unbookedSignups
      ? {
          kind: 'UnbookedSignups',
          message: `${props.unbookedSignups} unbooked signups`,
          requiresAction: true,
        }
      : null,
    noContactSelected
      ? {
          kind: 'NoContactSelected',
          message: 'No contact selected',
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
}

const MultiLocation: FC<MultiLocationProps> = ({
  events,
  height,
  remindersNotSent,
  unbookedSignups,
}) => {
  const fields = fieldsToPresent(
    createMultiLocationFields({
      events,
      height,
      remindersNotSent,
      unbookedSignups,
    }),
    height
  );
  const firstEventTitle = events[0].title;
  const anyEventIsCancelled = events.some((event) => event?.cancelled);

  return (
    <Event
      cancelled={anyEventIsCancelled}
      fieldGroups={[fields]}
      height={height}
      title={firstEventTitle || ''}
      topBadge={
        <TopBadge
          icon={<ScheduleOutlined color="inherit" fontSize="inherit" />}
          text={events.length.toString()}
        />
      }
    />
  );
};

export default MultiLocation;
