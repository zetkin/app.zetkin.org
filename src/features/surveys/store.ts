import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurvey,
  ZetkinSurveyElement,
  ZetkinSurveyExtended,
  ZetkinSurveyOption,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';

export interface SurveysStoreSlice {
  submissionList: RemoteList<ZetkinSurveySubmission>;
  surveyList: RemoteList<ZetkinSurveyExtended>;
}

const initialState: SurveysStoreSlice = {
  submissionList: remoteList(),
  surveyList: remoteList(),
};

const surveysSlice = createSlice({
  initialState,
  name: 'surveys',
  reducers: {
    elementAdded: (
      state,
      action: PayloadAction<[number, ZetkinSurveyElement]>
    ) => {
      const [surveyId, newElement] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        surveyItem.data.elements.push(newElement);
      }
    },
    elementDeleted: (state, action: PayloadAction<[number, number]>) => {
      const [surveyId, elemId] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        surveyItem.data.elements = surveyItem.data.elements.filter(
          (elem) => elem.id !== elemId
        );
      }
    },
    elementOptionAdded: (
      state,
      action: PayloadAction<[number, number, ZetkinSurveyOption]>
    ) => {
      const [surveyId, elemId, newOption] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        const elementItem = surveyItem.data.elements.find(
          (element) => element.id === elemId
        );

        if (
          elementItem &&
          elementItem.type === ELEMENT_TYPE.QUESTION &&
          elementItem.question.response_type === RESPONSE_TYPE.OPTIONS
        ) {
          elementItem.question.options?.push(newOption);
        }
      }
    },
    elementOptionDeleted: (
      state,
      action: PayloadAction<[number, number, number]>
    ) => {
      const [surveyId, elemId, optionId] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        const elementItem = surveyItem.data.elements.find(
          (element) => element.id === elemId
        );

        if (
          elementItem &&
          elementItem.type === ELEMENT_TYPE.QUESTION &&
          elementItem.question.response_type === RESPONSE_TYPE.OPTIONS
        ) {
          elementItem.question.options = elementItem.question.options?.filter(
            (option) => option.id !== optionId
          );
        }
      }
    },
    elementOptionUpdated: (
      state,
      action: PayloadAction<[number, number, number, ZetkinSurveyOption]>
    ) => {
      const [surveyId, elemId, optionId, updatedOption] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        const elementItem = surveyItem.data.elements.find(
          (element) => element.id === elemId
        );

        if (
          elementItem &&
          elementItem.type === ELEMENT_TYPE.QUESTION &&
          elementItem.question.response_type === RESPONSE_TYPE.OPTIONS
        ) {
          elementItem.question.options = elementItem.question.options?.map(
            (oldOption) =>
              oldOption.id == optionId ? updatedOption : oldOption
          );
        }
      }
    },
    elementUpdated: (
      state,
      action: PayloadAction<[number, number, ZetkinSurveyElement]>
    ) => {
      const [surveyId, elemId, updatedElement] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        surveyItem.data.elements = surveyItem.data.elements.map((oldElement) =>
          oldElement.id == elemId ? updatedElement : oldElement
        );
      }
    },
    submissionLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.submissionList.items.find((item) => item.id == id);
      state.submissionList.items = state.submissionList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    submissionLoaded: (
      state,
      action: PayloadAction<ZetkinSurveySubmission>
    ) => {
      const submission = action.payload;
      const item = state.submissionList.items.find(
        (item) => item.id == submission.id
      );
      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = submission;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    surveyLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.surveyList.items.find((item) => item.id == id);
      state.surveyList.items = state.surveyList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    surveyLoaded: (state, action: PayloadAction<ZetkinSurveyExtended>) => {
      const survey = action.payload;
      const item = state.surveyList.items.find((item) => item.id == survey.id);
      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = survey;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    surveyUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [surveyId, mutating] = action.payload;
      const item = state.surveyList.items.find((item) => item.id == surveyId);
      if (item) {
        item.mutating = mutating;
      }
    },
    surveyUpdated: (state, action: PayloadAction<ZetkinSurvey>) => {
      const survey = action.payload;
      const item = state.surveyList.items.find((item) => item.id == survey.id);
      if (item) {
        item.data = { ...item.data, ...survey } as ZetkinSurveyExtended;
        item.mutating = [];
      }
    },
  },
});

export default surveysSlice;
export const {
  elementAdded,
  elementDeleted,
  elementOptionAdded,
  elementOptionDeleted,
  elementOptionUpdated,
  elementUpdated,
  submissionLoad,
  submissionLoaded,
  surveyLoad,
  surveyLoaded,
  surveyUpdate,
  surveyUpdated,
} = surveysSlice.actions;
