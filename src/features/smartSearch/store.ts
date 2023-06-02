import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinSmartSearchFilterStats } from './types';
import { RemoteItem, remoteItem } from 'utils/storeUtils';

type EphemeralQueryStats = {
  // This property needs to be called `id` to meet the requirements
  // of RemoteItem, but really it will be the JSON serialization of
  // the filters in the query.
  id: string;
  stats: ZetkinSmartSearchFilterStats[];
};

export interface smartSearchStoreSlice {
  statsByFilterSpec: Record<string, RemoteItem<EphemeralQueryStats>>;
}

const initialState: smartSearchStoreSlice = {
  statsByFilterSpec: {},
};

const smartSearchSlice = createSlice({
  initialState: initialState,
  name: 'smartSearch',
  reducers: {
    statsLoad: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (!state.statsByFilterSpec[key]) {
        state.statsByFilterSpec[key] = remoteItem<EphemeralQueryStats>(key);
      }
      state.statsByFilterSpec[key].isLoading = true;
    },
    statsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinSmartSearchFilterStats[]]>
    ) => {
      const [key, filterStats] = action.payload;
      state.statsByFilterSpec[key].data = {
        id: key,
        stats: filterStats,
      };
      state.statsByFilterSpec[key].isLoading = false;
      state.statsByFilterSpec[key].loaded = new Date().toISOString();
    },
  },
});

export default smartSearchSlice;
export const { statsLoad, statsLoaded } = smartSearchSlice.actions;
