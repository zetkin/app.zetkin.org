import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinEvent, ZetkinQuery } from 'utils/types/zetkin';
import { ZetkinSmartSearchFilterStats } from './types';
import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';

export type EphemeralQueryStats = {
  // This property needs to be called `id` to meet the requirements
  // of RemoteItem, but really it will be the JSON serialization of
  // the filters in the query.
  id: string;
  stats: ZetkinSmartSearchFilterStats[];
};

export interface smartSearchStoreSlice {
  eventsByOrgId: Record<string, RemoteList<ZetkinEvent>>;
  queryList: RemoteList<ZetkinQuery>;
  statsByFilterSpec: Record<string, RemoteItem<EphemeralQueryStats>>;
}

const initialState: smartSearchStoreSlice = {
  eventsByOrgId: {},
  queryList: remoteList(),
  statsByFilterSpec: {},
};

const smartSearchSlice = createSlice({
  initialState: initialState,
  name: 'smartSearch',
  reducers: {
    eventsByOrgLoad: (state, action: PayloadAction<number>) => {
      const orgId = action.payload;
      if (!state.eventsByOrgId[orgId]) {
        state.eventsByOrgId[orgId] = remoteList();
      }
      state.eventsByOrgId[orgId].isLoading = true;
    },
    eventsByOrgLoaded: (
      state,
      action: PayloadAction<[number, ZetkinEvent[]]>
    ) => {
      const [orgId, events] = action.payload;
      state.eventsByOrgId[orgId] = remoteList(events);
      state.eventsByOrgId[orgId].loaded = new Date().toISOString();
    },
    queriesLoad: (state) => {
      state.queryList.isLoading = true;
    },
    queriesLoaded: (state, action: PayloadAction<ZetkinQuery[]>) => {
      state.queryList = remoteList(action.payload);
      state.queryList.loaded = new Date().toISOString();
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
  eventsByOrgLoad,
  eventsByOrgLoaded,
  queriesLoad,
  queriesLoaded,
  statsLoad,
  statsLoaded,
} = smartSearchSlice.actions;
