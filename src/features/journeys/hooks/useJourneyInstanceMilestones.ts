import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { milestonesLoad, milestonesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  ZetkinJourneyInstance,
  ZetkinJourneyMilestoneStatus,
} from 'utils/types/zetkin';

export default function useJourneyInstanceMilestones(
  orgId: number,
  instanceId: number
): IFuture<ZetkinJourneyMilestoneStatus[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const milestoneList = useAppSelector(
    (state) => state.journeys.milestonesByInstanceId[instanceId]
  );

  return loadListIfNecessary(milestoneList, dispatch, {
    actionOnLoad: () => milestonesLoad(instanceId),
    actionOnSuccess: (milestones) => milestonesLoaded([instanceId, milestones]),
    loader: async () => {
      const instance = await apiClient.get<ZetkinJourneyInstance>(
        `/api/orgs/${orgId}/journey_instances/${instanceId}`
      );
      return instance.milestones || [];
    },
  });
}
