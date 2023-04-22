import { FC } from 'react';
import {
  Group,
  PlaceOutlined,
  ScheduleOutlined,
  SplitscreenOutlined,
} from '@mui/icons-material';

import { EventState } from 'features/events/models/EventDataModel';
import MultiLocationIcon from 'zui/icons/MultiLocation';
import { removeOffset } from 'utils/dateUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';
import {
  CLUSTER_TYPE,
  ClusteredEvent,
} from 'features/campaigns/hooks/useClusteredActivities';

interface EventListeItemProps {
  cluster: ClusteredEvent;
}

const EventClusterListItem: FC<EventListeItemProps> = ({ cluster }) => {
  const {
    campaignId,
    color,
    endTime,
    eventId,
    location,
    numParticipantsAvailable,
    numParticipantsRequired,
    orgId,
    startTime,
    title,
  } = useEventClusterData(cluster);

  return (
    <ActivityListItem
      color={color}
      endNumber={`${numParticipantsAvailable} / ${numParticipantsRequired}`}
      endNumberColor={
        numParticipantsAvailable < numParticipantsRequired ? 'error' : undefined
      }
      href={`/organize/${orgId}/projects/${campaignId}/events/${eventId}`}
      meta={<></>}
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
              label: location.title,
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

function useEventClusterData(cluster: ClusteredEvent) {
  const numParticipantsAvailable = cluster.events.reduce(
    (sum, event) => sum + event.num_participants_available,
    0
  );
  const numParticipantsRequired = cluster.events.reduce(
    (sum, event) => sum + event.num_participants_required,
    0
  );

  // Get the state of the events, or UNKNOWN if the states vary
  let state = getEventState(cluster.events[0]);
  if (cluster.events.filter((event) => getEventState(event) != state).length) {
    state = EventState.UNKNOWN;
  }

  let color = STATUS_COLORS.GRAY;
  if (state === EventState.OPEN) {
    color = STATUS_COLORS.GREEN;
  } else if (state === EventState.ENDED) {
    color = STATUS_COLORS.RED;
  } else if (state === EventState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  }

  const firstEvent = cluster.events[0];
  const campaignId = firstEvent.campaign?.id ?? 'standalone';
  const location = firstEvent.location;
  const orgId = firstEvent.organization.id;
  const eventId = firstEvent.id;
  const startTime = firstEvent.start_time;
  const endTime = cluster.events[cluster.events.length - 1].end_time;
  const title = firstEvent.title || firstEvent.activity.title;

  return {
    campaignId,
    color,
    endTime,
    eventId,
    location,
    numParticipantsAvailable,
    numParticipantsRequired,
    orgId,
    startTime,
    title,
  };
}

const getEventState = (data: ZetkinEvent) => {
  if (!data) {
    return EventState.UNKNOWN;
  }

  if (data.start_time) {
    const startTime = new Date(data.start_time);
    const now = new Date();

    if (startTime > now) {
      return EventState.SCHEDULED;
    } else {
      if (data.end_time) {
        const endTime = new Date(data.end_time);

        if (endTime < now) {
          return EventState.ENDED;
        }
      }

      return EventState.OPEN;
    }
  } else {
    return EventState.DRAFT;
  }
};
