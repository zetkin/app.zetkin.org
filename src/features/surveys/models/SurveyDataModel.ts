import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import SurveysRepo from '../repos/SurveysRepo';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

export default class SurveyDataModel extends ModelBase {
  private _orgId: number;
  private _repo: SurveysRepo;
  private _surveyId: number;

  constructor(env: Environment, orgId: number, surveyId: number) {
    super();
    this._orgId = orgId;
    this._surveyId = surveyId;
    this._repo = new SurveysRepo(env);
  }

  deleteElement(elemId: number) {
    this._repo.deleteSurveyElement(this._orgId, this._surveyId, elemId);
  }

  getData(): IFuture<ZetkinSurveyExtended> {
    return this._repo.getSurvey(this._orgId, this._surveyId);
  }

  setTitle(title: string) {
    this._repo.updateSurvey(this._orgId, this._surveyId, { title });
  }
}
