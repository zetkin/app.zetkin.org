import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import SurveysRepo from '../repos/SurveysRepo';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';

export default class SurveySubmissionsModel extends ModelBase {
  private _orgId: number;
  private _repo: SurveysRepo;
  private _surveyId: number;

  constructor(env: Environment, orgId: number, submissionId: number) {
    super();

    this._orgId = orgId;
    this._surveyId = submissionId;
    this._repo = new SurveysRepo(env);
  }

  getSubmissions(): IFuture<ZetkinSurveySubmission[]> {
    return this._repo.getSurveySubmissions(this._orgId, this._surveyId);
  }
}
