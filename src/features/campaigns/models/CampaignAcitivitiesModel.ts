import { CallAssignmentData } from 'features/callAssignments/apiTypes';
import CallAssignmentsRepo from 'features/callAssignments/repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { isInFuture } from 'utils/dateUtils';
import { ModelBase } from 'core/models';
import SurveysRepo from 'features/surveys/repos/SurveysRepo';
import TasksRepo from 'features/tasks/repos/TasksRepo';
import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';
import { ZetkinSurveyExtended, ZetkinTask } from 'utils/types/zetkin';

export enum ACTIVITIES {
  CALL_ASSIGNMENT = 'callAssignment',
  SURVEY = 'survey',
  TASK = 'task',
}

export type CampaignAcitivity =
  | (ZetkinSurveyExtended & { kind: ACTIVITIES.SURVEY })
  | (CallAssignmentData & { kind: ACTIVITIES.CALL_ASSIGNMENT })
  | (ZetkinTask & { kind: ACTIVITIES.TASK });

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

  getCampaignActivities(campId: number): IFuture<CampaignAcitivity[]> {
    const activities = this.getCurrentActivities().data;
    const filtered = activities?.filter((activity) => {
      if (activity.campaign !== null) {
        return activity.campaign?.id === campId;
      }
    });
    return new ResolvedFuture(filtered || []);
  }

  getStartsTodayStatusIfExists(startDate : string) {
    var date = new Date(startDate);
    if(date.)
  }

  getCurrentActivities(): IFuture<CampaignAcitivity[]> {
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

    const callAssignments: CampaignAcitivity[] = callAssignmentsFuture.data
      .filter((ca) => !ca.end_date || isInFuture(ca.end_date))
      .map((ca) => ({
        ...ca,
        kind: ACTIVITIES.CALL_ASSIGNMENT,
      }));

    const surveys: CampaignAcitivity[] = surveysFuture.data
      .filter((survey) => !survey.expires || isInFuture(survey.expires))
      .map((survey) => ({
        ...survey,
        kind: ACTIVITIES.SURVEY,
      }));

    const tasks: CampaignAcitivity[] = tasksFuture.data
      .filter((task) => !task.expires || isInFuture(task.expires))
      .map((task) => ({
        ...task,
        kind: ACTIVITIES.TASK,
      }));

    const unsorted = callAssignments.concat(...surveys, ...tasks);

    const sorted = unsorted.sort((first, second) => {
      const firstStartDate = getStartDate(first);
      const secondStartDate = getStartDate(second);

      if (firstStartDate === null) {
        return -1;
      } else if (secondStartDate === null) {
        return 1;
      }

      return secondStartDate.getTime() - firstStartDate.getTime();
    });

    return new ResolvedFuture(sorted);
  }

  getStandaloneActivities(): IFuture<CampaignAcitivity[]> {
    const activities = this.getCurrentActivities().data;

    const filtered = activities?.filter(
      (activity) => activity.campaign === null
    );
    return new ResolvedFuture(filtered || []);
  }

  getActivitiesFilteredByTime(campId: number, timeCondition: string) {
    const allActivities = this.getCampaignActivities(campId).data;

    const settedActivities = allActivities?.filter(
      (activity) => activity !== undefined || activity !== null
    );

    const tasksToday = settedActivities?.map((activity) => {
      if (activity.kind === ACTIVITIES.SURVEY) {
        if (activity.published === null) {
          return null;
        }
        let surveyPublished: string | null = null;

        if (activity.published !== null) {
          surveyPublished = new Date(activity.published)
            .toISOString()
            .slice(0, 10);
        }
        if (surveyPublished === timeCondition) {
          return activity;
        }
      } else if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
        if (activity.start_date === null && activity.end_date === null) {
          return null;
        }
        let caStartDate: string | null = null;
        let caEndDate: string | null = null;
        if (activity.start_date !== null) {
          caStartDate = new Date(activity.start_date)
            .toISOString()
            .slice(0, 10);
        }
        if (activity.end_date !== null) {
          caEndDate = new Date(activity.end_date).toISOString().slice(0, 10);
        }

        if (
          caStartDate === timeCondition ||
          activity.end_date === timeCondition
        ) {
          console.log('inside today');
          return activity;
        }
      } else {
        if (
          activity.deadline == undefined &&
          activity.expires == undefined &&
          activity.published == undefined
        ) {
          return null;
        }

        let taskDeadline: string | null = null;
        let taskExpires: string | null = null;
        let taskPublished: string | null = null;

        if (activity.deadline !== undefined) {
          taskDeadline = new Date(activity.deadline).toISOString().slice(0, 10);

          if (activity.expires !== undefined) {
            taskExpires = new Date(activity.expires).toISOString().slice(0, 10);
          }

          if (activity.published !== undefined)
            taskPublished = new Date(activity.published)
              .toISOString()
              .slice(0, 10);

          if (
            taskDeadline === timeCondition ||
            taskExpires === timeCondition ||
            taskPublished === timeCondition
          ) {
            return activity;
          }
        }
      }
    });
    return tasksToday.filter(
      (activity: CampaignAcitivity) =>
        activity !== null && activity !== undefined
    );
  }

  getActivitiesForTheWeek(campId: number) {
    const allActivities = this.getCampaignActivities(campId).data;

    const settedActivities = allActivities?.filter(
      (activity) => activity !== undefined || activity !== null
    );

    const tasksForTheWeek: any = settedActivities?.map((activity) => {
      if (activity.kind === ACTIVITIES.SURVEY) {
        let surveyPublished: string | null = null;
        if (activity.published !== null) {
          surveyPublished = new Date(activity.published)
            .toISOString()
            .slice(0, 10);
        }

        const isSurveyInThisWeek = isActivityInThisWeek(surveyPublished!);
        console.log('result', isSurveyInThisWeek);

        if (isSurveyInThisWeek) {
          return activity;
        }
      } else if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
        if (activity.start_date === null && activity.end_date === null) {
          return null;
        }

        let caStartDate: string | null = null;
        let caEndDate: string | null = null;
        if (activity.start_date !== null) {
          caStartDate = new Date(activity.start_date)
            .toISOString()
            .slice(0, 10);
        }
        if (activity.end_date !== null) {
          caEndDate = new Date(activity.end_date).toISOString().slice(0, 10);
        }

        const caStartThisWeek = isActivityInThisWeek(caStartDate!);
        const caEndThisWeek = isActivityInThisWeek(caEndDate!);

        if (caStartThisWeek || caEndThisWeek) {
          return activity;
        }
      } else {
        if (
          activity.deadline == undefined &&
          activity.expires == undefined &&
          activity.published == undefined
        ) {
          return null;
        }

        let taskDeadline: string | null = null;
        let taskExpires: string | null = null;
        let taskPublished: string | null = null;

        if (activity.deadline !== undefined) {
          taskDeadline = new Date(activity.deadline).toISOString().slice(0, 10);
        }
        if (activity.expires !== undefined) {
          taskExpires = new Date(activity.expires).toISOString().slice(0, 10);
        }

        if (activity.published !== undefined) {
          taskPublished = new Date(activity.published)
            .toISOString()
            .slice(0, 10);
        }

        const deadlineThisWeek = isActivityInThisWeek(taskDeadline!);
        const expireThisWeek = isActivityInThisWeek(taskExpires!);
        const taskPublishedThisWeek = isActivityInThisWeek(taskPublished!);
        if (taskDeadline || taskExpires || taskPublished) {
          return activity;
        }
      }
    });
    return tasksForTheWeek.filter(
      (activity: CampaignAcitivity) =>
        activity !== null && activity !== undefined
    );
  }
}

function getStartDate(activity: CampaignAcitivity): Date | null {
  if (activity.kind === ACTIVITIES.SURVEY) {
    if (!activity.published) {
      return null;
    }
    return new Date(activity.published);
  } else if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
    if (!activity.start_date) {
      return null;
    }
    return new Date(activity.start_date);
  } else {
    if (!activity.published) {
      return null;
    }
    return new Date(activity.published);
  }
}

function isActivityInThisWeek(date: string) {
  const dateToCheck = new Date(date);
  const todayObj = new Date();
  const todayDate = todayObj.getDate();
  const todayDay = todayObj.getDay();

  // get first date of week
  const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));

  // get last date of week
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

  // if date is equal or within the first and last dates of the week
  if (dateToCheck >= firstDayOfWeek && dateToCheck <= lastDayOfWeek) {
    return true;
  } else {
    return false;
  }
}
