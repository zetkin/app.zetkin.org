import { FC } from 'react';
import {
  EventOutlined,
  People,
  PlaceOutlined,
  ScheduleOutlined,
} from '@mui/icons-material';

import { CLUSTER_TYPE } from 'features/campaigns/hooks/useClusteredActivities';
import EventWarningIcons from 'features/events/components/EventWarningIcons';
import getEventUrl from 'features/events/utils/getEventUrl';
import getStatusColor from 'features/campaigns/utils/getStatusColor';
import messageIds from 'features/events/l10n/messageIds';
import OverviewListItem from './OverviewListItem';
import { removeOffset } from 'utils/dateUtils';
import { useEventPopper } from 'features/events/components/EventPopper/EventPopperProvider';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUITimeSpan from 'zui/ZUITimeSpan';

interface EventOverviewListItemProps {
  event: ZetkinEvent;
  focusDate: Date | null;
}

const EventOverviewListItem: FC<EventOverviewListItemProps> = ({
  event,
  focusDate,
}) => {
  const { openEventPopper } = useEventPopper();
  const messages = useMessages(messageIds);

  const startDate = event.published ? new Date(event.published) : null;
  const endDate = event.cancelled ? new Date(event.cancelled) : null;

  return (
    <OverviewListItem
      color={getStatusColor(startDate, endDate)}
      endDate={endDate}
      endNumber={`${event.num_participants_available} / ${event.num_participants_required}`}
      endNumberColor={
        event.num_participants_available < event.num_participants_required
          ? 'error'
          : undefined
      }
      focusDate={focusDate}
      href={getEventUrl(event)}
      meta={
        <EventWarningIcons
          compact
          eventId={event.id}
          orgId={event.organization.id}
        />
      }
      onClick={(x: number, y: number) => {
        openEventPopper(
          { events: [event], kind: CLUSTER_TYPE.SINGLE },
          { left: x, top: y }
        );
      }}
      PrimaryIcon={EventOutlined}
      SecondaryIcon={People}
      startDate={startDate}
      statusBar={null}
      subtitle={
        <ZUIIconLabelRow
          iconLabels={[
            {
              icon: <ScheduleOutlined fontSize="inherit" />,
              label: (
                <ZUITimeSpan
                  end={new Date(removeOffset(event.end_time))}
                  start={new Date(removeOffset(event.start_time))}
                />
              ),
            },
            ...(event.location
              ? [
                  {
                    icon: <PlaceOutlined fontSize="inherit" />,
                    label: event.location.title,
                  },
                ]
              : []),
          ]}
        />
      }
      title={event.title || event.activity?.title || messages.common.noTitle()}
    />
  );
};

export default EventOverviewListItem;
