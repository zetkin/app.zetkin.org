import useAreaAssignmentActivities from 'features/areaAssignments/hooks/useAreaAssignmentActivities';
import { CampaignActivity } from '../types';
import useCallAssignmentActivities from './useCallAssignmentActivities';
import useEmailActivities from './useEmailActivities';
import useEventActivities from './useEventActivities';
import useSurveyActivities from './useSurveyActivities';
import useTaskActivities from './useTaskActivities';
import useVisitAssignmentActivities from 'features/visitassignments/hooks/useVisitAssignmentActivities';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';

export default function useActivityList(
  orgId: number,
  campId?: number
): IFuture<CampaignActivity[]> {
  const surveyActivitiesFuture = useSurveyActivities(orgId, campId);
  const callAssignmentActivitiesFuture = useCallAssignmentActivities(
    orgId,
    campId
  );
  const areaAssignmentActivitiesFuture = useAreaAssignmentActivities(
    orgId,
    campId
  );
  const visitAssignmentActivitiesFuture = useVisitAssignmentActivities(
    orgId,
    campId
  );
  const taskActivitiesFuture = useTaskActivities(orgId, campId);
  const eventActivitiesFuture = useEventActivities(orgId, campId);
  const emailActivitiesFuture = useEmailActivities(orgId, campId);

  if (
    callAssignmentActivitiesFuture.isLoading ||
    areaAssignmentActivitiesFuture.isLoading ||
    visitAssignmentActivitiesFuture.isLoading ||
    surveyActivitiesFuture.isLoading ||
    taskActivitiesFuture.isLoading ||
    eventActivitiesFuture.isLoading ||
    emailActivitiesFuture.isLoading
  ) {
    return new LoadingFuture();
  } else if (
    callAssignmentActivitiesFuture.error ||
    areaAssignmentActivitiesFuture.error ||
    visitAssignmentActivitiesFuture.error ||
    surveyActivitiesFuture.error ||
    taskActivitiesFuture.error ||
    eventActivitiesFuture.error ||
    emailActivitiesFuture.error
  ) {
    return new ErrorFuture('Error loading activities');
  }

  const activities: CampaignActivity[] = [];
  activities.push(
    ...(surveyActivitiesFuture.data || []),
    ...(callAssignmentActivitiesFuture.data || []),
    ...(areaAssignmentActivitiesFuture.data || []),
    ...(visitAssignmentActivitiesFuture.data || []),
    ...(taskActivitiesFuture.data || []),
    ...(eventActivitiesFuture.data || []),
    ...(emailActivitiesFuture.data || [])
  );

  const now = new Date();
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const filtered = activities.filter(
    (activity) => !activity.visibleUntil || activity.visibleUntil >= nowDate
  );

  return new ResolvedFuture(filtered);
}
