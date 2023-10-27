import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinJourney } from 'utils/types/zetkin';
import { journeyLoad, journeyLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useJourney(
  orgId: number,
  journeyId: number
): IFuture<ZetkinJourney> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const journeyItems = useAppSelector(
    (state) => state.journeys.journeyList.items
  );
  const journeyItem = journeyItems.find((item) => item.id == journeyId);

  return loadItemIfNecessary(journeyItem, dispatch, {
    actionOnLoad: () => journeyLoad(journeyId),
    actionOnSuccess: (data) => journeyLoaded(data),
    loader: () =>
      apiClient.get<ZetkinJourney>(`/api/orgs/${orgId}/journeys/${journeyId}`),
  });
}
