import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import { journeyInstanceLoad, journeyInstanceLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useJourneyInstance(
  orgId: number,
  instanceId: number
): IFuture<ZetkinJourneyInstance> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const instanceList = useAppSelector(
    (state) => state.journeys.journeyInstanceList
  );
  const instanceItem = instanceList.items.find(
    (instance) => instance.id == instanceId
  );

  return loadItemIfNecessary(instanceItem, dispatch, {
    actionOnLoad: () => journeyInstanceLoad(instanceId),
    actionOnSuccess: (data) => journeyInstanceLoaded(data),
    loader: () =>
      apiClient.get<ZetkinJourneyInstance>(
        `/api/orgs/${orgId}/journey_instances/${instanceId}`
      ),
  });
}
