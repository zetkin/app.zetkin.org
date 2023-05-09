import { ClusteredEvent } from 'features/campaigns/hooks/useClusteredActivities';
import { EnvContext } from 'core/env/EnvContext';
import { EventState } from 'features/events/models/EventDataModel';
import getEventStats from 'features/events/rpc/getEventStats';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import messageIds from '../l10n/messageIds';
import { RootState } from 'core/store';
import { STATUS_COLORS } from 'features/campaigns/components/ActivityList/items/ActivityListItem';
import { useContext } from 'react';
import { useMessages } from 'core/i18n';
import { useStore } from 'react-redux';
import { ZetkinEvent } from 'utils/types/zetkin';
import { statsLoad, statsLoaded } from 'features/events/store';

export default function useEventClusterData(cluster: ClusteredEvent) {
  const numParticipantsRequired = cluster.events.reduce(
    (sum, event) => sum + event.num_participants_required,
    0
  );

  let statsLoading = false;
  const messages = useMessages(messageIds);
  const store = useStore<RootState>();
  const state = store.getState();
  const env = useContext(EnvContext);
  const allStats = cluster.events.map((event) => {
    const future = loadItemIfNecessary(
      state.events.statsByEventId[event.id],
      store,
      {
        actionOnLoad: () => statsLoad(event.id),
        actionOnSuccess: (stats) => statsLoaded([event.id, stats]),
        loader: () => {
          return env!.apiClient.rpc(getEventStats, {
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
