import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { ZetkinAreaAssignment } from '../types';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { areaAssignmentsLoad, areaAssignmentsLoaded } from '../store';
import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';
import useFeature from 'utils/featureFlags/useFeature';
import { AREAS } from 'utils/featureFlags';
import { getUTCDateWithoutTime } from '../../../utils/dateUtils';

export default function useAreaAssignmentActivities(
  orgId: number,
  campId?: number
): IFuture<CampaignActivity[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const list = useAppSelector(
    (state) => state.areaAssignments.areaAssignmentList
  );

  const hasAreaAssignments = useFeature(AREAS);
  if (!hasAreaAssignments) {
    return new ResolvedFuture([]);
  }

  const future = loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => areaAssignmentsLoad(),
    actionOnSuccess: (data) => areaAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinAreaAssignment[]>(
        `/beta/orgs/${orgId}/areaassignments`
      ),
  });

  if (future.error) {
    return new ErrorFuture(future.error);
  } else if (future.data) {
    return new ResolvedFuture(
      future.data
        .filter((assignment) => {
          // TODO: This should happen on server using separate API paths
          return !campId || assignment.campaign.id == campId;
        })
        .map((assignment) => ({
          data: assignment,
          kind: ACTIVITIES.AREA_ASSIGNMENT,
          visibleFrom: getUTCDateWithoutTime(assignment.start_date),
          visibleUntil: getUTCDateWithoutTime(assignment.end_date),
        }))
    );
  } else {
    return new LoadingFuture();
  }
}
