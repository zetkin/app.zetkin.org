import { CallAssignmentData } from 'features/callAssignments/apiTypes';
import CallAssignmentsRepo from 'features/callAssignments/repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import SurveysRepo from 'features/surveys/repos/SurveysRepo';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';

export enum ACTIVITIES {
  CALL_ASSIGNMENT = 'callAssignment',
  SURVEY = 'survey',
}

export type CampaignAcitivity =
  | (ZetkinSurveyExtended & { kind: ACTIVITIES.SURVEY })
  | (CallAssignmentData & { kind: ACTIVITIES.CALL_ASSIGNMENT });

export default class CampaignActivitiesModel extends ModelBase {
  private _callAssignmentsRepo: CallAssignmentsRepo;
  private _orgId: number;
  private _surveysRepo: SurveysRepo;

  constructor(env: Environment, orgId: number) {
    super();
    this._orgId = orgId;
    this._callAssignmentsRepo = new CallAssignmentsRepo(env);
    this._surveysRepo = new SurveysRepo(env);
  }

  getActvities(): IFuture<CampaignAcitivity[]> {
    const callAssignmentsFuture = this._callAssignmentsRepo.getCallAssignments(
      this._orgId
    );
    const surveysFuture = this._surveysRepo.getSurveys(this._orgId);

    if (!callAssignmentsFuture.data || !surveysFuture.data) {
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

    return new ResolvedFuture([...callAssignments, ...surveys]);
  }
}
