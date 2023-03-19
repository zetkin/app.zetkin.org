import CallAssignmentsRepo from 'features/callAssignments/repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import SurveysRepo from 'features/surveys/repos/SurveysRepo';
import TasksRepo from 'features/tasks/repos/TasksRepo';
import { dateOrNull, isInFuture } from 'utils/dateUtils';
import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';
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

type CallAssignmentActivity = CampaignActivityBase & {
  data: ZetkinCallAssignment;
  kind: ACTIVITIES.CALL_ASSIGNMENT;
};

type SurveyActivity = CampaignActivityBase & {
  data: ZetkinSurveyExtended;
  kind: ACTIVITIES.SURVEY;
};

type TaskActivity = CampaignActivityBase & {
  data: ZetkinTask;
  kind: ACTIVITIES.TASK;
};

export type CampaignActivity =
  | CallAssignmentActivity
  | SurveyActivity
  | TaskActivity;

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

  getActivitiesByDay(
    date: string,
    campaignId?: number
  ): IFuture<CampaignActivity[]> {
    const activitiesFuture = campaignId
      ? this.getCampaignActivities(campaignId)
      : this.getCurrentActivities();

    const filtered = activitiesFuture.data?.filter((activity) => {
      return (
        activity.startDate?.toISOString().slice(0, 10) == date ||
        activity.endDate?.toISOString().slice(0, 10) == date
      );
    });

    if (filtered) {
      return new ResolvedFuture(filtered);
    } else {
      return activitiesFuture;
    }
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
        endDate: dateOrNull(ca.end_date),
        kind: ACTIVITIES.CALL_ASSIGNMENT,
        startDate: dateOrNull(ca.start_date),
      }));

    const surveys: CampaignActivity[] = surveysFuture.data
      .filter((survey) => !survey.expires || isInFuture(survey.expires))
      .map((survey) => ({
        data: survey,
        endDate: dateOrNull(survey.expires),
        kind: ACTIVITIES.SURVEY,
        startDate: dateOrNull(survey.published),
      }));

    const tasks: CampaignActivity[] = tasksFuture.data
      .filter((task) => !task.expires || isInFuture(task.expires))
      .map((task) => ({
        data: task,
        endDate: dateOrNull(task.expires),
        kind: ACTIVITIES.TASK,
        startDate: dateOrNull(task.published),
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

  getWeekActivities(campaignId?: number): IFuture<CampaignActivity[]> {
    const activitiesFuture = campaignId
      ? this.getCampaignActivities(campaignId)
      : this.getCurrentActivities();

    const startOfToday = new Date(new Date().toISOString().slice(0, 10));
    const weekFromNow = new Date(startOfToday);
    weekFromNow.setDate(startOfToday.getDate() + 8);

    const filtered = activitiesFuture.data?.filter((activity) => {
      return (
        activity.startDate &&
        activity.startDate < weekFromNow &&
        (!activity.endDate || activity.endDate >= startOfToday)
      );
    });

    if (filtered) {
      return new ResolvedFuture(filtered);
    } else {
      return activitiesFuture;
    }
  }
}
