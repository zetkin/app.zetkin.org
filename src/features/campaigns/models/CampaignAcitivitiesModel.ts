import { CallAssignmentData } from 'features/callAssignments/apiTypes';
import CallAssignmentsRepo from 'features/callAssignments/repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
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

  getActvities(): IFuture<CampaignAcitivity[]> {
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

    const callAssignments: CampaignAcitivity[] = callAssignmentsFuture.data.map(
      (ca) => ({
        ...ca,
        kind: ACTIVITIES.CALL_ASSIGNMENT,
      })
    );

    const surveys: CampaignAcitivity[] = surveysFuture.data.map((survey) => ({
      ...survey,
      kind: ACTIVITIES.SURVEY,
    }));

    const tasks: CampaignAcitivity[] = tasksFuture.data.map((task) => ({
      ...task,
      kind: ACTIVITIES.TASK,
    }));

    return new ResolvedFuture([...callAssignments, ...surveys, ...tasks]);
  }
}
