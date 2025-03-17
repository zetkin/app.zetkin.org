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
  outgoingCalls: RemoteList<ZetkinCall>;
}

const initialState: CallStoreSlice = {
  activeCampaignsList: remoteList(),
  currentCall: remoteItem<ZetkinCall>(0, { data: null, isLoading: false }),
  outgoingCalls: remoteList(),
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
      state.outgoingCalls.items = state.outgoingCalls.items.filter(
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
    },
    outgoingCallsLoad: (state) => {
      state.outgoingCalls.isLoading = true;
    },
    outgoingCallsLoaded: (state, action: PayloadAction<ZetkinCall[]>) => {
      state.outgoingCalls = remoteList(action.payload);
      state.outgoingCalls.loaded = new Date().toISOString();
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
  outgoingCallsLoad,
  outgoingCallsLoaded,
} = CallSlice.actions;
