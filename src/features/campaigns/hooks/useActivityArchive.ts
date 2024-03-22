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
  const callAssignmentActivitiesFuture = useCallAssignmentActivities(
    orgId,
    campId
  );
  const taskActivitiesFuture = useTaskActivities(orgId, campId);
  const eventActivitiesFuture = useEventActivities(orgId, campId);
  const emailActivitiesFuture = useEmailActivities(orgId, campId);

  if (
    callAssignmentActivitiesFuture.isLoading ||
    surveyActivitiesFuture.isLoading ||
    taskActivitiesFuture.isLoading ||
    eventActivitiesFuture.isLoading ||
    emailActivitiesFuture.isLoading
  ) {
    return new LoadingFuture();
  } else if (
    callAssignmentActivitiesFuture.error ||
    surveyActivitiesFuture.error ||
    taskActivitiesFuture.error ||
    eventActivitiesFuture.error ||
    emailActivitiesFuture.error
  ) {
    return new ErrorFuture('Error loading acitvities');
  }

  const activities: CampaignActivity[] = [];
  activities.push(
    ...(surveyActivitiesFuture.data || []),
    ...(callAssignmentActivitiesFuture.data || []),
    ...(taskActivitiesFuture.data || []),
    ...(eventActivitiesFuture.data || []),
    ...(emailActivitiesFuture.data || [])
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
