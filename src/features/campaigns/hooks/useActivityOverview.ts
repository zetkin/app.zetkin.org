import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ResolvedFuture } from 'core/caching/futures';
import {
  ACTIVITIES,
  ActivityOverview,
  CampaignActivity,
} from './useCampaignActivities';
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
import { ZetkinSurvey, ZetkinTask } from 'utils/types/zetkin';

export default function useActivitiyOverview(orgId: number, campId?: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const tasksSlice = useAppSelector((state) => state.tasks);
  const surveysSlice = useAppSelector((state) => state.surveys);

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
