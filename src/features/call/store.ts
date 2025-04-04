import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinCall } from './types';
import {
  remoteItem,
  RemoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinEvent } from 'utils/types/zetkin';

export interface CallStoreSlice {
  activeEventList: RemoteList<ZetkinEvent>;
  currentCall: RemoteItem<ZetkinCall>;
}

const initialState: CallStoreSlice = {
  activeEventList: remoteList(),
  currentCall: remoteItem<ZetkinCall>(0, { data: null, isLoading: false }),
};

const CallSlice = createSlice({
  initialState,
  name: 'call',
  reducers: {
    activeEventsLoad: (state) => {
      state.activeEventList.isLoading = true;
    },
    activeEventsLoaded: (state, action: PayloadAction<ZetkinEvent[]>) => {
      state.activeEventList = remoteList(action.payload);
      state.activeEventList.loaded = new Date().toISOString();
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
  activeEventsLoad,
  activeEventsLoaded,
  currentCallLoad,
  currentCallLoaded,
} = CallSlice.actions;
