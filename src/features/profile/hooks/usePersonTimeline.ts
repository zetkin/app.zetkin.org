import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTimeline, ZetkinTimelineAction } from 'utils/types/zetkin';
import { personTimelineLoad, personTimelineLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function usePersonTimeline(
  orgId: number,
  personId: number
): IFuture<ZetkinTimelineAction[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const timelineList = useAppSelector(
    (state) => state.profiles.timelineByPersonId[personId]
  );

  return loadListIfNecessary(timelineList, dispatch, {
    actionOnLoad: () => personTimelineLoad(personId),
    actionOnSuccess: (data) => personTimelineLoaded([personId, data]),
    loader: async () => {
      const timeline = await apiClient.get<ZetkinTimeline>(
        `/api/orgs/${orgId}/people/${personId}/timeline`
      );
      return timeline.map((entry) => ({
        ...entry,
        id: `${entry.event}-${entry.data.action.id}`,
      }));
    },
  });
}
