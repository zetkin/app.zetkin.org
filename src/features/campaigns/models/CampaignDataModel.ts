import CallAssignmentsRepo from 'features/callAssignments/repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import SurveysRepo from 'features/surveys/repos/SurveysRepo';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import {
  ZetkinCallAssignment,
  ZetkinCallAssignmentPostBody,
  ZetkinSurvey,
  ZetkinSurveyPostBody,
} from 'utils/types/zetkin';

export default class CampaignDataModel extends ModelBase {
  private _callAssignmentsRepo: CallAssignmentsRepo;
  private _campaignId: number;
  private _env: Environment;
  private _orgId: number;
  private _surveysRepo: SurveysRepo;

  constructor(env: Environment, orgId: number, campaignId: number) {
    super();
    this._env = env;
    this._orgId = orgId;
    this._campaignId = campaignId;
    this._callAssignmentsRepo = new CallAssignmentsRepo(env);
    this._surveysRepo = new SurveysRepo(env);
  }

  createCallAssignment(
    campaignBody: ZetkinCallAssignmentPostBody
  ): IFuture<ZetkinCallAssignment> {
    const promise = this._callAssignmentsRepo
      .createCallAssignment(campaignBody, this._orgId, this._campaignId)
      .then((assignment: ZetkinCallAssignment) => {
        this._env.router.push(
          `/organize/${this._orgId}/projects/${this._campaignId}/callassignments/${assignment.id}`
        );
        return assignment;
      });
    return new PromiseFuture(promise);
  }

  createSurvey(surveyBody: ZetkinSurveyPostBody): IFuture<ZetkinSurvey> {
    const promise = this._surveysRepo
      .createSurvey(surveyBody, this._orgId, this._campaignId)
      .then((survey: ZetkinSurvey) => {
        this._env.router.push(
          `/organize/${this._orgId}/projects/${this._campaignId}/surveys/${survey.id}`
        );
        return survey;
      });
    return new PromiseFuture(promise);
  }
}
