import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ResolvedFuture } from 'core/caching/futures';
import {
  callAssignmentsLoad,
  callAssignmentsLoaded,
  campaignCallAssignmentsLoad,
  campaignCallAssignmentsLoaded,
} from 'features/callAssignments/store';
import {
  campaignSurveyIdsLoad,
  campaignSurveyIdsLoaded,
  surveysLoad,
  surveysLoaded,
} from 'features/surveys/store';
import {
  campaignTaskIdsLoad,
  campaignTaskIdsLoaded,
  tasksLoad,
  tasksLoaded,
} from 'features/tasks/store';
import { getUTCDateWithoutTime, isSameDate } from 'utils/dateUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
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

export default function useActivitiyOverview(orgId: number, campId?: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const tasksSlice = useAppSelector((state) => state.tasks);
  const surveysSlice = useAppSelector((state) => state.surveys);
  const callAssignmentsSlice = useAppSelector((state) => state.callAssignments);

  const activities: CampaignActivity[] = [];

  if (campId) {
    const taskIdsByCampaignId = tasksSlice.taskIdsByCampaignId[campId];
    const taskIdsFuture = loadListIfNecessary(taskIdsByCampaignId, dispatch, {
      actionOnLoad: () => campaignTaskIdsLoad(campId),
      actionOnSuccess: (data) => campaignTaskIdsLoaded([campId, data]),
      loader: async () => {
        const tasks = await apiClient.get<ZetkinTask[]>(
          `/api/orgs/${orgId}/campaigns/${campId}/tasks`
        );
        return tasks.map((task) => ({ id: task.id }));
      },
    });

    const tasksList = tasksSlice.tasksList;
    const tasksFuture = loadListIfNecessary(tasksList, dispatch, {
      actionOnLoad: () => tasksLoad(),
      actionOnSuccess: (data) => tasksLoaded(data),
      loader: () =>
        apiClient.get<ZetkinTask[]>(
          `/api/orgs/${orgId}/campaigns/${campId}/tasks`
        ),
    });

    if (taskIdsFuture.data && tasksFuture.data) {
      const tasks = tasksFuture.data;
      const taskIds = taskIdsFuture.data;

      taskIds.forEach(({ id: taskId }) => {
        const task = tasks.find((item) => item.id === taskId);

        if (task) {
          activities.push({
            data: task,
            kind: ACTIVITIES.TASK,
            visibleFrom: getUTCDateWithoutTime(task.published || null),
            visibleUntil: getUTCDateWithoutTime(task.expires || null),
          });
        }
      });
    }

    const surveyIdsByCampaignId = surveysSlice.surveyIdsByCampaignId[campId];
    const surveyIdsFuture = loadListIfNecessary(
      surveyIdsByCampaignId,
      dispatch,
      {
        actionOnLoad: () => campaignSurveyIdsLoad(campId),
        actionOnSuccess: (data) => campaignSurveyIdsLoaded([campId, data]),
        loader: async () => {
          const tasks = await apiClient.get<ZetkinTask[]>(
            `/api/orgs/${orgId}/campaigns/${campId}/surveys`
          );
          return tasks.map((survey) => ({ id: survey.id }));
        },
      }
    );

    const surveyList = surveysSlice.surveyList;
    const surveysFuture = loadListIfNecessary(surveyList, dispatch, {
      actionOnLoad: () => surveysLoad(),
      actionOnSuccess: (data) => surveysLoaded(data),
      loader: () =>
        apiClient.get<ZetkinSurvey[]>(
          `/api/orgs/${orgId}/campaigns/${campId}/surveys`
        ),
    });

    if (surveyIdsFuture.data && surveysFuture.data) {
      const surveys = surveysFuture.data;
      const surveyIds = surveyIdsFuture.data;

      surveyIds.forEach(({ id: surveyId }) => {
        const survey = surveys.find((item) => item.id === surveyId);

        if (survey) {
          activities.push({
            data: survey,
            kind: ACTIVITIES.SURVEY,
            visibleFrom: getUTCDateWithoutTime(survey.published || null),
            visibleUntil: getUTCDateWithoutTime(survey.expires || null),
          });
        }
      });
    }

    const callAssignmentIdsByCampaignId =
      callAssignmentsSlice.callAssignmentIdsByCampaignId[campId];
    const callAssignmentIdsFuture = loadListIfNecessary(
      callAssignmentIdsByCampaignId,
      dispatch,
      {
        actionOnLoad: () => campaignCallAssignmentsLoad(campId),
        actionOnSuccess: (data) =>
          campaignCallAssignmentsLoaded([campId, data]),
        loader: async () => {
          const callAssignments = await apiClient.get<ZetkinCallAssignment[]>(
            `/api/orgs/${orgId}/campaigns/${campId}/call_assignments`
          );
          return callAssignments.map((ca) => ({ id: ca.id }));
        },
      }
    );

    const callAssignmentList = callAssignmentsSlice.assignmentList;
    const callAssignmentsFuture = loadListIfNecessary(
      callAssignmentList,
      dispatch,
      {
        actionOnLoad: () => callAssignmentsLoad(),
        actionOnSuccess: (data) => callAssignmentsLoaded(data),
        loader: () =>
          apiClient.get<ZetkinCallAssignment[]>(
            `/api/orgs/${orgId}/campaigns/${campId}/call_assignments`
          ),
      }
    );

    if (callAssignmentIdsFuture.data && callAssignmentsFuture.data) {
      const callAssignments = callAssignmentsFuture.data;
      const callAssignmentIds = callAssignmentIdsFuture.data;

      callAssignmentIds.forEach(({ id: caId }) => {
        const ca = callAssignments.find((item) => item.id === caId);

        if (ca) {
          activities.push({
            data: ca,
            kind: ACTIVITIES.CALL_ASSIGNMENT,
            visibleFrom: getUTCDateWithoutTime(ca.start_date),
            visibleUntil: getUTCDateWithoutTime(ca.end_date),
          });
        }
      });
    }
  } else {
    const tasksList = tasksSlice.tasksList;
    const allTasksFuture = loadListIfNecessary(tasksList, dispatch, {
      actionOnLoad: () => tasksLoad(),
      actionOnSuccess: (data) => tasksLoaded(data),
      loader: () => apiClient.get<ZetkinTask[]>(`/api/orgs/${orgId}/tasks`),
    });

    if (allTasksFuture.data) {
      const allTasks = allTasksFuture.data;
      allTasks.forEach((task) => {
        activities.push({
          data: task,
          kind: ACTIVITIES.TASK,
          visibleFrom: getUTCDateWithoutTime(task.published || null),
          visibleUntil: getUTCDateWithoutTime(task.expires || null),
        });
      });
    }

    const surveyList = surveysSlice.surveyList;
    const allSurveysFuture = loadListIfNecessary(surveyList, dispatch, {
      actionOnLoad: () => surveysLoad(),
      actionOnSuccess: (data) => surveysLoaded(data),
      loader: () => apiClient.get<ZetkinSurvey[]>(`/api/orgs/${orgId}/surveys`),
    });

    if (allSurveysFuture.data) {
      const allSurveys = allSurveysFuture.data;
      allSurveys.forEach((survey) => {
        activities.push({
          data: survey,
          kind: ACTIVITIES.SURVEY,
          visibleFrom: getUTCDateWithoutTime(survey.published || null),
          visibleUntil: getUTCDateWithoutTime(survey.expires || null),
        });
      });
    }

    const callAssignmentList = callAssignmentsSlice.assignmentList;
    const allCallAssignmentsFuture = loadListIfNecessary(
      callAssignmentList,
      dispatch,
      {
        actionOnLoad: () => callAssignmentsLoad(),
        actionOnSuccess: (data) => callAssignmentsLoaded(data),
        loader: () =>
          apiClient.get<ZetkinCallAssignment[]>(
            `/api/orgs/${orgId}/call_assignments`
          ),
      }
    );

    if (allCallAssignmentsFuture.data) {
      const allCallAssignments = allCallAssignmentsFuture.data;
      allCallAssignments.forEach((ca) => {
        activities.push({
          data: ca,
          kind: ACTIVITIES.CALL_ASSIGNMENT,
          visibleFrom: getUTCDateWithoutTime(ca.start_date),
          visibleUntil: getUTCDateWithoutTime(ca.end_date),
        });
      });
    }
  }

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

  const startOfToday = new Date(new Date().toISOString().slice(0, 10));
  const weekFromNow = new Date(startOfToday);
  weekFromNow.setDate(startOfToday.getDate() + 8);

  overview.today = sortedAcitvities.filter((activity) => {
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

  overview.tomorrow = sortedAcitvities.filter((activity) => {
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

  overview.alsoThisWeek = sortedAcitvities.filter((activity) => {
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
