import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinJourney } from 'utils/types/zetkin';
import { journeysLoad, journeysLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useJourneys(orgId: number): IFuture<ZetkinJourney[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const journeysList = useAppSelector((state) => state.journeys.journeysList);

  return loadListIfNecessary(journeysList, dispatch, {
    actionOnLoad: () => journeysLoad(),
    actionOnSuccess: (data) => journeysLoaded(data),
    loader: () => apiClient.get<ZetkinJourney[]>(`/api/orgs/${orgId}/journeys`),
  });
}
