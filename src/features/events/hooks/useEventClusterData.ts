import { AnyClusteredEvent } from 'features/calendar/utils/clusterEventsForWeekCalender';
import { EventState } from 'features/events/models/EventDataModel';
import getEventStats from 'features/events/rpc/getEventStats';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import messageIds from '../l10n/messageIds';
import { STATUS_COLORS } from 'features/campaigns/components/ActivityList/items/ActivityListItem';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import { statsLoad, statsLoaded } from 'features/events/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEventClusterData(cluster: AnyClusteredEvent) {
  const numParticipantsRequired = cluster.events.reduce(
    (sum, event) => sum + event.num_participants_required,
    0
  );

  const numParticipantsAvailable = cluster.events.reduce(
    (sum, event) => sum + event.num_participants_available,
    0
  );

  let statsLoading = false;
  const messages = useMessages(messageIds);
  const events = useAppSelector((state) => state.events);
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const allStats = cluster.events.map((event) => {
    const future = loadItemIfNecessary(
      events.statsByEventId[event.id],
      dispatch,
      {
        actionOnLoad: () => statsLoad(event.id),
        actionOnSuccess: (stats) => statsLoaded([event.id, stats]),
        loader: () => {
          return apiClient.rpc(getEventStats, {
            eventId: event.id,
            orgId: event.organization.id,
          });
        },
      }
    );

    if (future.isLoading) {
      statsLoading = true;
    }

    return future.data;
  });

  const allHaveContacts = cluster.events.reduce(
    (allTrue, event) => allTrue && !!event.contact,
    true
  );

  // Get the state of the events, or UNKNOWN if the states vary
  let status = getEventState(cluster.events[0]);
  if (cluster.events.filter((event) => getEventState(event) != status).length) {
    status = EventState.UNKNOWN;
  }

  let numBooked = 0;
  let numPending = 0;
  let numReminded = 0;
  if (!statsLoading) {
    allStats.forEach((stats) => {
      if (stats) {
        numPending += stats.numPending;
        numBooked += stats.numBooked;
        numReminded += stats.numReminded;
      }
    });
  }

  let color = STATUS_COLORS.GRAY;
  if (status === EventState.OPEN) {
    color = STATUS_COLORS.GREEN;
  } else if (status === EventState.ENDED) {
    color = STATUS_COLORS.RED;
  } else if (status === EventState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  } else if (status === EventState.CANCELLED) {
    color = STATUS_COLORS.ORANGE;
  }

  const firstEvent = cluster.events[0];
  const campaignId = firstEvent.campaign?.id ?? 'standalone';
  const location = firstEvent.location;
  const orgId = firstEvent.organization.id;
  const eventId = firstEvent.id;
  const startTime = firstEvent.start_time;
  const endTime = cluster.events[cluster.events.length - 1].end_time;
  const title =
    firstEvent.title || firstEvent.activity?.title || messages.common.noTitle();

  return {
    allHaveContacts,
    campaignId,
    color,
    endTime,
    eventId,
    location,
    numBooked,
    numParticipantsAvailable,
    numParticipantsRequired,
    numPending,
    numReminded,
    orgId,
    startTime,
    statsLoading,
    title,
  };
}

const getEventState = (data: ZetkinEvent) => {
  if (!data) {
    return EventState.UNKNOWN;
  }

  if (!data.published && data.cancelled) {
    return EventState.CANCELLED;
  }
  const now = new Date();
  if (data.published) {
    const published = new Date(data.published);
    if (published > now) {
      return EventState.SCHEDULED;
    }
    if (data.cancelled) {
      const cancelled = new Date(data.cancelled);
      if (cancelled > published) {
        return EventState.CANCELLED;
      }
    }
    if (data.end_time) {
      const endTime = new Date(data.end_time);
      if (endTime < now) {
        return EventState.ENDED;
      }
    }
    return EventState.OPEN;
  } else {
    return EventState.DRAFT;
  }
};
