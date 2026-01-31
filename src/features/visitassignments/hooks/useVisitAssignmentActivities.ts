import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { ZetkinVisitAssignment } from 'features/visitassignments/types';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  visitAssignmentsLoad,
  visitAssignmentsLoaded,
} from 'features/visitassignments/store';
import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';
import useFeature from 'utils/featureFlags/useFeature';
import { VISITS } from 'utils/featureFlags';
import { getUTCDateWithoutTime } from 'utils/dateUtils';

export default function useVisitAssignmentActivities(
  orgId: number,
  campId?: number
): IFuture<CampaignActivity[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const list = useAppSelector(
    (state) => state.visitAssignments.visitAssignmentList
  );

  const hasVisitAssignments = useFeature(VISITS);
  if (!hasVisitAssignments) {
    return new ResolvedFuture([]);
  }

  const future = loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => visitAssignmentsLoad(),
    actionOnSuccess: (data) => visitAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinVisitAssignment[]>(
        `/beta/orgs/${orgId}/visitassignments`
      ),
  });

  if (future.error) {
    return new ErrorFuture(future.error);
  } else if (future.data) {
    return new ResolvedFuture(
      future.data
        .filter((assignment) => {
          return !campId || assignment.campaign.id == campId;
        })
        .map((assignment) => ({
          data: assignment,
          kind: ACTIVITIES.VISIT_ASSIGNMENT,
          visibleFrom: getUTCDateWithoutTime(assignment.start_date),
          visibleUntil: getUTCDateWithoutTime(assignment.end_date),
        }))
    );
  } else {
    return new LoadingFuture();
  }
}
