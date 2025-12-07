import { getUTCDateWithoutTime } from 'utils/dateUtils';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { ACTIVITIES, CampaignActivity } from '../types';
import {
  callAssignmentsLoad,
  callAssignmentsLoaded,
  campaignCallAssignmentsLoad,
  campaignCallAssignmentsLoaded,
} from 'features/callAssignments/store';
import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useCallAssignmentActivities(
  orgId: number,
  campId?: number
): CampaignActivity[] {
  const apiClient = useApiClient();
  const callAssignmentsSlice = useAppSelector((state) => state.callAssignments);

  const activities: CampaignActivity[] = [];

  // Call both hooks unconditionally, use isNecessary to control which loads
  const callAssignmentIdsByCampaignId = campId
    ? callAssignmentsSlice.callAssignmentIdsByCampaignId[campId]
    : undefined;
  const callAssignmentIds = useRemoteList(callAssignmentIdsByCampaignId, {
    actionOnLoad: () => campaignCallAssignmentsLoad(campId!),
    actionOnSuccess: (data) => campaignCallAssignmentsLoaded([campId!, data]),
    cacheKey: `campaignCallAssignmentIds-${orgId}-${campId}`,
    isNecessary: () => !!campId,
    loader: async () => {
      const callAssignments = await apiClient.get<ZetkinCallAssignment[]>(
        `/api/orgs/${orgId}/campaigns/${campId}/call_assignments`
      );
      return callAssignments.map((ca) => ({ id: ca.id }));
    },
  });

  const callAssignmentList = callAssignmentsSlice.assignmentList;
  const allCallAssignments = useRemoteList(callAssignmentList, {
    actionOnLoad: () => callAssignmentsLoad(),
    actionOnSuccess: (data) => callAssignmentsLoaded(data),
    cacheKey: campId
      ? `campaignCallAssignments-${orgId}-${campId}`
      : `allCallAssignments-${orgId}`,
    loader: () =>
      apiClient.get<ZetkinCallAssignment[]>(
        campId
          ? `/api/orgs/${orgId}/campaigns/${campId}/call_assignments`
          : `/api/orgs/${orgId}/call_assignments`
      ),
  });

  // Build activities based on campId
  if (campId && callAssignmentIds) {
    callAssignmentIds.forEach(({ id: caId }) => {
      const ca = allCallAssignments.find((item) => item.id === caId);

      if (ca) {
        activities.push({
          data: ca,
          kind: ACTIVITIES.CALL_ASSIGNMENT,
          visibleFrom: getUTCDateWithoutTime(ca.start_date),
          visibleUntil: getUTCDateWithoutTime(ca.end_date),
        });
      }
    });
  } else if (!campId) {
    allCallAssignments.forEach((ca) => {
      activities.push({
        data: ca,
        kind: ACTIVITIES.CALL_ASSIGNMENT,
        visibleFrom: getUTCDateWithoutTime(ca.start_date),
        visibleUntil: getUTCDateWithoutTime(ca.end_date),
      });
    });
  }

  return activities;
}
