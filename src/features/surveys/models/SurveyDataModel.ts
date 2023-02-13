import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import SurveysRepo from '../repos/SurveysRepo';
import { ZetkinSurvey } from 'utils/types/zetkin';

export enum SurveyState {
  UNPUBLISHED = 'unpublished',
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

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

  getData(): IFuture<ZetkinSurvey> {
    return this._repo.getSurvey(this._orgId, this._surveyId);
  }

  setTitle(title: string) {
    this._repo.updateSurvey(this._orgId, this._surveyId, { title });
  }

  get state(): SurveyState {
    const { data } = this.getData();
    if (!data) {
      return SurveyState.UNKNOWN;
    }

    if (data.published) {
      const publishDate = new Date(data.published);
      const now = new Date();

      if (publishDate > now) {
        return SurveyState.SCHEDULED;
      } else {
        if (data.expires) {
          const expiryDate = new Date(data.expires);

          if (expiryDate < now) {
            return SurveyState.UNPUBLISHED;
          }
        }

        return SurveyState.PUBLISHED;
      }
    } else {
      return SurveyState.DRAFT;
    }
  }
}
