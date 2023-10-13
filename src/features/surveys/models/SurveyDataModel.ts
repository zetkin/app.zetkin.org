import dayjs from 'dayjs';
import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import SurveysRepo, {
  OptionsQuestionPatchBody,
  ZetkinSurveyElementPatchBody,
  ZetkinSurveyElementPostBody,
} from '../repos/SurveysRepo';
import {
  ZetkinSurvey,
  ZetkinSurveyElement,
  ZetkinSurveyTextElement,
} from 'utils/types/zetkin';

export default class SurveyDataModel extends ModelBase {
  private _orgId: number;
  private _repo: SurveysRepo;
  private _surveyId: number;

  addElement(element: ZetkinSurveyElementPostBody) {
    this._repo.addElement(this._orgId, this._surveyId, element);
  }

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

  deleteElement(elemId: number) {
    this._repo.deleteSurveyElement(this._orgId, this._surveyId, elemId);
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

  setDates(published: string | null, expires: string | null): void {
    this._repo.updateSurvey(this._orgId, this._surveyId, {
      expires: expires,
      published: published,
    });
  }

  setTitle(title: string) {
    this._repo.updateSurvey(this._orgId, this._surveyId, { title });
  }

  get surveyIsEmpty(): boolean {
    const { data } = this.getElements();

    if (!data) {
      return true;
    }

    return data.length ? false : true;
  }

  toggleElementHidden(elemId: number, hidden: boolean) {
    this._repo.updateElement(this._orgId, this._surveyId, elemId, { hidden });
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

  updateElement(elemId: number, data: ZetkinSurveyElementPatchBody) {
    this._repo.updateElement(this._orgId, this._surveyId, elemId, data);
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

  updateOpenQuestionBlock(elemId: number, data: ZetkinSurveyElementPatchBody) {
    this._repo.updateElement(this._orgId, this._surveyId, elemId, data);
  }

  updateOptionOrder(elemId: number, ids: (string | number)[]) {
    this._repo.updateOptionOrder(this._orgId, this._surveyId, elemId, ids);
  }

  updateOptionsQuestion(
    elemId: number,
    optionsQuestion: OptionsQuestionPatchBody
  ) {
    this._repo.updateElement(
      this._orgId,
      this._surveyId,
      elemId,
      optionsQuestion
    );
  }

  updateSurveyAccess(access: 'sameorg' | 'suborgs') {
    this._repo.updateSurvey(this._orgId, this._surveyId, {
      org_access: access,
    });
  }

  updateTextBlock(
    elemId: number,
    textBlock: ZetkinSurveyTextElement['text_block']
  ) {
    this._repo.updateElement(this._orgId, this._surveyId, elemId, {
      text_block: textBlock,
    });
  }
}
