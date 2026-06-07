import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinJourney, ZetkinJourneyMilestone } from 'utils/types/zetkin';
import {
  journeyLoad,
  journeyLoaded,
  milestoneCreate,
  milestoneCreated,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { futureToObject } from 'core/caching/futures';
import { MilestonePostBody } from './types';

export default function useJourney(orgId: number, journeyId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const journeyItems = useAppSelector(
    (state) => state.journeys.journeyList.items
  );
  const journeyItem = journeyItems.find((item) => item.id == journeyId);

  const journeyFuture = loadItemIfNecessary(journeyItem, dispatch, {
    actionOnLoad: () => journeyLoad(journeyId),
    actionOnSuccess: (data) => journeyLoaded(data),
    loader: () =>
      apiClient.get<ZetkinJourney>(`/api/orgs/${orgId}/journeys/${journeyId}`),
  });

  const createMilestone = async (data: MilestonePostBody) => {
    dispatch(milestoneCreate(journeyId));
    const milestone = await apiClient.post<ZetkinJourneyMilestone>(
      `/api/orgs/${orgId}/journeys/${journeyId}/milestones`,
      data
    );
    dispatch(milestoneCreated([journeyId, milestone]));
  };

  return {
    ...futureToObject(journeyFuture),
    createMilestone,
  };
}
