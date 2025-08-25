import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
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
export const { automationsLoad, automationsLoaded } = automationsSlice.actions;
