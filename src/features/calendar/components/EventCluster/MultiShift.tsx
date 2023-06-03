import { FC } from 'react';
import { FormattedTime } from 'react-intl';
import { ScheduleOutlined } from '@mui/icons-material';

import calendarMessageIds from 'features/calendar/l10n/messageIds';
import eventMessageIds from 'features/events/l10n/messageIds';
import { EventState } from 'features/events/models/EventDataModel';
import getEventState from 'features/events/utils/getEventState';
import LocationLabel from 'features/events/components/LocationLabel';
import { removeOffset } from 'utils/dateUtils';
import TopBadge from './TopBadge';
import { ZetkinEvent } from 'utils/types/zetkin';
import { availableHeightByEvent, fieldsToPresent } from './utils';
import Event, { Field, FIELD_PRESENTATION } from './Event';
import { Msg, useMessages } from 'core/i18n';

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
          message: <LocationLabel location={event.location} />,
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
  showTopBadge: boolean;
  unbookedSignups: null | number;
  height: number;
  width: string;
}

const MultiShift: FC<MultiShiftProps> = ({
  events,
  height,
  remindersNotSent,
  showTopBadge,
  unbookedSignups,
  width,
}) => {
  const messages = useMessages(eventMessageIds);
  const firstEventTitle =
    events[0].title || events[0].activity?.title || messages.common.noTitle();

  const statuses = events.map((event) => getEventState(event));
  const anyEventIsCancelled = statuses.includes(EventState.CANCELLED);
  const anyEventIsDraft = statuses.includes(EventState.DRAFT);

  const availableHeightPerFieldGroup = availableHeightByEvent(
    height,
    events.length
  );

  const fieldGroups = createMultiShiftFieldGroups({
    events,
    height,
    remindersNotSent,
    showTopBadge,
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
      draft={anyEventIsDraft}
      events={events}
      fieldGroups={fieldGroups}
      height={height}
      title={firstEventTitle}
      topBadge={
        showTopBadge && (
          <TopBadge
            cancelled={anyEventIsCancelled}
            draft={anyEventIsDraft}
            icon={<ScheduleOutlined color="inherit" fontSize="inherit" />}
            text={events.length.toString()}
          />
        )
      }
      width={width}
    />
  );
};

export default MultiShift;
