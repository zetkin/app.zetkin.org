import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { findOrAddItem, remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinJoinForm, ZetkinJoinSubmission } from './types';

export interface JoinFormsStoreSlice {
  formList: RemoteList<ZetkinJoinForm>;
  submissionList: RemoteList<ZetkinJoinSubmission>;
}

const initialState: JoinFormsStoreSlice = {
  formList: remoteList(),
  submissionList: remoteList(),
};

const joinFormsSlice = createSlice({
  initialState: initialState,
  name: 'joinForms',
  reducers: {
    joinFormCreated: (state, action: PayloadAction<ZetkinJoinForm>) => {
      const form = action.payload;
      const item = findOrAddItem(state.formList, form.id);
      item.loaded = new Date().toISOString();
      item.data = form;
    },
    joinFormLoad: (state, action: PayloadAction<number>) => {
      const formId = action.payload;
      const item = findOrAddItem(state.formList, formId);
      item.isLoading = true;
    },
    joinFormLoaded: (state, action: PayloadAction<ZetkinJoinForm>) => {
      const form = action.payload;
      const item = findOrAddItem(state.formList, form.id);
      item.isLoading = false;
      item.loaded = new Date().toISOString();
      item.data = form;
    },
    joinFormUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [formId, mutating] = action.payload;
      const item = findOrAddItem(state.formList, formId);
      item.mutating = mutating;
    },
    joinFormUpdated: (state, action: PayloadAction<ZetkinJoinForm>) => {
      const form = action.payload;
      const item = findOrAddItem(state.formList, form.id);
      item.data = form;
      item.mutating = [];
      item.loaded = new Date().toISOString();
    },
    joinFormsLoad: (state) => {
      state.formList.isLoading = true;
    },
    joinFormsLoaded: (state, action: PayloadAction<ZetkinJoinForm[]>) => {
      state.formList = remoteList(action.payload);
      state.formList.loaded = new Date().toISOString();
    },
    submissionDeleted: (state, action: PayloadAction<number>) => {
      const submissionId = action.payload;
      const item = state.submissionList.items.find(
        (item) => item.id == submissionId
      );

      if (item) {
        item.deleted = true;
      }
    },
    submissionLoad: (state, action: PayloadAction<number>) => {
      const submissionId = action.payload;
      const item = findOrAddItem(state.submissionList, submissionId);
      item.isLoading = true;
    },
    submissionLoaded: (state, action: PayloadAction<ZetkinJoinSubmission>) => {
      const submission = action.payload;
      const item = findOrAddItem(state.submissionList, submission.id);
      item.isLoading = false;
      item.data = submission;
      item.loaded = new Date().toISOString();
    },
    submissionUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [submissionId, mutating] = action.payload;
      const item = findOrAddItem(state.submissionList, submissionId);
      item.mutating = mutating;
    },
    submissionUpdated: (state, action: PayloadAction<ZetkinJoinSubmission>) => {
      const submission = action.payload;
      const item = findOrAddItem(state.submissionList, submission.id);
      item.mutating = [];
      item.data = submission;
      item.loaded = new Date().toISOString();
    },
    submissionsLoad: (state) => {
      state.submissionList.isLoading = true;
    },
    submissionsLoaded: (
      state,
      action: PayloadAction<ZetkinJoinSubmission[]>
    ) => {
      state.submissionList = remoteList(action.payload);
      state.submissionList.loaded = new Date().toISOString();
    },
  },
});

export default joinFormsSlice;
export const {
  joinFormCreated,
  joinFormLoad,
  joinFormLoaded,
  joinFormUpdate,
  joinFormUpdated,
  joinFormsLoad,
  joinFormsLoaded,
  submissionDeleted,
  submissionLoad,
  submissionLoaded,
  submissionUpdate,
  submissionUpdated,
  submissionsLoad,
  submissionsLoaded,
} = joinFormsSlice.actions;
