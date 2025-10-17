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

type QueryStatsWithId = {
  id: string | number;
  stats: ZetkinSmartSearchFilterStats[];
};

export interface smartSearchStoreSlice {
  queryList: RemoteList<ZetkinQuery>;
  statsByFilterSpec: Record<string, RemoteItem<QueryStatsWithId>>;
  statsByQueryId: Record<number | string, RemoteItem<QueryStatsWithId>>;
}

const initialState: smartSearchStoreSlice = {
  queryList: remoteList(),
  statsByFilterSpec: {},
  statsByQueryId: {},
};

const smartSearchSlice = createSlice({
  initialState: initialState,
  name: 'smartSearch',
  reducers: {
    ephemeralStatsLoad: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (!state.statsByFilterSpec[key]) {
        state.statsByFilterSpec[key] = remoteItem<QueryStatsWithId>(key);
      }
      state.statsByFilterSpec[key].isLoading = true;
    },
    ephemeralStatsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinSmartSearchFilterStats[]]>
    ) => {
      const [key, filterStats] = action.payload;
      state.statsByFilterSpec[key].data = {
        // This property needs to be called `id` to meet the requirements
        // of RemoteItem, but really it will be the JSON serialization of
        // the filters in the query.
        id: key,
        stats: filterStats,
      };
      state.statsByFilterSpec[key].isLoading = false;
      state.statsByFilterSpec[key].loaded = new Date().toISOString();
    },
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
    queryStatsLoad: (state, action: PayloadAction<number>) => {
      const queryId = action.payload;
      if (!state.statsByQueryId[queryId]) {
        state.statsByQueryId[queryId] = remoteItem<QueryStatsWithId>(queryId);
      }
      state.statsByQueryId[queryId].isLoading = true;
    },
    queryStatsLoaded: (state, action: PayloadAction<QueryStatsWithId>) => {
      const queryId = action.payload.id;
      state.statsByQueryId[queryId].data = action.payload;
      state.statsByQueryId[queryId].isLoading = false;
      state.statsByQueryId[queryId].loaded = new Date().toISOString();
    },
    queryUpdated: (state, action: PayloadAction<ZetkinQuery>) => {
      remoteItemUpdated(state.queryList, action.payload);
      if (state.statsByQueryId[action.payload.id]) {
        state.statsByQueryId[action.payload.id].isStale = true;
      }
    },
  },
});

export default smartSearchSlice;
export const {
  queriesLoad,
  queriesLoaded,
  queryLoad,
  queryLoaded,
  queryStatsLoad,
  queryStatsLoaded,
  queryUpdated,
  ephemeralStatsLoad,
  ephemeralStatsLoaded,
} = smartSearchSlice.actions;
