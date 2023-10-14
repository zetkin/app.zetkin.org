import addBulkOptions from '../rpc/addBulkOptions';
import dayjs from 'dayjs';
import {
  ELEMENT_TYPE,
  ZetkinOptionsQuestion,
  ZetkinSurvey,
  ZetkinSurveyElement,
  ZetkinSurveyExtended,
  ZetkinSurveyOption,
  ZetkinSurveyTextElement,
  ZetkinTextQuestion,
} from 'utils/types/zetkin';
import {
  elementAdded,
  elementDeleted,
  elementOptionAdded,
  elementOptionDeleted,
  elementUpdated,
  surveyUpdate,
  surveyUpdated,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

type ZetkinSurveyTextQuestionElementPostBody = {
  hidden: boolean;
  question: Omit<ZetkinTextQuestion, 'required'>;
  type: ELEMENT_TYPE.QUESTION;
};

type ZetkinSurveyOptionsQuestionElementPostBody = {
  hidden: boolean;
  question: Omit<ZetkinOptionsQuestion, 'required' | 'options'> & {
    options?: string[];
  };
  type: ELEMENT_TYPE.QUESTION;
};

export type ZetkinSurveyElementPostBody =
  | Partial<Omit<ZetkinSurveyTextElement, 'id'>>
  | ZetkinSurveyTextQuestionElementPostBody
  | ZetkinSurveyOptionsQuestionElementPostBody;

export type TextQuestionPatchBody = {
  question: Partial<ZetkinTextQuestion>;
};

export type OptionsQuestionPatchBody = {
  question: {
    description?: string | null;
    options?: ZetkinSurveyOption[];
    question?: string;
    response_config?: {
      widget_type: 'checkbox' | 'radio' | 'select';
    };
  };
};

export type ZetkinSurveyElementPatchBody =
  | ZetkinSurveyTextElementPatchBody
  | OptionsQuestionPatchBody
  | TextQuestionPatchBody;

type ZetkinSurveyTextElementPatchBody = {
  hidden?: boolean;
  text_block?: {
    content?: string;
    header?: string;
  };
};

type ZetkinSurveyPatchBody = Partial<Omit<ZetkinSurvey, 'id'>>;

type UseSurveyEditingReturn = {
  addElement: (data: ZetkinSurveyElementPostBody) => Promise<void>;
  addElementOption: (elemId: number) => Promise<void>;
  addElementOptionsFromText: (
    elemId: number,
    bulkText: string
  ) => Promise<void>;
  deleteElement: (elemId: number) => Promise<void>;
  deleteElementOption: (elemId: number, optionId: number) => Promise<void>;
  publish: () => Promise<void>;
  unpublish: () => Promise<void>;
  updateElement: (
    elemId: number,
    data: ZetkinSurveyElementPatchBody
  ) => Promise<void>;
  updateSurvey: (data: ZetkinSurveyPatchBody) => Promise<void>;
};

export default function useSurveyMutations(
  orgId: number,
  surveyId: number
): UseSurveyEditingReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) =>
    state.surveys.surveyList.items.find((item) => item.id == surveyId)
  )?.data;

  async function updateSurvey(data: ZetkinSurveyPatchBody) {
    dispatch(surveyUpdate([surveyId, Object.keys(data)]));
    apiClient
      .patch<ZetkinSurveyExtended>(
        `/api/orgs/${orgId}/surveys/${surveyId}`,
        data
      )
      .then((survey) => {
        dispatch(surveyUpdated(survey));
      });
  }

  async function addElement(data: ZetkinSurveyElementPostBody) {
    apiClient
      .post<ZetkinSurveyElement, ZetkinSurveyElementPostBody>(
        `/api/orgs/${orgId}/surveys/${surveyId}/elements`,
        data
      )
      .then((newElement) => {
        dispatch(elementAdded([surveyId, newElement]));
        return newElement;
      });
  }

  async function addElementOption(elemId: number) {
    const option = await apiClient.post<ZetkinSurveyOption>(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}/options`,
      { text: '' }
    );
    dispatch(elementOptionAdded([surveyId, elemId, option]));
  }

  async function addElementOptionsFromText(elemId: number, bulkText: string) {
    const lines = bulkText.split('\n');
    const options = lines
      .map((str) => str.trim())
      .filter((str) => !!str.length);

    const result = await apiClient.rpc(addBulkOptions, {
      elemId,
      options,
      orgId,
      surveyId,
    });

    result.addedOptions.forEach((option) => {
      dispatch(elementOptionAdded([surveyId, elemId, option]));
    });

    result.removedOptions.forEach((option) => {
      dispatch(elementOptionDeleted([surveyId, elemId, option.id]));
    });
  }

  async function deleteElement(elemId: number) {
    await apiClient.delete(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}`
    );
    dispatch(elementDeleted([surveyId, elemId]));
  }

  async function deleteElementOption(elemId: number, optionId: number) {
    await apiClient.delete(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}/options/${optionId}`
    );
    dispatch(elementOptionDeleted([surveyId, elemId, optionId]));
  }

  async function publish() {
    if (!data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    const { published, expires } = data;

    if (!published && !expires) {
      updateSurvey({
        published: today,
      });
    } else if (!published) {
      const endDate = dayjs(expires);
      if (endDate.isBefore(today)) {
        updateSurvey({
          expires: null,
          published: today,
        });
      } else if (endDate.isAfter(today)) {
        updateSurvey({
          published: today,
        });
      }
    } else if (!expires) {
      // Start date is non-null
      const startDate = dayjs(published);
      if (startDate.isAfter(today)) {
        // End date is null, start date is future
        updateSurvey({
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
        updateSurvey({
          expires: null,
        });
      } else if (startDate.isAfter(today) && endDate.isAfter(today)) {
        // Start is future, end is future
        updateSurvey({
          published: today,
        });
      }
    }
  }

  async function unpublish() {
    if (!data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    updateSurvey({
      expires: today,
    });
  }

  async function updateElement(
    elemId: number,
    data: ZetkinSurveyElementPatchBody
  ) {
    const element = await apiClient.patch<
      ZetkinSurveyElement,
      ZetkinSurveyElementPatchBody
    >(`/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}`, data);
    dispatch(elementUpdated([surveyId, elemId, element]));
  }

  return {
    addElement,
    addElementOption,
    addElementOptionsFromText,
    deleteElement,
    deleteElementOption,
    publish,
    unpublish,
    updateElement,
    updateSurvey,
  };
}
