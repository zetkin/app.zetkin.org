import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTimeline, ZetkinTimelineAction } from 'utils/types/zetkin';
import { personEventsLoad, personEventsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function usePersonEvents(
  orgId: number,
  personId: number
): IFuture<ZetkinTimelineAction[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const eventsList = useAppSelector(
    (state) => state.profiles.eventsByPersonId[personId]
  );

  return loadListIfNecessary(eventsList, dispatch, {
    actionOnLoad: () => personEventsLoad(personId),
    actionOnSuccess: (data) => personEventsLoaded([personId, data]),
    loader: async () => {
      const events = await apiClient.get<ZetkinTimeline>(
        `/api/orgs/${orgId}/people/${personId}/timeline`
      );
      return events.map((entry) => ({
        ...entry,
        id: `${entry.event}-${entry.data.action.id}`,
      }));
    },
  });
}
