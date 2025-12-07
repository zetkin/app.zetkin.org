import useAreaAssignmentActivities from 'features/areaAssignments/hooks/useAreaAssignmentActivities';
import { CampaignActivity } from '../types';
import useCallAssignmentActivities from './useCallAssignmentActivities';
import useEmailActivities from './useEmailActivities';
import useEventActivities from './useEventActivities';
import useSurveyActivities from './useSurveyActivities';
import useTaskActivities from './useTaskActivities';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';

export default function useActivityArchive(
  orgId: number,
  campId?: number
): IFuture<CampaignActivity[]> {
  const surveyActivitiesFuture = useSurveyActivities(orgId, campId);
  const areaAssignmentActivitiesFuture = useAreaAssignmentActivities(
    orgId,
    campId
  );
  const callAssignmentActivities = useCallAssignmentActivities(orgId, campId);
  const taskActivitiesFuture = useTaskActivities(orgId, campId);
  const eventActivities = useEventActivities(orgId, campId);
  const emailActivities = useEmailActivities(orgId, campId);

  if (
    areaAssignmentActivitiesFuture.isLoading ||
    surveyActivitiesFuture.isLoading ||
    taskActivitiesFuture.isLoading
  ) {
    return new LoadingFuture();
  } else if (
    areaAssignmentActivitiesFuture.error ||
    surveyActivitiesFuture.error ||
    taskActivitiesFuture.error
  ) {
    return new ErrorFuture('Error loading acitvities');
  }

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
    (activity) =>
      activity.visibleFrom &&
      activity.visibleUntil &&
      activity.visibleUntil < nowDate
  );

  return new ResolvedFuture(filtered);
}
