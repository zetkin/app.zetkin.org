import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinUpdate } from 'zui/ZUITimeline/types';
import { timelineUpdatesLoad, timelineUpdatesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useTimelineUpdates(
  orgId: number,
  instanceId: number
): IFuture<ZetkinUpdate[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const updatesByInstanceId = useAppSelector(
    (state) => state.journeys.timelineUpdatesByInstanceId
  );
  const updatesList = updatesByInstanceId[instanceId];

  return loadListIfNecessary(updatesList, dispatch, {
    actionOnLoad: () => timelineUpdatesLoad(instanceId),
    actionOnSuccess: (data) => timelineUpdatesLoaded([data, instanceId]),
    loader: () =>
      apiClient.get<ZetkinUpdate[]>(
        `/api/orgs/${orgId}/journey_instances/${instanceId}/timeline/updates`
      ),
  });
}
