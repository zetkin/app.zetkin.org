import EventsRepo from 'features/events/repo/EventsRepo';
import SurveysRepo from 'features/surveys/repos/SurveysRepo';
import useCallAssignments from 'features/callAssignments/hooks/useCallAssignments';
import { useEnv } from 'core/hooks';
import useTasks from 'features/tasks/hooks/useTasks';
import {
  dateIsAfter,
  dateIsBefore,
  getUTCDateWithoutTime,
  isSameDate,
} from 'utils/dateUtils';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import {
  ZetkinCallAssignment,
  ZetkinEvent,
  ZetkinSurvey,
  ZetkinTask,
} from 'utils/types/zetkin';

export enum ACTIVITIES {
  CALL_ASSIGNMENT = 'callAssignment',
  EVENT = 'event',
  SURVEY = 'survey',
  TASK = 'task',
}

type CampaignActivityBase = {
  visibleFrom: Date | null;
  visibleUntil: Date | null;
};

export type CallAssignmentActivity = CampaignActivityBase & {
  data: ZetkinCallAssignment;
  kind: ACTIVITIES.CALL_ASSIGNMENT;
};

export type SurveyActivity = CampaignActivityBase & {
  data: ZetkinSurvey;
  kind: ACTIVITIES.SURVEY;
};

export type TaskActivity = CampaignActivityBase & {
  data: ZetkinTask;
  kind: ACTIVITIES.TASK;
};

export type EventActivity = CampaignActivityBase & {
  data: ZetkinEvent;
  kind: ACTIVITIES.EVENT;
};

export type CampaignActivity =
  | CallAssignmentActivity
  | EventActivity
  | SurveyActivity
  | TaskActivity;

export type ActivityOverview = {
  alsoThisWeek: CampaignActivity[];
  today: CampaignActivity[];
  tomorrow: CampaignActivity[];
};

interface UseCampaignActivitiesReturn {
  archivedActivities: IFuture<CampaignActivity[]>;
  activityOverview: IFuture<ActivityOverview>;
  campaignActivities: IFuture<CampaignActivity[]>;
  currentActivities: IFuture<CampaignActivity[]>;
}

export default function useCampaignActivities(
  orgId: number,
  campaignId?: number
): UseCampaignActivitiesReturn {
  const env = useEnv();
  const eventsRepo = new EventsRepo(env);
  const surveysRepo = new SurveysRepo(env);
  const callAssignmentsFuture = useCallAssignments(orgId);
  const tasksFuture = useTasks(orgId);

  const getActivityOverview = (): IFuture<ActivityOverview> => {
    const activitiesFuture = campaignId
      ? getCampaignActivities()
      : getCurrentActivities();

    if (activitiesFuture.isLoading) {
      return new LoadingFuture();
    } else if (activitiesFuture.error) {
      return new ErrorFuture(activitiesFuture.error);
    }

    const overview: ActivityOverview = {
      alsoThisWeek: [],
      today: [],
      tomorrow: [],
    };

    const todayDate = new Date();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    if (activitiesFuture.data) {
      const currentActivities = activitiesFuture.data;

      overview.today = currentActivities.filter((activity) => {
        if (activity.kind == ACTIVITIES.EVENT) {
          const startDate = new Date(activity.data.start_time);
          return isSameDate(startDate, todayDate);
        } else {
          return (
            (activity.visibleFrom &&
              isSameDate(activity.visibleFrom, todayDate)) ||
            (activity.visibleUntil &&
              isSameDate(activity.visibleUntil, todayDate))
          );
        }
      });

      overview.tomorrow = currentActivities.filter((activity) => {
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

      const startOfToday = new Date(new Date().toISOString().slice(0, 10));
      const weekFromNow = new Date(startOfToday);
      weekFromNow.setDate(startOfToday.getDate() + 8);

      overview.alsoThisWeek = currentActivities.filter((activity) => {
        if (
          overview.today.includes(activity) ||
          overview.tomorrow.includes(activity)
        ) {
          return false;
        }

        if (activity.kind == ACTIVITIES.EVENT) {
          const startDate = new Date(activity.data.start_time);
          const endDate = new Date(activity.data.end_time);
          const startsDuringWeek =
            dateIsAfter(startDate, startOfToday) &&
            dateIsBefore(startDate, weekFromNow);
          const isOnGoing =
            dateIsBefore(startDate, startOfToday) &&
            dateIsAfter(endDate, weekFromNow);
          const endsDuringWeek =
            dateIsBefore(startDate, startOfToday) &&
            dateIsBefore(endDate, weekFromNow);

          return startsDuringWeek || isOnGoing || endsDuringWeek;
        } else {
          return (
            activity.visibleFrom &&
            activity.visibleFrom < weekFromNow &&
            (!activity.visibleUntil || activity.visibleUntil >= startOfToday)
          );
        }
      });
    }

    return new ResolvedFuture(overview);
  };

  const getAllActivities = (
    campaignId?: number
  ): IFuture<CampaignActivity[]> => {
    const eventsFuture = eventsRepo.getAllEvents(orgId);
    const surveysFuture = surveysRepo.getSurveys(orgId);

    if (
      (callAssignmentsFuture.isLoading && !callAssignmentsFuture.data) ||
      (eventsFuture.isLoading && !eventsFuture.data) ||
      (surveysFuture.isLoading && !surveysFuture.data) ||
      (tasksFuture.isLoading && !tasksFuture.data)
    ) {
      return new LoadingFuture();
    }

    if (
      !callAssignmentsFuture.data ||
      !eventsFuture.data ||
      !surveysFuture.data ||
      !tasksFuture.data
    ) {
      return new LoadingFuture();
    }

    const callAssignments: CampaignActivity[] = callAssignmentsFuture.data
      .filter((ca) => !campaignId || ca.campaign?.id == campaignId)
      .map((ca) => ({
        data: ca,
        kind: ACTIVITIES.CALL_ASSIGNMENT,
        visibleFrom: getUTCDateWithoutTime(ca.start_date),
        visibleUntil: getUTCDateWithoutTime(ca.end_date),
      }));

    const events: CampaignActivity[] = eventsFuture.data
      .filter((event) => !campaignId || event.campaign?.id == campaignId)
      .map((event) => ({
        data: event,
        kind: ACTIVITIES.EVENT,
        visibleFrom: getUTCDateWithoutTime(event.published),
        visibleUntil: getUTCDateWithoutTime(event.end_time),
      }));

    const surveys: CampaignActivity[] = surveysFuture.data
      .filter((survey) => !campaignId || survey.campaign?.id == campaignId)
      .map((survey) => ({
        data: survey,
        kind: ACTIVITIES.SURVEY,
        visibleFrom: getUTCDateWithoutTime(survey.published),
        visibleUntil: getUTCDateWithoutTime(survey.expires),
      }));

    const tasks: CampaignActivity[] = tasksFuture.data
      .filter((task) => !campaignId || task.campaign?.id == campaignId)
      .map((task) => ({
        data: task,
        kind: ACTIVITIES.TASK,
        visibleFrom: getUTCDateWithoutTime(task.published || null),
        visibleUntil: getUTCDateWithoutTime(task.expires || null),
      }));

    const unsorted = callAssignments.concat(...events, ...surveys, ...tasks);

    const sorted = unsorted.sort((first, second) => {
      if (first.visibleFrom === null) {
        return -1;
      } else if (second.visibleFrom === null) {
        return 1;
      }

      return second.visibleFrom.getTime() - first.visibleFrom.getTime();
    });

    return new ResolvedFuture(sorted);
  };

  const getArchivedActivities = (
    campaignId?: number
  ): IFuture<CampaignActivity[]> => {
    const activities = getAllActivities(campaignId);
    if (activities.isLoading) {
      return new LoadingFuture();
    } else if (activities.error) {
      return new ErrorFuture(activities.error);
    }

    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const filtered = activities.data?.filter(
      (activity) =>
        activity.visibleFrom &&
        activity.visibleUntil &&
        activity.visibleUntil < nowDate
    );

    return new ResolvedFuture(filtered || []);
  };

  const getCurrentActivities = (): IFuture<CampaignActivity[]> => {
    const activities = getAllActivities();
    if (activities.isLoading) {
      return new LoadingFuture();
    } else if (activities.error) {
      return new ErrorFuture(activities.error);
    }

    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const filtered = activities.data?.filter(
      (activity) => !activity.visibleUntil || activity.visibleUntil >= nowDate
    );

    return new ResolvedFuture(filtered || []);
  };

  const getCampaignActivities = (): IFuture<CampaignActivity[]> => {
    const activities = getCurrentActivities();
    if (activities.isLoading) {
      return new LoadingFuture();
    } else if (activities.error) {
      return new ErrorFuture(activities.error);
    }
    const filtered = activities.data?.filter(
      (activity) => activity.data.campaign?.id === campaignId
    );
    return new ResolvedFuture(filtered || []);
  };

  return {
    activityOverview: getActivityOverview(),
    archivedActivities: getArchivedActivities(),
    campaignActivities: getCampaignActivities(),
    currentActivities: getCurrentActivities(),
  };
}
