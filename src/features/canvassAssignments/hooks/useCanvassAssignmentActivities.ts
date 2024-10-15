import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { ZetkinCanvassAssignment } from '../types';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { canvassAssignmentsLoad, canvassAssignmentsLoaded } from '../store';
import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';
import useFeature from 'utils/featureFlags/useFeature';
import { AREAS } from 'utils/featureFlags';

export default function useCanvassAssignmentActivities(
  orgId: number,
  campId?: number
): IFuture<CampaignActivity[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const list = useAppSelector(
    (state) => state.canvassAssignments.canvassAssignmentList
  );

  const hasCanvassing = useFeature(AREAS);
  if (!hasCanvassing) {
    return new ResolvedFuture([]);
  }

  const future = loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => canvassAssignmentsLoad(),
    actionOnSuccess: (data) => canvassAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinCanvassAssignment[]>(
        `/beta/orgs/${orgId}/canvassassignments`
      ),
  });

  if (future.error) {
    return new ErrorFuture(future.error);
  } else if (future.data) {
    const now = new Date();
    return new ResolvedFuture(
      future.data
        .filter((assignment) => {
          // TODO: This should happen on server using separate API paths
          return !campId || assignment.campaign.id == campId;
        })
        .map((assignment) => ({
          data: assignment,
          kind: ACTIVITIES.CANVASS_ASSIGNMENT,
          visibleFrom: now, // TODO: Use data from API
          visibleUntil: null,
        }))
    );
  } else {
    return new LoadingFuture();
  }
}
