import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import {
  ZetkinSurveyExtended,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';

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
  },
});

export default surveysSlice;
export const { submissionLoad, submissionLoaded, surveyLoad, surveyLoaded } =
  surveysSlice.actions;
