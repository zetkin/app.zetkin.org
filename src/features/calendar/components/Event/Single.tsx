import { FC } from 'react';

import { fieldsToPresent } from './utils';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import Event, { Field } from '.';

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
      message: event.location.title,
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
    event.contact
      ? null
      : {
          kind: 'NoContactSelected',
          message: <Msg id={messageIds.event.noContactSelected} />,
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
  width: number;
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

  return (
    <Event
      cancelled={Boolean(event?.cancelled)}
      fieldGroups={[fields]}
      height={height}
      title={event.title || ''}
      width={width}
    />
  );
};

export default Single;
