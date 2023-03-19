import CallAssignmentsRepo from 'features/callAssignments/repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import SurveysRepo from 'features/surveys/repos/SurveysRepo';
import TasksRepo from 'features/tasks/repos/TasksRepo';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { isInFuture, isSameDate } from 'utils/dateUtils';
import {
  ZetkinCallAssignment,
  ZetkinSurveyExtended,
  ZetkinTask,
} from 'utils/types/zetkin';

export enum ACTIVITIES {
  CALL_ASSIGNMENT = 'callAssignment',
  SURVEY = 'survey',
  TASK = 'task',
}

type CampaignActivityBase = {
  endDate: Date | null;
  startDate: Date | null;
};

export type CallAssignmentActivity = CampaignActivityBase & {
  data: ZetkinCallAssignment;
  kind: ACTIVITIES.CALL_ASSIGNMENT;
};

export type SurveyActivity = CampaignActivityBase & {
  data: ZetkinSurveyExtended;
  kind: ACTIVITIES.SURVEY;
};

export type TaskActivity = CampaignActivityBase & {
  data: ZetkinTask;
  kind: ACTIVITIES.TASK;
};

export type CampaignActivity =
  | CallAssignmentActivity
  | SurveyActivity
  | TaskActivity;

export type ActivityOverview = {
  alsoThisWeek: CampaignActivity[];
  today: CampaignActivity[];
  tomorrow: CampaignActivity[];
};

export default class CampaignActivitiesModel extends ModelBase {
  private _callAssignmentsRepo: CallAssignmentsRepo;
  private _orgId: number;
  private _surveysRepo: SurveysRepo;
  private _tasksRepo: TasksRepo;

  constructor(env: Environment, orgId: number) {
    super();
    this._orgId = orgId;
    this._callAssignmentsRepo = new CallAssignmentsRepo(env);
    this._surveysRepo = new SurveysRepo(env);
    this._tasksRepo = new TasksRepo(env);
  }

  getActivityOverview(campaignId?: number): IFuture<ActivityOverview> {
    const activitiesFuture = campaignId
      ? this.getCampaignActivities(campaignId)
      : this.getCurrentActivities();

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

      overview.today = currentActivities.filter(
        (activity) =>
          (activity.startDate && isSameDate(activity.startDate, todayDate)) ||
          (activity.endDate && isSameDate(activity.endDate, todayDate))
      );
      overview.tomorrow = currentActivities.filter(
        (activity) =>
          (activity.startDate &&
            isSameDate(activity.startDate, tomorrowDate)) ||
          (activity.endDate && isSameDate(activity.endDate, tomorrowDate))
      );

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

        return (
          activity.startDate &&
          activity.startDate < weekFromNow &&
          (!activity.endDate || activity.endDate >= startOfToday)
        );
      });
    }

    return new ResolvedFuture(overview);
  }

  getCampaignActivities(campId: number): IFuture<CampaignActivity[]> {
    const activities = this.getCurrentActivities().data;
    const filtered = activities?.filter(
      (activity) => activity.data.campaign?.id === campId
    );
    return new ResolvedFuture(filtered || []);
  }

  getCurrentActivities(): IFuture<CampaignActivity[]> {
    const callAssignmentsFuture = this._callAssignmentsRepo.getCallAssignments(
      this._orgId
    );
    const surveysFuture = this._surveysRepo.getSurveys(this._orgId);
    const tasksFuture = this._tasksRepo.getTasks(this._orgId);

    if (
      !callAssignmentsFuture.data ||
      !surveysFuture.data ||
      !tasksFuture.data
    ) {
      return new LoadingFuture();
    }

    const callAssignments: CampaignActivity[] = callAssignmentsFuture.data
      .filter((ca) => !ca.end_date || isInFuture(ca.end_date))
      .map((ca) => ({
        data: ca,
        endDate: getUTCDateWithoutTime(ca.end_date),
        kind: ACTIVITIES.CALL_ASSIGNMENT,
        startDate: getUTCDateWithoutTime(ca.start_date),
      }));

    const surveys: CampaignActivity[] = surveysFuture.data
      .filter((survey) => !survey.expires || isInFuture(survey.expires))
      .map((survey) => ({
        data: survey,
        endDate: getUTCDateWithoutTime(survey.expires),
        kind: ACTIVITIES.SURVEY,
        startDate: getUTCDateWithoutTime(survey.published),
      }));

    const tasks: CampaignActivity[] = tasksFuture.data
      .filter((task) => !task.expires || isInFuture(task.expires))
      .map((task) => ({
        data: task,
        endDate: getUTCDateWithoutTime(task.expires || null),
        kind: ACTIVITIES.TASK,
        startDate: getUTCDateWithoutTime(task.published || null),
      }));

    const unsorted = callAssignments.concat(...surveys, ...tasks);

    const sorted = unsorted.sort((first, second) => {
      if (first.startDate === null) {
        return -1;
      } else if (second.startDate === null) {
        return 1;
      }

      return second.startDate.getTime() - first.startDate.getTime();
    });

    return new ResolvedFuture(sorted);
  }

  getStandaloneActivities(): IFuture<CampaignActivity[]> {
    const activities = this.getCurrentActivities().data;
    const filtered = activities?.filter(
      (activity) => activity.data.campaign === null
    );
    return new ResolvedFuture(filtered || []);
  }
}

function getUTCDateWithoutTime(naiveDateString: string | null): Date | null {
  if (!naiveDateString) {
    return null;
  }

  const dateFromNaive = new Date(naiveDateString);
  const utcTime = Date.UTC(
    dateFromNaive.getFullYear(),
    dateFromNaive.getMonth(),
    dateFromNaive.getDate()
  );

  return new Date(utcTime);
}
