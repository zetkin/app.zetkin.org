import useAreaAssignmentActivities from 'features/areaAssignments/hooks/useAreaAssignmentActivities';
import { ProjectActivity } from '../types';
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

export default function useActivityList(
  orgId: number,
  projectId?: number
): IFuture<ProjectActivity[]> {
  const surveyActivitiesFuture = useSurveyActivities(orgId, projectId);
  const callAssignmentActivitiesFuture = useCallAssignmentActivities(
    orgId,
    projectId
  );
  const areaAssignmentActivitiesFuture = useAreaAssignmentActivities(
    orgId,
    projectId
  );
  const taskActivitiesFuture = useTaskActivities(orgId, projectId);
  const eventActivitiesFuture = useEventActivities(orgId, projectId);
  const emailActivitiesFuture = useEmailActivities(orgId, projectId);

  if (
    callAssignmentActivitiesFuture.isLoading ||
    areaAssignmentActivitiesFuture.isLoading ||
    surveyActivitiesFuture.isLoading ||
    taskActivitiesFuture.isLoading ||
    eventActivitiesFuture.isLoading ||
    emailActivitiesFuture.isLoading
  ) {
    return new LoadingFuture();
  } else if (
    callAssignmentActivitiesFuture.error ||
    areaAssignmentActivitiesFuture.error ||
    surveyActivitiesFuture.error ||
    taskActivitiesFuture.error ||
    eventActivitiesFuture.error ||
    emailActivitiesFuture.error
  ) {
    return new ErrorFuture('Error loading acitvities');
  }

  const activities: ProjectActivity[] = [];
  activities.push(
    ...(surveyActivitiesFuture.data || []),
    ...(callAssignmentActivitiesFuture.data || []),
    ...(areaAssignmentActivitiesFuture.data || []),
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
