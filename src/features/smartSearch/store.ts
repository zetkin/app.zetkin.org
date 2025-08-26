import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinQuery } from 'utils/types/zetkin';
import { ZetkinSmartSearchFilterStats } from './types';
import {
  RemoteItem,
  remoteItem,
  remoteItemLoad,
  remoteItemUpdated,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';

type EphemeralQueryStats = {
  // This property needs to be called `id` to meet the requirements
  // of RemoteItem, but really it will be the JSON serialization of
  // the filters in the query.
  id: string;
  stats: ZetkinSmartSearchFilterStats[];
};

export interface smartSearchStoreSlice {
  queryList: RemoteList<ZetkinQuery>;
  statsByFilterSpec: Record<string, RemoteItem<EphemeralQueryStats>>;
}

const initialState: smartSearchStoreSlice = {
  queryList: remoteList(),
  statsByFilterSpec: {},
};

const smartSearchSlice = createSlice({
  initialState: initialState,
  name: 'smartSearch',
  reducers: {
    queriesLoad: (state) => {
      state.queryList.isLoading = true;
    },
    queriesLoaded: (state, action: PayloadAction<ZetkinQuery[]>) => {
      state.queryList = remoteList(action.payload);
      state.queryList.loaded = new Date().toISOString();
    },
    queryLoad: (state, action: PayloadAction<number>) => {
      remoteItemLoad(state.queryList, action.payload);
    },
    queryLoaded: (state, action: PayloadAction<ZetkinQuery>) => {
      remoteItemUpdated(state.queryList, action.payload);
    },
    queryUpdated: (state, action: PayloadAction<ZetkinQuery>) => {
      remoteItemUpdated(state.queryList, action.payload);
    },
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
export const {
  queriesLoad,
  queriesLoaded,
  queryLoad,
  queryLoaded,
  queryUpdated,
  statsLoad,
  statsLoaded,
} = smartSearchSlice.actions;
