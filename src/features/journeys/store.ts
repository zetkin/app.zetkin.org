import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinUpdate } from 'zui/ZUITimeline/types';
import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';
import {
  ZetkinJourney,
  ZetkinJourneyInstance,
  ZetkinJourneyMilestoneStatus,
} from 'utils/types/zetkin';

export interface JourneysStoreSlice {
  journeyInstanceList: RemoteList<ZetkinJourneyInstance>;
  journeyInstancesBySubjectId: Record<
    number,
    RemoteList<ZetkinJourneyInstance>
  >;
  journeyList: RemoteList<ZetkinJourney>;
  milestonesByInstanceId: Record<
    number,
    RemoteList<ZetkinJourneyMilestoneStatus>
  >;
  timelineUpdatesByInstanceId: Record<number, RemoteList<ZetkinUpdate>>;
}

const initialJourneysState: JourneysStoreSlice = {
  journeyInstanceList: remoteList(),
  journeyInstancesBySubjectId: {},
  journeyList: remoteList(),
  milestonesByInstanceId: {},
  timelineUpdatesByInstanceId: {},
};

const journeysSlice = createSlice({
  initialState: initialJourneysState,
  name: 'journeys',
  reducers: {
    invalidateJourneyInstance: (state, action: PayloadAction<number>) => {
      const instanceId = action.payload;
      const instanceItem = state.journeyInstanceList.items.find(
        (item) => item.id == instanceId
      );

      if (instanceItem) {
        instanceItem.isStale = true;
        if (instanceItem.data) {
          if (state.timelineUpdatesByInstanceId[instanceItem.data?.id]) {
            state.timelineUpdatesByInstanceId[instanceItem.data?.id].isStale =
              true;
          }
        }
      }
    },
    invalidateTimeline: (state, action: PayloadAction<number>) => {
      const instanceId = action.payload;
      if (state.timelineUpdatesByInstanceId[instanceId]) {
        state.timelineUpdatesByInstanceId[instanceId].isStale = true;
      }
    },
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
    journeyInstancesLoad: (state) => {
      state.journeyInstanceList.isLoading = true;
    },
    journeyInstancesLoaded: (
      state,
      action: PayloadAction<ZetkinJourneyInstance[]>
    ) => {
      const journeyInstances = action.payload;
      const timestamp = new Date().toISOString();

      state.journeyInstanceList = remoteList(journeyInstances);
      state.journeyInstanceList.loaded = timestamp;
      state.journeyInstanceList.items.forEach(
        (item) => (item.loaded = timestamp)
      );
    },
    journeyLoad: (state, action: PayloadAction<number>) => {
      const journeyId = action.payload;
      const journeyItem = state.journeyList.items.find(
        (item) => item.id == journeyId
      );

      state.journeyList.items = state.journeyList.items
        .filter((item) => item.id != journeyId)
        .concat([
          remoteItem(journeyId, { data: journeyItem?.data, isLoading: true }),
        ]);
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
    milestonesLoad: (state, action: PayloadAction<number>) => {
      const instanceId = action.payload;
      if (!state.milestonesByInstanceId[instanceId]) {
        state.milestonesByInstanceId[instanceId] = remoteList();
      }
      state.milestonesByInstanceId[instanceId].isLoading = true;
    },
    milestonesLoaded: (
      state,
      action: PayloadAction<[number, ZetkinJourneyMilestoneStatus[]]>
    ) => {
      const [instanceId, milestones] = action.payload;
      const timestamp = new Date().toISOString();
      state.milestonesByInstanceId[instanceId] = remoteList(milestones);
      state.milestonesByInstanceId[instanceId].loaded = timestamp;
    },
    personJourneyInstancesLoad: (state, action: PayloadAction<number>) => {
      const personId = action.payload;
      state.journeyInstancesBySubjectId[personId] = remoteList();
      state.journeyInstancesBySubjectId[personId].isLoading = true;
    },
    personJourneyInstancesLoaded: (
      state,
      action: PayloadAction<[number, ZetkinJourneyInstance[]]>
    ) => {
      const [personId, instances] = action.payload;
      state.journeyInstancesBySubjectId[personId] = remoteList(instances);
      state.journeyInstancesBySubjectId[personId].loaded =
        new Date().toISOString();
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

      state.timelineUpdatesByInstanceId[instanceId] = remoteList(updates);
      state.timelineUpdatesByInstanceId[instanceId].loaded = timestamp;
    },
  },
});

export default journeysSlice;
export const {
  invalidateJourneyInstance,
  invalidateTimeline,
  journeyInstanceCreate,
  journeyInstanceCreated,
  journeyInstanceLoad,
  journeyInstanceLoaded,
  journeyInstanceUpdate,
  journeyInstanceUpdated,
  journeyInstancesLoad,
  journeyInstancesLoaded,
  journeyLoad,
  journeyLoaded,
  journeysLoad,
  journeysLoaded,
  milestonesLoad,
  milestonesLoaded,
  personJourneyInstancesLoad,
  personJourneyInstancesLoaded,
  timelineUpdatesLoad,
  timelineUpdatesLoaded,
} = journeysSlice.actions;
