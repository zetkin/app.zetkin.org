import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import SurveysRepo from '../repos/SurveysRepo';
import { ZetkinSurveyElement } from 'utils/types/zetkin';

export default class SurveyDataModel extends ModelBase {
  private _orgId: number;
  private _repo: SurveysRepo;
  private _surveyId: number;

  addElementOption(elemId: number) {
    this._repo.addElementOption(this._orgId, this._surveyId, elemId);
  }

  async addElementOptionsFromText(elemId: number, bulkText: string) {
    const lines = bulkText.split('\n');
    const nonBlankLines = lines
      .map((str) => str.trim())
      .filter((str) => !!str.length);

    this._repo.addElementOptions(
      this._orgId,
      this._surveyId,
      elemId,
      nonBlankLines
    );
  }

  constructor(env: Environment, orgId: number, surveyId: number) {
    super();
    this._orgId = orgId;
    this._surveyId = surveyId;
    this._repo = new SurveysRepo(env);
  }

  deleteElementOption(elemId: number, optionId: number) {
    this._repo.deleteElementOption(
      this._orgId,
      this._surveyId,
      elemId,
      optionId
    );
  }

  getElements(): IFuture<ZetkinSurveyElement[]> {
    return this._repo.getSurveyElements(this._orgId, this._surveyId);
  }

  get surveyIsEmpty(): boolean {
    const { data } = this.getElements();

    if (!data) {
      return true;
    }

    return data.length ? false : true;
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
