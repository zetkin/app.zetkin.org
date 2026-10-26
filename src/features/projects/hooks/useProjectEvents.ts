import dayjs from 'dayjs';

import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { projectEventsLoad, projectEventsLoaded } from 'features/events/store';
import { getFirstAndLastEvent, removeOffset } from 'utils/dateUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseProjectEventsReturn {
  firstEvent: ZetkinEvent | undefined;
  lastEvent: ZetkinEvent | undefined;
  numberOfUpcomingEvents: number;
}

export default function useProjectEvents(
  orgId: number,
  projectId: number
): UseProjectEventsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const eventsByProjectId = useAppSelector(
    (state) => state.events.eventsByProjectId
  );

  const projectEventsFuture = loadListIfNecessary(
    eventsByProjectId[projectId],
    dispatch,
    {
      actionOnLoad: () => projectEventsLoad(projectId),
      actionOnSuccess: (data) => projectEventsLoaded([projectId, data]),
      loader: () =>
        apiClient.get<ZetkinEvent[]>(
          `/api/orgs/${orgId}/campaigns/${projectId}/actions`
        ),
    }
  );

  const projectEvents = projectEventsFuture.data || [];

  const firstAndLast = getFirstAndLastEvent(projectEvents);

  const numberOfUpcomingEvents = projectEvents.filter((event) =>
    dayjs(removeOffset(event.end_time)).isAfter(dayjs())
  ).length;

  return {
    firstEvent: firstAndLast[0],
    lastEvent: firstAndLast[1],
    numberOfUpcomingEvents,
  };
}
