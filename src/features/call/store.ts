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
  outgoingCalls: RemoteList<ZetkinCall>;
}

const initialState: CallStoreSlice = {
  activeEventList: remoteList(),
  currentCall: remoteItem<ZetkinCall>(0, { data: null, isLoading: false }),
  outgoingCalls: remoteList(),
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

      const callExists = state.outgoingCalls.items.some(
        (call) => call.id === action.payload.id
      );
      if (!callExists) {
        state.outgoingCalls.items.push(
          remoteItem(action.payload.id, {
            data: action.payload,
            isLoading: false,
            isStale: false,
            loaded: new Date().toISOString(),
          })
        );
      }
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
  activeEventsLoad,
  activeEventsLoaded,
  currentCallDeleted,
  currentCallLoad,
  currentCallLoaded,
  outgoingCallsLoad,
  outgoingCallsLoaded,
} = CallSlice.actions;
