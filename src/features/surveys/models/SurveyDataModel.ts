import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import SurveysRepo from '../repos/SurveysRepo';

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

  updateElementOption(elemId: number, optionId: number, text: string) {
    this._repo.updateElementOption(
      this._orgId,
      this._surveyId,
      elemId,
      optionId,
      text
    );
  }

  updateElementOrder(ids: (string | number)[]) {
    this._repo.updateElementOrder(this._orgId, this._surveyId, ids);
  }

  updateOptionOrder(elemId: number, ids: (string | number)[]) {
    this._repo.updateOptionOrder(this._orgId, this._surveyId, elemId, ids);
  }
}
