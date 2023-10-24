import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinSmartSearchFilterStats } from './types';
import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import {
  ZetkinActivity,
  ZetkinCampaign,
  ZetkinLocation,
} from 'utils/types/zetkin';

type EphemeralQueryStats = {
  // This property needs to be called `id` to meet the requirements
  // of RemoteItem, but really it will be the JSON serialization of
  // the filters in the query.
  id: string;
  stats: ZetkinSmartSearchFilterStats[];
};

export interface smartSearchStoreSlice {
  activityList: RemoteList<ZetkinActivity>;
  campaignList: RemoteList<ZetkinCampaign>;
  locationList: RemoteList<ZetkinLocation>;
  statsByFilterSpec: Record<string, RemoteItem<EphemeralQueryStats>>;
}

const initialState: smartSearchStoreSlice = {
  activityList: remoteList(),
  campaignList: remoteList(),
  locationList: remoteList(),
  statsByFilterSpec: {},
};

const smartSearchSlice = createSlice({
  initialState: initialState,
  name: 'smartSearch',
  reducers: {
    activitiesLoad: (state) => {
      state.activityList.isLoading = true;
    },
    activitiesLoaded: (state, action: PayloadAction<ZetkinActivity[]>) => {
      state.activityList = remoteList(action.payload);
      state.activityList.loaded = new Date().toISOString();
    },
    campaignsLoad: (state) => {
      state.campaignList.isLoading = true;
    },
    campaignsLoaded: (state, action: PayloadAction<ZetkinCampaign[]>) => {
      state.campaignList = remoteList(action.payload);
      state.campaignList.loaded = new Date().toISOString();
    },
    locationsLoad: (state) => {
      state.locationList.isLoading = true;
    },
    locationsLoaded: (state, action: PayloadAction<ZetkinLocation[]>) => {
      state.locationList = remoteList(action.payload);
      state.locationList.loaded = new Date().toISOString();
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
  activitiesLoad,
  activitiesLoaded,
  campaignsLoad,
  campaignsLoaded,
  locationsLoad,
  locationsLoaded,
  statsLoad,
  statsLoaded,
} = smartSearchSlice.actions;
