import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinCall } from './types';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinEvent } from 'utils/types/zetkin';

export interface CallStoreSlice {
  activeEventList: RemoteList<ZetkinEvent>;
  currentCallId: number | null;
  outgoingCalls: RemoteList<ZetkinCall>;
}

const initialState: CallStoreSlice = {
  activeEventList: remoteList(),
  currentCallId: null,
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
    allocateNewCallLoad: (state) => {
      state.outgoingCalls.isLoading = true;
    },
    allocateNewCallLoaded: (state, action: PayloadAction<ZetkinCall>) => {
      state.currentCallId = action.payload.id;

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

      state.outgoingCalls.isLoading = false;
    },
    currentCallDeleted: (state, action: PayloadAction<number>) => {
      state.currentCallId = null;
      state.outgoingCalls.items = state.outgoingCalls.items.filter(
        (call) => call.id !== action.payload
      );
    },

    outgoingCallsLoad: (state) => {
      state.outgoingCalls.isLoading = true;
    },
    outgoingCallsLoaded: (state, action: PayloadAction<ZetkinCall[]>) => {
      const payloadItems = action.payload.map((call) =>
        remoteItem(call.id, {
          data: call,
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        })
      );

      state.outgoingCalls.items = state.outgoingCalls.items
        .filter(
          (item) => !payloadItems.some((newItem) => newItem.id === item.id)
        )
        .concat(payloadItems);

      state.outgoingCalls.loaded = new Date().toISOString();
      state.outgoingCalls.isLoading = false;
    },
  },
});

export default CallSlice;
export const {
  activeEventsLoad,
  activeEventsLoaded,
  currentCallDeleted,
  allocateNewCallLoad,
  allocateNewCallLoaded,
  outgoingCallsLoad,
  outgoingCallsLoaded,
} = CallSlice.actions;
