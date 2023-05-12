import { FC } from 'react';
import {
  Group,
  PlaceOutlined,
  ScheduleOutlined,
  SplitscreenOutlined,
} from '@mui/icons-material';

import ActivityListItem from './ActivityListItem';
import { EventWarningIconsSansModel } from 'features/events/components/EventWarningIcons';
import LocationLabel from 'features/events/components/LocationLabel';
import messageIds from 'features/campaigns/l10n/messageIds';
import { Msg } from 'core/i18n';
import MultiLocationIcon from 'zui/icons/MultiLocation';
import { removeOffset } from 'utils/dateUtils';
import useEventClusterData from 'features/events/hooks/useEventClusterData';
import { useEventPopper } from 'features/events/components/EventPopper/EventPopperProvider';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import {
  CLUSTER_TYPE,
  ClusteredEvent,
} from 'features/campaigns/hooks/useClusteredActivities';

interface EventListeItemProps {
  cluster: ClusteredEvent;
}

const EventClusterListItem: FC<EventListeItemProps> = ({ cluster }) => {
  const { openEventPopper } = useEventPopper();
  const {
    allHaveContacts,
    campaignId,
    color,
    endTime,
    eventId,
    location,
    numBooked,
    numParticipantsRequired,
    numPending,
    numReminded,
    orgId,
    statsLoading,
    startTime,
    title,
  } = useEventClusterData(cluster);

  return (
    <ActivityListItem
      color={color}
      endNumber={`${numBooked} / ${numParticipantsRequired}`}
      endNumberColor={numBooked < numParticipantsRequired ? 'error' : undefined}
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
      onEventItemClick={(x: number, y: number) => {
        openEventPopper(cluster, { left: x, top: y });
      }}
      PrimaryIcon={
        cluster.kind == CLUSTER_TYPE.MULTI_LOCATION
          ? MultiLocationIcon
          : SplitscreenOutlined
      }
      SecondaryIcon={Group}
      subtitle={
        <ZUIIconLabelRow
          color="secondary"
          iconLabels={[
            {
              icon: <ScheduleOutlined color="secondary" fontSize="inherit" />,
              label: (
                <ZUITimeSpan
                  end={new Date(removeOffset(endTime))}
                  start={new Date(removeOffset(startTime))}
                />
              ),
            },
            {
              icon: <PlaceOutlined color="secondary" fontSize="inherit" />,
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

export default EventClusterListItem;
