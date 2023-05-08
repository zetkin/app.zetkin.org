import { FC } from 'react';
import { ScheduleOutlined } from '@mui/icons-material';

import TopBadge from './TopBadge';
import { ZetkinEvent } from 'utils/types/zetkin';
import { availableHeightByEvent, fieldsToPresent } from './utils';
import Event, { Field, FIELD_PRESENTATION } from '.';

function createMultiShiftFieldGroups(props: MultiShiftProps): Field[][] {
  const fieldGroups: Field[][] = props.events.map((event, index) => {
    const isFirstEvent = index === 0;
    let fields: (null | Field)[] = [];

    if (isFirstEvent) {
      fields = [
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
        event?.contact
          ? null
          : {
              kind: 'NoContactSelected',
              message: 'No contact selected',
              requiresAction: true,
            },
      ];
    } else {
      const scheduledTime = `${event.start_time} / ${event.end_time}`;

      fields = [
        {
          kind: 'Participants',
          message: `${event.num_participants_available} / ${event.num_participants_required}`,
          requiresAction:
            event.num_participants_required > event.num_participants_available,
        },
        {
          kind: 'ScheduledTime',
          message: scheduledTime,
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
        event?.contact
          ? null
          : {
              kind: 'NoContactSelected',
              message: 'No contact selected',
              requiresAction: true,
            },
      ];
    }

    return fields.filter((field): field is Field => {
      return field !== null;
    });
  });

  return fieldGroups;
}

export interface MultiShiftProps {
  events: ZetkinEvent[];
  remindersNotSent: null | number;
  unbookedSignups: null | number;
  height: number;
}

const MultiShift: FC<MultiShiftProps> = ({
  events,
  height,
  remindersNotSent,
  unbookedSignups,
}) => {
  const firstEventTitle = events[0].title;
  const anyEventIsCancelled = events.some((event) => event?.cancelled);
  const availableHeightPerFieldGroup = availableHeightByEvent(
    height,
    events.length
  );

  const fieldGroups = createMultiShiftFieldGroups({
    events,
    height,
    remindersNotSent,
    unbookedSignups,
  }).map((group, groupIndex) => {
    return fieldsToPresent(group, availableHeightPerFieldGroup[groupIndex]).map(
      (field) => {
        const fieldShouldBeCollapsed =
          field.requiresAction && field.kind !== 'Participants';

        return fieldShouldBeCollapsed
          ? { ...field, presentation: FIELD_PRESENTATION.ICON_ONLY }
          : field;
      }
    );
  });

  return (
    <Event
      cancelled={anyEventIsCancelled}
      fieldGroups={fieldGroups}
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

export default MultiShift;
