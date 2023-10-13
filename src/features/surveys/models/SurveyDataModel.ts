import dayjs from 'dayjs';
import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import SurveysRepo from '../repos/SurveysRepo';
import { ZetkinSurvey, ZetkinSurveyElement } from 'utils/types/zetkin';

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

  getData(): IFuture<ZetkinSurvey> {
    return this._repo.getSurvey(this._orgId, this._surveyId);
  }

  getElements(): IFuture<ZetkinSurveyElement[]> {
    return this._repo.getSurveyElements(this._orgId, this._surveyId);
  }

  publish(): void {
    const { data } = this.getData();
    if (!data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    const { published, expires } = data;

    if (!published && !expires) {
      this._repo.updateSurvey(this._orgId, this._surveyId, {
        published: today,
      });
    } else if (!published) {
      const endDate = dayjs(expires);
      if (endDate.isBefore(today)) {
        this._repo.updateSurvey(this._orgId, this._surveyId, {
          expires: null,
          published: today,
        });
      } else if (endDate.isAfter(today)) {
        this._repo.updateSurvey(this._orgId, this._surveyId, {
          published: today,
        });
      }
    } else if (!expires) {
      // Start date is non-null
      const startDate = dayjs(published);
      if (startDate.isAfter(today)) {
        // End date is null, start date is future
        this._repo.updateSurvey(this._orgId, this._surveyId, {
          published: today,
        });
      }
    } else {
      // Start and end date are non-null
      const startDate = dayjs(published);
      const endDate = dayjs(expires);

      if (
        (startDate.isBefore(today) || startDate.isSame(today)) &&
        (endDate.isBefore(today) || endDate.isSame(today))
      ) {
        // Start is past, end is past
        this._repo.updateSurvey(this._orgId, this._surveyId, {
          expires: null,
        });
      } else if (startDate.isAfter(today) && endDate.isAfter(today)) {
        // Start is future, end is future
        this._repo.updateSurvey(this._orgId, this._surveyId, {
          published: today,
        });
      }
    }
  }

  get surveyIsEmpty(): boolean {
    const { data } = this.getElements();

    if (!data) {
      return true;
    }

    return data.length ? false : true;
  }

  unpublish(): void {
    const { data } = this.getData();
    if (!data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    this._repo.updateSurvey(this._orgId, this._surveyId, {
      expires: today,
    });
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
