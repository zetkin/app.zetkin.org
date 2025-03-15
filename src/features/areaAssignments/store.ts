import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteListCreated,
  remoteListInvalidated,
  remoteListLoad,
  remoteListLoaded,
  remoteItemLoad,
  remoteItemDeleted,
  remoteItemUpdated,
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
      remoteItemUpdated(state.areaAssignmentList, areaAssignment);
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
      remoteItemUpdated(state.areaAssignmentList, areaAssignment);
    },
    areaAssignmentSessionCreated: (
      state,
      action: PayloadAction<ZetkinAreaAssignmentSession>
    ) => {
      const session = action.payload;

      state.sessionsByAssignmentId[session.assignment.id] ||= remoteListCreated(
        state.sessionsByAssignmentId[session.assignment.id]
      );
      remoteItemUpdated(state.sessionsByAssignmentId[session.assignment.id], {
        ...session,
        id: session.assignee.id,
      });

      const hasStatsItem = !!state.areaStatsByAssignmentId[
        session.assignment.id
      ].data?.stats.find((statsItem) => statsItem.areaId == session.area.id);

      if (!hasStatsItem) {
        state.areaStatsByAssignmentId[session.assignment.id].isStale = true;
      }
    },
    areaAssignmentSessionsLoad: (state, action: PayloadAction<string>) => {
      const assignmentId = action.payload;
      const areaAssignmentList = state.sessionsByAssignmentId[assignmentId];
      state.sessionsByAssignmentId[assignmentId] =
        remoteListLoad(areaAssignmentList);
    },
    areaAssignmentSessionsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinAreaAssignmentSession[]]>
    ) => {
      const [assignmentId, sessions] = action.payload;

      const loadedAreaAssignments = sessions.map((session) => ({
        ...session,
        id: session.assignee.id,
      }));

      state.sessionsByAssignmentId[assignmentId] = remoteListLoaded(
        loadedAreaAssignments
      );
    },
    areaAssignmentUpdated: (
      state,
      action: PayloadAction<ZetkinAreaAssignment>
    ) => {
      const updatedArea = action.payload;
      remoteItemUpdated(state.areaAssignmentList, updatedArea);
    },
    areaAssignmentsLoad: (state) => {
      state.areaAssignmentList = remoteListLoad(state.areaAssignmentList);
    },
    areaAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinAreaAssignment[]>
    ) => {
      state.areaAssignmentList = remoteListLoaded(action.payload);
    },
    areaGraphLoad: (state, action: PayloadAction<string>) => {
      const assignmentId = action.payload;
      state.areaGraphByAssignmentId[assignmentId] = remoteListLoad(
        state.areaGraphByAssignmentId[assignmentId]
      );
    },
    areaGraphLoaded: (
      state,
      action: PayloadAction<[string, AreaCardData[]]>
    ) => {
      const [assignmentId, graphData] = action.payload;
      const loadedAreaGraphs = graphData.map((data) => ({
        ...data,
        id: data.area.id,
      }));

      state.areaGraphByAssignmentId[assignmentId] =
        remoteListLoaded(loadedAreaGraphs);
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
      remoteItemUpdated(state.locationList, location);
    },
    locationUpdated: (state, action: PayloadAction<ZetkinLocation>) => {
      const updatedLocation = action.payload;
      remoteItemUpdated(state.locationList, updatedLocation);
    },
    locationsInvalidated: (state) => {
      state.locationList = remoteListInvalidated(state.locationList);
    },
    locationsLoad: (state) => {
      state.locationList = remoteListLoad(state.locationList);
    },
    locationsLoaded: (state, action: PayloadAction<ZetkinLocation[]>) => {
      const locations = action.payload;
      state.locationList = remoteListLoaded(locations);
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
