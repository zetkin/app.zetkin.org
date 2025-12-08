import { ZetkinAreaAssignment } from '../types';
import { useApiClient, useAppSelector } from 'core/hooks';
import { areaAssignmentsLoad, areaAssignmentsLoaded } from '../store';
import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';
import useFeature from 'utils/featureFlags/useFeature';
import { AREAS } from 'utils/featureFlags';
import { getUTCDateWithoutTime } from '../../../utils/dateUtils';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useAreaAssignmentActivities(
  orgId: number,
  campId?: number
): CampaignActivity[] {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.areaAssignments.areaAssignmentList
  );
  const hasAreaAssignments = useFeature(AREAS);

  const assignments = useRemoteList<ZetkinAreaAssignment>(list, {
    actionOnLoad: () => areaAssignmentsLoad(),
    actionOnSuccess: (data) => areaAssignmentsLoaded(data),
    cacheKey: `area-assignment-activities-${orgId}`,
    loader: () => apiClient.get(`/api2/orgs/${orgId}/area_assignments`),
  });

  if (!hasAreaAssignments) {
    return [];
  }

  return assignments
    .filter((assignment) => {
      return !campId || assignment.project_id == campId;
    })
    .map((assignment) => ({
      data: assignment,
      kind: ACTIVITIES.AREA_ASSIGNMENT,
      visibleFrom: getUTCDateWithoutTime(assignment.start_date),
      visibleUntil: getUTCDateWithoutTime(assignment.end_date),
    }));
}
