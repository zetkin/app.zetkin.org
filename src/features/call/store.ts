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
}

const initialState: CallStoreSlice = {
  activeCampaignsList: remoteList(),
  currentCall: remoteItem<ZetkinCall>(0, { data: null, isLoading: false }),
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
    currentCallDeleted: (state) => {
      state.currentCall.deleted = true;
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
