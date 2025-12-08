import useAreaAssignmentActivities from 'features/areaAssignments/hooks/useAreaAssignmentActivities';
import { CampaignActivity } from '../types';
import useCallAssignmentActivities from './useCallAssignmentActivities';
import useEmailActivities from './useEmailActivities';
import useEventActivities from './useEventActivities';
import useSurveyActivities from './useSurveyActivities';
import useTaskActivities from './useTaskActivities';

export default function useActivityArchive(
  orgId: number,
  campId?: number
): CampaignActivity[] {
  const surveyActivities = useSurveyActivities(orgId, campId);
  const areaAssignmentActivities = useAreaAssignmentActivities(orgId, campId);
  const callAssignmentActivities = useCallAssignmentActivities(orgId, campId);
  const taskActivities = useTaskActivities(orgId, campId);
  const eventActivities = useEventActivities(orgId, campId);
  const emailActivities = useEmailActivities(orgId, campId);

  const activities: CampaignActivity[] = [];
  activities.push(
    ...surveyActivities,
    ...callAssignmentActivities,
    ...areaAssignmentActivities,
    ...taskActivities,
    ...eventActivities,
    ...emailActivities
  );

  const now = new Date();
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const filtered = activities.filter(
    (activity) =>
      activity.visibleFrom &&
      activity.visibleUntil &&
      activity.visibleUntil < nowDate
  );

  return filtered;
}
