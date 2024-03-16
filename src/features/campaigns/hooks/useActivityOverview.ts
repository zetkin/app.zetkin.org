import { isSameDate } from 'utils/dateUtils';
import useCallAssignmentActivities from './useCallAssignmentActivities';
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
import { getActivitiesByDay } from 'features/calendar/components/utils';

export default function useActivitiyOverview(
  orgId: number,
  campId?: number
): IFuture<ActivityOverview> {
  const startOfToday = new Date(new Date().toISOString().slice(0, 10));
  const weekFromNow = new Date(startOfToday);
  weekFromNow.setDate(startOfToday.getDate() + 8);

  const eventActivites = useEventsFromDateRange(startOfToday, weekFromNow);
  const taskActivitiesFuture = useTaskActivities(orgId, campId);
  const surveyActivitiesFuture = useSurveyActivities(orgId, campId);
  const callAssignmentActivitiesFuture = useCallAssignmentActivities(
    orgId,
    campId
  );

  if (
    callAssignmentActivitiesFuture.isLoading ||
    surveyActivitiesFuture.isLoading ||
    taskActivitiesFuture.isLoading
  ) {
    return new LoadingFuture();
  } else if (
    callAssignmentActivitiesFuture.error ||
    surveyActivitiesFuture.error ||
    taskActivitiesFuture.error
  ) {
    return new ErrorFuture('Error loading acitvities');
  }

  const activities: CampaignActivity[] = [];
  activities.push(
    ...eventActivites,
    ...(taskActivitiesFuture.data || []),
    ...(surveyActivitiesFuture.data || []),
    ...(callAssignmentActivitiesFuture.data || [])
  );

  const activitiesByDay = getActivitiesByDay(activities);

  const sortedAcitvities = activities.sort((first, second) => {
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

  const activitiesToday =
    activitiesByDay[todayDate.toISOString().slice(0, 10)]?.events;

  const activitiesTomorrow =
    activitiesByDay[todayDate.toISOString().slice(0, 10)]?.events;

  // Current: If an activity begins on today
  // TODO: If an activity has any point in time today
  overview.today = activitiesToday;

  // overview.today = sortedAcitvities.filter((activity) => {
  //   if (activity.kind == ACTIVITIES.EVENT) {
  //     const startDate = new Date(activity.data.start_time);
  //     return isSameDate(startDate, todayDate);
  //   } else {
  //     return (
  //       (activity.visibleFrom && isSameDate(activity.visibleFrom, todayDate)) ||
  //       (activity.visibleUntil && isSameDate(activity.visibleUntil, todayDate))
  //     );
  //   }
  // });

  // If an activity has any point in time tomorrow
  overview.tomorrow = activitiesTomorrow;
  // overview.tomorrow = sortedAcitvities.filter((activity) => {
  //   if (activity.kind == ACTIVITIES.EVENT) {
  //     const startDate = new Date(activity.data.start_time);
  //     return isSameDate(startDate, tomorrowDate);
  //   } else {
  //     return (
  //       (activity.visibleFrom &&
  //         isSameDate(activity.visibleFrom, tomorrowDate)) ||
  //       (activity.visibleUntil &&
  //         isSameDate(activity.visibleUntil, tomorrowDate))
  //     );
  //   }
  // });

  // If an activity includes any other time this week
  // overview.alsoThisWeek = sortedAcitvities.filter((activity) => {
  //   if (
  //     overview.today.includes(activity) ||
  //     overview.tomorrow.includes(activity)
  //   ) {
  //     return false;
  //   }

  //   return (
  //     activity.visibleFrom &&
  //     activity.visibleFrom < weekFromNow &&
  //     (!activity.visibleUntil || activity.visibleUntil >= startOfToday)
  //   );
  // });

  return new ResolvedFuture(overview);
}
