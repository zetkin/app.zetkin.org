import dayjs from 'dayjs';

import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import SurveysRepo, {
  OptionsQuestionPatchBody,
  ZetkinSurveyElementPostBody,
} from '../repos/SurveysRepo';

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

  async addElement(element: ZetkinSurveyElementPostBody) {
    const newElement = await this._repo.addElement(
      this._orgId,
      this._surveyId,
      element
    );

    //Add two options to the newly created element.
    this._repo.addElementOption(this._orgId, this._surveyId, newElement.id);
    this._repo.addElementOption(this._orgId, this._surveyId, newElement.id);
  }

  addElementOption(elemId: number) {
    this._repo.addElementOption(this._orgId, this._surveyId, elemId);
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

  getData(): IFuture<ZetkinSurveyExtended> {
    return this._repo.getSurvey(this._orgId, this._surveyId);
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

  get surveyIsEmpty(): boolean {
    const { data } = this.getData();

    if (!data) {
      return true;
    }

    return data.elements.length ? false : true;
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

  updateElementOption(elemId: number, optionId: number, text: string) {
    this._repo.updateElementOption(
      this._orgId,
      this._surveyId,
      elemId,
      optionId,
      text
    );
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

  updateTextBlock(
    elemId: number,
    textBlock: { content: string; header: string }
  ) {
    this._repo.updateElement(this._orgId, this._surveyId, elemId, {
      text_block: textBlock,
    });
  }
}
