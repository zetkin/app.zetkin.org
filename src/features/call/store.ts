import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinAction, ZetkinCall } from './types';
import {
  remoteItem,
  RemoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';

export interface CallStoreSlice {
  activeCampaignsList: RemoteList<ZetkinAction>;
  currentCall: RemoteItem<ZetkinCall>;
  unfinishedCalls: ZetkinCall[];
}

const initialState: CallStoreSlice = {
  activeCampaignsList: remoteList(),
  currentCall: remoteItem<ZetkinCall>(0, { data: null, isLoading: false }),
  unfinishedCalls: [],
};

const CallSlice = createSlice({
  initialState,
  name: 'call',
  reducers: {
    activeCampaignsLoad: (state) => {
      state.activeCampaignsList.isLoading = true;
    },
    activeCampaignsLoaded: (state, action: PayloadAction<ZetkinAction[]>) => {
      state.activeCampaignsList = remoteList(action.payload);
      state.activeCampaignsList.loaded = new Date().toISOString();
    },
    currentCallDeleted: (state, action: PayloadAction<number>) => {
      state.currentCall.deleted = true;
      state.unfinishedCalls = state.unfinishedCalls.filter(
        (call) => call.id !== action.payload
      );
    },
    currentCallLoad: (state) => {
      state.currentCall.isLoading = true;
    },
    currentCallLoaded: (state, action: PayloadAction<ZetkinCall>) => {
      state.currentCall = remoteItem(action.payload.id, {
        data: action.payload,
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });

      const callExists = state.unfinishedCalls.some(
        (call) => call.id === action.payload.id
      );

      if (!callExists) {
        state.unfinishedCalls.push(action.payload);
      }
    },
  },
});

export default CallSlice;
export const {
  activeCampaignsLoad,
  activeCampaignsLoaded,
  currentCallDeleted,
  currentCallLoad,
  currentCallLoaded,
} = CallSlice.actions;
