import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinCall } from './types';
import { remoteItem, RemoteItem } from 'utils/storeUtils';

export interface CallStoreSlice {
  currentCall: RemoteItem<ZetkinCall>;
}

const initialState: CallStoreSlice = {
  currentCall: remoteItem<ZetkinCall>(0, { data: null, isLoading: false }),
};

const CallSlice = createSlice({
  initialState,
  name: 'call',
  reducers: {
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
export const { currentCallLoad, currentCallLoaded } = CallSlice.actions;
