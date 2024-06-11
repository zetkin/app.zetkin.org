import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinJoinForm } from './types';
import { findOrAddItem, remoteList, RemoteList } from 'utils/storeUtils';

export interface JoinFormsStoreSlice {
  formList: RemoteList<ZetkinJoinForm>;
}

const initialState: JoinFormsStoreSlice = {
  formList: remoteList(),
};

const joinFormsSlice = createSlice({
  initialState: initialState,
  name: 'joinForms',
  reducers: {
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
    joinFormsLoad: (state) => {
      state.formList.isLoading = true;
    },
    joinFormsLoaded: (state, action: PayloadAction<ZetkinJoinForm[]>) => {
      state.formList = remoteList(action.payload);
      state.formList.loaded = new Date().toISOString();
    },
  },
});

export default joinFormsSlice;
export const { joinFormLoad, joinFormLoaded, joinFormsLoad, joinFormsLoaded } =
  joinFormsSlice.actions;
