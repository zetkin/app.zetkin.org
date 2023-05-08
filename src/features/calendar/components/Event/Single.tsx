import { FC } from 'react';

import { fieldsToPresent } from './utils';
import { ZetkinEvent } from 'utils/types/zetkin';
import Event, { Field } from '.';

function createSingleFields(props: SingleProps): Field[] {
  const fields: (Field | null)[] = [
    {
      kind: 'Participants',
      message: `${props.event.num_participants_available} / ${props.event.num_participants_required}`,
      requiresAction:
        props.event.num_participants_required >
        props.event.num_participants_available,
    },
    {
      kind: 'Location',
      message: props.event.location.title,
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
    props.event?.contact
      ? null
      : {
          kind: 'NoContactSelected',
          message: 'No contact selected',
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
}

const Single: FC<SingleProps> = ({
  event,
  height,
  remindersNotSent,
  unbookedSignups,
}) => {
  const fields = fieldsToPresent(
    createSingleFields({ event, height, remindersNotSent, unbookedSignups }),
    height
  );

  return (
    <Event
      cancelled={Boolean(event?.cancelled)}
      fieldGroups={[fields]}
      height={height}
      title={event.title || ''}
    />
  );
};

export default Single;
