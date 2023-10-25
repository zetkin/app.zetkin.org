import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinUpdate } from 'zui/ZUITimeline/types';
import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';
import { ZetkinJourney, ZetkinJourneyInstance } from 'utils/types/zetkin';

export interface JourneysStoreSlice {
  journeyInstanceList: RemoteList<ZetkinJourneyInstance>;
  journeyList: RemoteList<ZetkinJourney>;
  timelineUpdatesByInstanceId: Record<
    number,
    RemoteList<ZetkinUpdate & { id: number }>
  >;
}

const initialJourneysState: JourneysStoreSlice = {
  journeyInstanceList: remoteList(),
  journeyList: remoteList(),
  timelineUpdatesByInstanceId: {},
};

const journeysSlice = createSlice({
  initialState: initialJourneysState,
  name: 'journeys',
  reducers: {
    journeyInstanceCreate: (state) => {
      state.journeyInstanceList.isLoading = true;
    },
    journeyInstanceCreated: (
      state,
      action: PayloadAction<ZetkinJourneyInstance>
    ) => {
      const journeyInstance = action.payload;
      state.journeyInstanceList.isLoading = false;
      state.journeyInstanceList.items.push(
        remoteItem(journeyInstance.id, { data: journeyInstance })
      );
    },
    journeyInstanceLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.journeyInstanceList.items.find(
        (item) => item.id == id
      );
      state.journeyInstanceList.items = state.journeyInstanceList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    journeyInstanceLoaded: (
      state,
      action: PayloadAction<ZetkinJourneyInstance>
    ) => {
      const id = action.payload.id;
      const item = state.journeyInstanceList.items.find(
        (item) => item.id == id
      );

      if (!item) {
        throw new Error(
          'Finished loading something that never started loading'
        );
      }

      item.data = action.payload;
      item.loaded = new Date().toISOString();
      item.isLoading = false;
      item.isStale = false;
    },
    journeyInstanceNeedsReload: (state, action: PayloadAction<number>) => {
      const instanceId = action.payload;
      const instanceItem = state.journeyInstanceList.items.find(
        (item) => item.id == instanceId
      );

      if (instanceItem) {
        instanceItem.isStale = true;
      }
    },
    journeyInstanceUpdate: (
      state,
      action: PayloadAction<[number, string[]]>
    ) => {
      const [id, attributes] = action.payload;
      const instanceItem = state.journeyInstanceList.items.find(
        (item) => item.id == id
      );

      if (instanceItem) {
        instanceItem.mutating = instanceItem.mutating
          .filter((attr) => !attributes.includes(attr))
          .concat(attributes);
      }
    },
    journeyInstanceUpdated: (
      state,
      action: PayloadAction<ZetkinJourneyInstance>
    ) => {
      const journeyInstance = action.payload;
      const instanceItem = state.journeyInstanceList.items.find(
        (item) => item.id == journeyInstance.id
      );

      if (instanceItem) {
        instanceItem.data = { ...instanceItem.data, ...journeyInstance };
        instanceItem.mutating = [];
      }
    },
    journeyLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.journeyList.items.find((item) => item.id == id);
      state.journeyList.items = state.journeyList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    journeyLoaded: (state, action: PayloadAction<ZetkinJourney>) => {
      const id = action.payload.id;
      const item = state.journeyList.items.find((item) => item.id == id);

      if (!item) {
        throw new Error(
          'Finished loading something that never started loading'
        );
      }

      item.data = action.payload;
      item.loaded = new Date().toISOString();
      item.isLoading = false;
      item.isStale = false;
    },
    journeysLoad: (state) => {
      state.journeyList.isLoading = true;
    },
    journeysLoaded: (state, action: PayloadAction<ZetkinJourney[]>) => {
      const journeys = action.payload;
      const timestamp = new Date().toISOString();
      state.journeyList = remoteList(journeys);
      state.journeyList.loaded = timestamp;
      state.journeyList.items.forEach((item) => (item.loaded = timestamp));
    },
    timelineUpdatesLoad: (state, action: PayloadAction<number>) => {
      const instanceId = action.payload;
      if (!state.timelineUpdatesByInstanceId[instanceId]) {
        state.timelineUpdatesByInstanceId[instanceId] = remoteList();
      }
      state.timelineUpdatesByInstanceId[instanceId].isLoading = true;
    },
    timelineUpdatesLoaded: (
      state,
      action: PayloadAction<[ZetkinUpdate[], number]>
    ) => {
      const [updates, instanceId] = action.payload;
      const timestamp = new Date().toISOString();

      const updatesWithIds = updates.map((update) => ({
        ...update,
        id: instanceId,
      }));

      state.timelineUpdatesByInstanceId[instanceId] =
        remoteList(updatesWithIds);
      state.timelineUpdatesByInstanceId[instanceId].loaded = timestamp;
    },
  },
});

export default journeysSlice;
export const {
  journeyInstanceCreate,
  journeyInstanceCreated,
  journeyInstanceLoad,
  journeyInstanceLoaded,
  journeyInstanceNeedsReload,
  journeyInstanceUpdate,
  journeyInstanceUpdated,
  journeyLoad,
  journeyLoaded,
  journeysLoad,
  journeysLoaded,
  timelineUpdatesLoad,
  timelineUpdatesLoaded,
} = journeysSlice.actions;
