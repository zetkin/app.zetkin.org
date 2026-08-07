import { getUTCDateWithoutTime } from 'utils/dateUtils';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ACTIVITIES, ProjectActivity } from '../types';
import {
  projectEventsLoad,
  projectEventsLoaded,
  eventsLoad,
  eventsLoaded,
} from 'features/events/store';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEventActivities(
  orgId: number,
  projectId?: number
): IFuture<ProjectActivity[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const eventsSlice = useAppSelector((state) => state.events);

  const activities: ProjectActivity[] = [];

  if (projectId) {
    const eventsByProjectId = eventsSlice.eventsByProjectId[projectId];
    const eventsFuture = loadListIfNecessary(eventsByProjectId, dispatch, {
      actionOnLoad: () => projectEventsLoad(projectId),
      actionOnSuccess: (data) => projectEventsLoaded([projectId, data]),
      loader: async () =>
        apiClient.get<ZetkinEvent[]>(
          `/api/orgs/${orgId}/campaigns/${projectId}/actions`
        ),
    });

    if (eventsFuture.isLoading) {
      return new LoadingFuture();
    } else if (eventsFuture.error) {
      return new ErrorFuture(eventsFuture.error);
    }

    if (eventsFuture.data) {
      const events = eventsFuture.data;

      if (events) {
        events.forEach((event) => {
          activities.push({
            data: event,
            kind: ACTIVITIES.EVENT,
            visibleFrom: getUTCDateWithoutTime(event.published),
            visibleUntil: getUTCDateWithoutTime(event.end_time),
          });
        });
      }
    }
  } else {
    const eventList = eventsSlice.eventList;
    const allEventsFuture = loadListIfNecessary(eventList, dispatch, {
      actionOnLoad: () => eventsLoad(),
      actionOnSuccess: (data) => eventsLoaded(data),
      loader: () => apiClient.get<ZetkinEvent[]>(`/api/orgs/${orgId}/actions`),
    });

    if (allEventsFuture.data) {
      const allEvents = allEventsFuture.data;
      allEvents.forEach((event) => {
        activities.push({
          data: event,
          kind: ACTIVITIES.EVENT,
          visibleFrom: getUTCDateWithoutTime(event.published || null),
          visibleUntil: getUTCDateWithoutTime(event.end_time || null),
        });
      });
    }
  }

  return new ResolvedFuture(activities);
}
