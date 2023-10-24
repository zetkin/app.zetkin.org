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
  ZetkinDataField,
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
  fieldsList: RemoteList<ZetkinDataField>;
  locationList: RemoteList<ZetkinLocation>;
  statsByFilterSpec: Record<string, RemoteItem<EphemeralQueryStats>>;
}

const initialState: smartSearchStoreSlice = {
  activityList: remoteList(),
  campaignList: remoteList(),
  fieldsList: remoteList(),
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
    activityLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.activityList.items.find((item) => item.id == id);
      state.activityList.items = state.activityList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    activityLoaded: (state, action: PayloadAction<ZetkinActivity>) => {
      const activity = action.payload;
      const item = state.activityList.items.find(
        (item) => item.id == activity.id
      );

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = activity;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    campaignLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.campaignList.items.find((item) => item.id == id);
      state.campaignList.items = state.campaignList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    campaignLoaded: (state, action: PayloadAction<ZetkinCampaign>) => {
      const campaign = action.payload;
      const item = state.campaignList.items.find(
        (item) => item.id == campaign.id
      );

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = campaign;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    campaignsLoad: (state) => {
      state.campaignList.isLoading = true;
    },
    campaignsLoaded: (state, action: PayloadAction<ZetkinCampaign[]>) => {
      state.campaignList = remoteList(action.payload);
      state.campaignList.loaded = new Date().toISOString();
    },
    fieldsLoad: (state) => {
      state.fieldsList.isLoading = true;
    },
    fieldsLoaded: (state, action: PayloadAction<ZetkinDataField[]>) => {
      state.fieldsList = remoteList(action.payload);
      state.fieldsList.loaded = new Date().toISOString();
    },
    locationLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.locationList.items.find((item) => item.id == id);
      state.locationList.items = state.locationList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    locationLoaded: (state, action: PayloadAction<ZetkinLocation>) => {
      const location = action.payload;
      const item = state.locationList.items.find(
        (item) => item.id == location.id
      );

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = location;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
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
  activityLoad,
  activityLoaded,
  activitiesLoad,
  activitiesLoaded,
  campaignLoad,
  campaignLoaded,
  campaignsLoad,
  campaignsLoaded,
  fieldsLoad,
  fieldsLoaded,
  locationLoad,
  locationLoaded,
  locationsLoad,
  locationsLoaded,
  statsLoad,
  statsLoaded,
} = smartSearchSlice.actions;
