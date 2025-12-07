import useAreaAssignmentActivities from 'features/areaAssignments/hooks/useAreaAssignmentActivities';
import { CampaignActivity } from '../types';
import useCallAssignmentActivities from './useCallAssignmentActivities';
import useEmailActivities from './useEmailActivities';
import useEventActivities from './useEventActivities';
import useSurveyActivities from './useSurveyActivities';
import useTaskActivities from './useTaskActivities';

export default function useActivityList(
  orgId: number,
  campId?: number
): CampaignActivity[] {
  const surveyActivitiesFuture = useSurveyActivities(orgId, campId);
  const callAssignmentActivities = useCallAssignmentActivities(orgId, campId);
  const areaAssignmentActivitiesFuture = useAreaAssignmentActivities(
    orgId,
    campId
  );
  const taskActivitiesFuture = useTaskActivities(orgId, campId);
  const eventActivities = useEventActivities(orgId, campId);
  const emailActivities = useEmailActivities(orgId, campId);

  const activities: CampaignActivity[] = [];
  activities.push(
    ...(surveyActivitiesFuture.data || []),
    ...callAssignmentActivities,
    ...(areaAssignmentActivitiesFuture.data || []),
    ...(taskActivitiesFuture.data || []),
    ...eventActivities,
    ...emailActivities
  );

  const now = new Date();
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const filtered = activities.filter(
    (activity) => !activity.visibleUntil || activity.visibleUntil >= nowDate
  );

  return filtered;
}
