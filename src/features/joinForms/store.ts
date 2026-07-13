import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItemLoad,
  remoteItemDeleted,
  remoteItemUpdate,
  remoteItemUpdated,
  remoteList,
  RemoteList,
  remoteListLoad,
  remoteListLoaded,
} from 'utils/storeUtils';
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
      remoteItemUpdated(state.formList, form);
    },
    joinFormDeleted: (state, action: PayloadAction<number>) => {
      const formId = action.payload;
      remoteItemDeleted(state.formList, formId);
    },
    joinFormLoad: (state, action: PayloadAction<number>) => {
      const formId = action.payload;
      remoteItemLoad(state.formList, formId);
    },
    joinFormLoaded: (state, action: PayloadAction<ZetkinJoinForm>) => {
      const form = action.payload;
      remoteItemUpdated(state.formList, form);
    },
    joinFormUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [formId, mutating] = action.payload;
      remoteItemUpdate(state.formList, formId, mutating);
    },
    joinFormUpdated: (state, action: PayloadAction<ZetkinJoinForm>) => {
      const form = action.payload;
      remoteItemUpdated(state.formList, form);
    },
    joinFormsLoad: (state) => {
      state.formList = remoteListLoad(state.formList);
    },
    joinFormsLoaded: (state, action: PayloadAction<ZetkinJoinForm[]>) => {
      state.formList = remoteListLoaded(action.payload);
    },
    submissionDeleted: (state, action: PayloadAction<number>) => {
      const submissionId = action.payload;
      remoteItemDeleted(state.submissionList, submissionId);
    },
    submissionLoad: (state, action: PayloadAction<number>) => {
      const submissionId = action.payload;
      remoteItemLoad(state.submissionList, submissionId);
    },
    submissionLoaded: (state, action: PayloadAction<ZetkinJoinSubmission>) => {
      const submission = action.payload;
      remoteItemUpdated(state.submissionList, submission);
    },
    submissionUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [submissionId, mutating] = action.payload;
      remoteItemUpdate(state.submissionList, submissionId, mutating);
    },
    submissionUpdated: (state, action: PayloadAction<ZetkinJoinSubmission>) => {
      const submission = action.payload;
      remoteItemUpdated(state.submissionList, submission);
    },
    submissionsLoad: (state) => {
      state.submissionList = remoteListLoad(state.submissionList);
    },
    submissionsLoaded: (
      state,
      action: PayloadAction<ZetkinJoinSubmission[]>
    ) => {
      const submissions = action.payload;
      state.submissionList = remoteListLoaded(submissions);
    },
  },
});

export default joinFormsSlice;
export const {
  joinFormCreated,
  joinFormDeleted,
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
