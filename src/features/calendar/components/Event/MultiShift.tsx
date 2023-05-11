import { FC } from 'react';
import { FormattedTime } from 'react-intl';
import { ScheduleOutlined } from '@mui/icons-material';

import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import TopBadge from './TopBadge';
import { ZetkinEvent } from 'utils/types/zetkin';
import { availableHeightByEvent, fieldsToPresent } from './utils';
import Event, { Field, FIELD_PRESENTATION } from '.';

function createMultiShiftFieldGroups({
  events,
  remindersNotSent,
  unbookedSignups,
}: MultiShiftProps): Field[][] {
  const fieldGroups: Field[][] = events.map((event, index) => {
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
        {
          kind: 'ScheduledTime',
          message: (
            <>
              <FormattedTime value={event.start_time} />
              {'-'}
              <FormattedTime value={event.end_time} />
            </>
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
        event.contact
          ? null
          : {
              kind: 'NoContactSelected',
              message: <Msg id={messageIds.event.noContactSelected} />,
              requiresAction: true,
            },
      ];
    } else {
      fields = [
        {
          kind: 'Participants',
          message: `${event.num_participants_available} / ${event.num_participants_required}`,
          requiresAction:
            event.num_participants_required > event.num_participants_available,
        },
        {
          kind: 'ScheduledTime',
          message: (
            <>
              <FormattedTime value={event.start_time} />
              {'-'}
              <FormattedTime value={event.end_time} />
            </>
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
        event.contact
          ? null
          : {
              kind: 'NoContactSelected',
              message: <Msg id={messageIds.event.noContactSelected} />,
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
  width: string;
}

const MultiShift: FC<MultiShiftProps> = ({
  events,
  height,
  remindersNotSent,
  unbookedSignups,
  width,
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
    width,
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
      title={firstEventTitle || events[0].activity.title || ''}
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

export default MultiShift;
