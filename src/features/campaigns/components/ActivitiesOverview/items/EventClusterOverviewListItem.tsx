import { FC } from 'react';
import {
  Group,
  PlaceOutlined,
  ScheduleOutlined,
  SplitscreenOutlined,
} from '@mui/icons-material';

import { EventWarningIconsSansModel } from 'features/events/components/EventWarningIcons';
import LocationLabel from 'features/events/components/LocationLabel';
import messageIds from 'features/campaigns/l10n/messageIds';
import { Msg } from 'core/i18n';
import MultiLocationIcon from 'zui/icons/MultiLocation';
import OverviewListItem from './OverviewListItem';
import { removeOffset } from 'utils/dateUtils';
import useEventClusterData from 'features/events/hooks/useEventClusterData';
import { useEventPopper } from 'features/events/components/EventPopper/EventPopperProvider';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import {
  CLUSTER_TYPE,
  ClusteredEvent,
} from 'features/campaigns/hooks/useClusteredActivities';

interface EventClusterOverviewListItemProps {
  cluster: ClusteredEvent;
  focusDate: Date | null;
}

const EventClusterOverviewListItem: FC<EventClusterOverviewListItemProps> = ({
  cluster,
  focusDate,
}) => {
  const { openEventPopper } = useEventPopper();
  const {
    allHaveContacts,
    campaignId,
    endTime,
    eventId,
    location,
    numBooked,
    numParticipantsRequired,
    numPending,
    numReminded,
    statsLoading,
    orgId,
    startTime,
    title,
  } = useEventClusterData(cluster);

  return (
    <OverviewListItem
      endDate={null}
      endNumber={`${numBooked} / ${numParticipantsRequired}`}
      endNumberColor={numBooked < numParticipantsRequired ? 'error' : undefined}
      focusDate={focusDate}
      href={`/organize/${orgId}/projects/${campaignId}/events/${eventId}`}
      meta={
        <EventWarningIconsSansModel
          compact={false}
          hasContact={allHaveContacts}
          numParticipants={numBooked}
          numRemindersSent={numReminded}
          numSignups={numPending}
          participantsLoading={statsLoading}
        />
      }
      onClick={(x: number, y: number) => {
        openEventPopper(cluster, { left: x, top: y });
      }}
      PrimaryIcon={
        cluster.kind == CLUSTER_TYPE.MULTI_LOCATION
          ? MultiLocationIcon
          : SplitscreenOutlined
      }
      SecondaryIcon={Group}
      startDate={
        cluster.events[0].published
          ? new Date(cluster.events[0].published)
          : null
      }
      subtitle={
        <ZUIIconLabelRow
          color="secondary"
          iconLabels={[
            {
              icon: <ScheduleOutlined fontSize="inherit" />,
              label: (
                <ZUITimeSpan
                  end={new Date(removeOffset(endTime))}
                  start={new Date(removeOffset(startTime))}
                />
              ),
            },
            {
              icon: <PlaceOutlined fontSize="inherit" />,
              label:
                cluster.kind == CLUSTER_TYPE.MULTI_LOCATION ? (
                  <Msg
                    id={messageIds.activityList.eventItem.locations}
                    values={{ count: cluster.events.length }}
                  />
                ) : (
                  <LocationLabel location={location} />
                ),
            },
          ]}
          size="sm"
        />
      }
      title={title}
    />
  );
};

export default EventClusterOverviewListItem;
