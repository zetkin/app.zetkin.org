import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinJoinForm } from './types';
import { remoteList, RemoteList } from 'utils/storeUtils';

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
export const { joinFormsLoad, joinFormsLoaded } = joinFormsSlice.actions;
