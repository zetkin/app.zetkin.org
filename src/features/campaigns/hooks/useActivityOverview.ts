import { isSameDate } from 'utils/dateUtils';
import useCallAssignmentActivities from './useCallAssignmentActivities';
import useEmailActivities from './useEmailActivities';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import useSurveyActivities from './useSurveyActivities';
import useTaskActivities from './useTaskActivities';
import { ACTIVITIES, ActivityOverview, CampaignActivity } from '../types';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';

export default function useActivitiyOverview(
  orgId: number,
  campId?: number
): IFuture<ActivityOverview> {
  const startOfToday = new Date(new Date().toISOString().slice(0, 10));
  const weekFromNow = new Date(startOfToday);
  weekFromNow.setDate(startOfToday.getDate() + 8);

  const eventActivites = useEventsFromDateRange(
    startOfToday,
    weekFromNow,
    orgId,
    campId
  );
  const taskActivitiesFuture = useTaskActivities(orgId, campId);
  const surveyActivitiesFuture = useSurveyActivities(orgId, campId);
  const callAssignmentActivitiesFuture = useCallAssignmentActivities(
    orgId,
    campId
  );
  const emailActivitiesFuture = useEmailActivities(orgId, campId);

  if (
    callAssignmentActivitiesFuture.isLoading ||
    surveyActivitiesFuture.isLoading ||
    taskActivitiesFuture.isLoading ||
    emailActivitiesFuture.isLoading
  ) {
    return new LoadingFuture();
  } else if (
    callAssignmentActivitiesFuture.error ||
    surveyActivitiesFuture.error ||
    taskActivitiesFuture.error ||
    emailActivitiesFuture.error
  ) {
    return new ErrorFuture('Error loading activities');
  }

  const activities: CampaignActivity[] = [];
  activities.push(
    ...eventActivites,
    ...(taskActivitiesFuture.data || []),
    ...(surveyActivitiesFuture.data || []),
    ...(callAssignmentActivitiesFuture.data || []),
    ...(emailActivitiesFuture.data || [])
  );

  const sortedActivities = activities.sort((first, second) => {
    if (first.visibleFrom === null) {
      return -1;
    } else if (second.visibleFrom === null) {
      return 1;
    }

    return second.visibleFrom.getTime() - first.visibleFrom.getTime();
  });

  const overview: ActivityOverview = {
    alsoThisWeek: [],
    today: [],
    tomorrow: [],
  };

  const todayDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  overview.today = sortedActivities.filter((activity) => {
    if (activity.kind == ACTIVITIES.EVENT) {
      const startDate = new Date(activity.data.start_time);
      return isSameDate(startDate, todayDate);
    } else {
      return (
        (activity.visibleFrom && isSameDate(activity.visibleFrom, todayDate)) ||
        (activity.visibleUntil && isSameDate(activity.visibleUntil, todayDate))
      );
    }
  });

  overview.tomorrow = sortedActivities.filter((activity) => {
    if (activity.kind == ACTIVITIES.EVENT) {
      const startDate = new Date(activity.data.start_time);
      return isSameDate(startDate, tomorrowDate);
    } else {
      return (
        (activity.visibleFrom &&
          isSameDate(activity.visibleFrom, tomorrowDate)) ||
        (activity.visibleUntil &&
          isSameDate(activity.visibleUntil, tomorrowDate))
      );
    }
  });

  overview.alsoThisWeek = sortedActivities.filter((activity) => {
    if (
      overview.today.includes(activity) ||
      overview.tomorrow.includes(activity)
    ) {
      return false;
    }

    return (
      activity.visibleFrom &&
      activity.visibleFrom < weekFromNow &&
      (!activity.visibleUntil || activity.visibleUntil >= startOfToday)
    );
  });

  return new ResolvedFuture(overview);
}
