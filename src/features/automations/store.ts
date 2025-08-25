import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItemLoad,
  remoteItemUpdated,
  remoteList,
  RemoteList,
  remoteListLoad,
  remoteListLoaded,
} from 'utils/storeUtils';
import { ZetkinBulkAutomation } from './types/api';

export interface AutomationsStoreSlice {
  automationList: RemoteList<ZetkinBulkAutomation>;
}

const initialState: AutomationsStoreSlice = {
  automationList: remoteList(),
};

const automationsSlice = createSlice({
  initialState: initialState,
  name: 'automations',
  reducers: {
    automationCreated: (state, action: PayloadAction<ZetkinBulkAutomation>) => {
      remoteItemUpdated(state.automationList, action.payload);
    },
    automationLoad: (state, action: PayloadAction<number>) => {
      remoteItemLoad(state.automationList, action.payload);
    },
    automationLoaded: (state, action: PayloadAction<ZetkinBulkAutomation>) => {
      remoteItemUpdated(state.automationList, action.payload);
    },
    automationUpdated: (state, action: PayloadAction<ZetkinBulkAutomation>) => {
      remoteItemUpdated(state.automationList, action.payload);
    },
    automationsLoad: (state) => {
      state.automationList = remoteListLoad(state.automationList);
    },
    automationsLoaded: (
      state,
      action: PayloadAction<ZetkinBulkAutomation[]>
    ) => {
      state.automationList = remoteListLoaded(action.payload);
    },
  },
});

export default automationsSlice;
export const {
  automationCreated,
  automationLoad,
  automationLoaded,
  automationUpdated,
  automationsLoad,
  automationsLoaded,
} = automationsSlice.actions;
