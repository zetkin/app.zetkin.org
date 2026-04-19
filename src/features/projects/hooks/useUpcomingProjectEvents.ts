import { ZetkinEvent } from 'utils/types/zetkin';
import { projectEventsLoad, projectEventsLoaded } from 'features/events/store';
import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import getEventState from 'features/events/utils/getEventState';
import { EventState } from 'features/events/hooks/useEventState';

export default function useUpcomingProjectEvents(
  orgId: number,
  projectId: number
): ZetkinEvent[] {
  const apiClient = useApiClient();
  const eventsByProjectId = useAppSelector(
    (state) => state.events.eventsByProjectId
  );
  const ProjectEvents = eventsByProjectId[projectId];

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const futureProjectEvents = useRemoteList(ProjectEvents, {
    actionOnLoad: () => projectEventsLoad(projectId),
    actionOnSuccess: (data) => projectEventsLoaded([projectId, data]),
    loader: () =>
      apiClient.get<ZetkinEvent[]>(
        `/api/orgs/${orgId}/campaigns/${projectId}/actions?filter=end_time>=${today}`
      ),
  });

  return futureProjectEvents.filter((event) => {
    const eventState = getEventState(event);
    return eventState == EventState.OPEN || eventState == EventState.SCHEDULED;
  });
}
