import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItemCreatedWithData,
  remoteItemLoad,
  remoteItemLoaded,
  remoteItemUpdated,
  remoteItemDeleted,
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import {
  AreaCardData,
  ZetkinAreaAssignmentStats,
  ZetkinAreaAssignment,
  ZetkinAreaAssignmentSession,
  ZetkinLocation,
  ZetkinAssignmentAreaStats,
  SessionDeletedPayload,
} from './types';

export interface AreaAssignmentsStoreSlice {
  areaGraphByAssignmentId: Record<
    string,
    RemoteList<AreaCardData & { id: string }>
  >;
  areaStatsByAssignmentId: Record<
    string,
    RemoteItem<ZetkinAssignmentAreaStats & { id: string }>
  >;
  areaAssignmentList: RemoteList<ZetkinAreaAssignment>;
  sessionsByAssignmentId: Record<
    string,
    RemoteList<ZetkinAreaAssignmentSession & { id: number }>
  >;
  locationList: RemoteList<ZetkinLocation>;
  statsByAreaAssId: Record<
    string,
    RemoteItem<ZetkinAreaAssignmentStats & { id: string }>
  >;
}

const initialState: AreaAssignmentsStoreSlice = {
  areaAssignmentList: remoteList(),
  areaGraphByAssignmentId: {},
  areaStatsByAssignmentId: {},
  locationList: remoteList(),
  sessionsByAssignmentId: {},
  statsByAreaAssId: {},
};

const areaAssignmentSlice = createSlice({
  initialState: initialState,
  name: 'areaAssignments',
  reducers: {
    areaAssignmentCreated: (
      state,
      action: PayloadAction<ZetkinAreaAssignment>
    ) => {
      const areaAssignment = action.payload;
      remoteItemCreatedWithData(state.areaAssignmentList, areaAssignment);
    },
    areaAssignmentDeleted: (state, action: PayloadAction<number>) => {
      const areaAssId = action.payload;
      remoteItemDeleted(state.areaAssignmentList, areaAssId);
    },
    areaAssignmentLoad: (state, action: PayloadAction<string>) => {
      const areaAssId = action.payload;
      remoteItemLoad(state.areaAssignmentList, areaAssId);
    },
    areaAssignmentLoaded: (
      state,
      action: PayloadAction<ZetkinAreaAssignment>
    ) => {
      const areaAssignment = action.payload;
      remoteItemLoaded(state.areaAssignmentList, areaAssignment);
    },
    areaAssignmentSessionCreated: (
      state,
      action: PayloadAction<ZetkinAreaAssignmentSession>
    ) => {
      const session = action.payload;
      if (!state.sessionsByAssignmentId[session.assignment.id]) {
        state.sessionsByAssignmentId[session.assignment.id] = remoteList();
      }
      const item = remoteItem(session.assignment.id, {
        data: { ...session, id: session.assignee.id },
        loaded: new Date().toISOString(),
      });

      state.sessionsByAssignmentId[session.assignment.id].items.push(item);

      const hasStatsItem = !!state.areaStatsByAssignmentId[
        session.assignment.id
      ].data?.stats.find((statsItem) => statsItem.areaId == session.area.id);

      if (!hasStatsItem) {
        state.areaStatsByAssignmentId[session.assignment.id].isStale = true;
      }
    },
    areaAssignmentSessionsLoad: (state, action: PayloadAction<string>) => {
      const assignmentId = action.payload;

      if (!state.sessionsByAssignmentId[assignmentId]) {
        state.sessionsByAssignmentId[assignmentId] = remoteList();
      }

      state.sessionsByAssignmentId[assignmentId].isLoading = true;
    },
    areaAssignmentSessionsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinAreaAssignmentSession[]]>
    ) => {
      const [assignmentId, sessions] = action.payload;

      state.sessionsByAssignmentId[assignmentId] = remoteList(
        sessions.map((session) => ({ ...session, id: session.assignee.id }))
      );

      state.sessionsByAssignmentId[assignmentId].loaded =
        new Date().toISOString();
    },
    areaAssignmentUpdated: (
      state,
      action: PayloadAction<ZetkinAreaAssignment>
    ) => {
      const updatedArea = action.payload;
      remoteItemUpdated(state.areaAssignmentList, updatedArea);
    },
    areaAssignmentsLoad: (state) => {
      state.areaAssignmentList.isLoading = true;
    },
    areaAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinAreaAssignment[]>
    ) => {
      state.areaAssignmentList = remoteList(action.payload);
      state.areaAssignmentList.loaded = new Date().toISOString();
    },
    areaGraphLoad: (state, action: PayloadAction<string>) => {
      const assignmentId = action.payload;

      if (!state.areaGraphByAssignmentId[assignmentId]) {
        state.areaGraphByAssignmentId[assignmentId] = remoteList();
      }

      state.areaGraphByAssignmentId[assignmentId].isLoading = true;
    },
    areaGraphLoaded: (
      state,
      action: PayloadAction<[string, AreaCardData[]]>
    ) => {
      const [assignmentId, graphData] = action.payload;

      state.areaGraphByAssignmentId[assignmentId] = remoteList(
        graphData.map((data) => ({ ...data, id: data.area.id }))
      );

      state.areaGraphByAssignmentId[assignmentId].loaded =
        new Date().toISOString();
    },
    areaStatsLoad: (state, action: PayloadAction<string>) => {
      const areaAssId = action.payload;

      if (!state.areaStatsByAssignmentId[areaAssId]) {
        state.areaStatsByAssignmentId[areaAssId] = remoteItem(areaAssId);
      }
      const statsItem = state.areaStatsByAssignmentId[areaAssId];

      state.areaStatsByAssignmentId[areaAssId] = remoteItem(areaAssId, {
        data: statsItem?.data || null,
        isLoading: true,
      });
    },
    areaStatsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinAssignmentAreaStats]>
    ) => {
      const [areaAssId, stats] = action.payload;

      state.areaStatsByAssignmentId[areaAssId] = remoteItem(areaAssId, {
        data: { id: areaAssId, ...stats },
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });
    },
    locationCreated: (state, action: PayloadAction<ZetkinLocation>) => {
      const location = action.payload;
      remoteItemCreatedWithData(state.locationList, location);
    },
    locationUpdated: (state, action: PayloadAction<ZetkinLocation>) => {
      const updatedLocation = action.payload;
      remoteItemUpdated(state.locationList, updatedLocation);
    },
    locationsInvalidated: (state) => {
      state.locationList.isStale = true;
    },
    locationsLoad: (state) => {
      state.locationList.isLoading = true;
    },
    locationsLoaded: (state, action: PayloadAction<ZetkinLocation[]>) => {
      const timestamp = new Date().toISOString();
      const locations = action.payload;
      state.locationList = remoteList(locations);
      state.locationList.loaded = timestamp;
      state.locationList.items.forEach((item) => (item.loaded = timestamp));
    },

    sessionDeleted: (state, action: PayloadAction<SessionDeletedPayload>) => {
      const { areaId, assignmentId, assigneeId } = action.payload;

      const sessionsList = state.sessionsByAssignmentId[assignmentId];

      if (sessionsList) {
        const filteredSessions = sessionsList.items.filter(
          (item) =>
            !(
              item.data?.area.id === areaId &&
              item.data?.assignee.id === assigneeId
            )
        );
        state.sessionsByAssignmentId[assignmentId] = {
          ...sessionsList,
          items: filteredSessions,
        };
      }
    },
    statsLoad: (state, action: PayloadAction<string>) => {
      const areaAssId = action.payload;

      if (!state.statsByAreaAssId[areaAssId]) {
        state.statsByAreaAssId[areaAssId] = remoteItem(areaAssId);
      }
      const statsItem = state.statsByAreaAssId[areaAssId];

      state.statsByAreaAssId[areaAssId] = remoteItem(areaAssId, {
        data: statsItem?.data || null,
        isLoading: true,
      });
    },
    statsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinAreaAssignmentStats]>
    ) => {
      const [areaAssId, stats] = action.payload;

      state.statsByAreaAssId[areaAssId] = remoteItem(areaAssId, {
        data: { id: areaAssId, ...stats },
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });
    },
  },
});

export default areaAssignmentSlice;
export const {
  areaGraphLoad,
  areaGraphLoaded,
  areaStatsLoad,
  areaStatsLoaded,
  areaAssignmentCreated,
  areaAssignmentDeleted,
  areaAssignmentLoad,
  areaAssignmentLoaded,
  areaAssignmentUpdated,
  areaAssignmentsLoad,
  areaAssignmentsLoaded,
  areaAssignmentSessionCreated,
  areaAssignmentSessionsLoad,
  areaAssignmentSessionsLoaded,
  locationCreated,
  locationsInvalidated,
  locationsLoad,
  locationsLoaded,
  locationUpdated,
  sessionDeleted,
  statsLoad,
  statsLoaded,
} = areaAssignmentSlice.actions;
