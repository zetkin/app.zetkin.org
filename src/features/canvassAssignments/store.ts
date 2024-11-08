import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  findOrAddItem,
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import {
  ZetkinCanvassAssignmentStats,
  ZetkinCanvassAssignment,
  ZetkinCanvassSession,
  ZetkinPlace,
  AssignmentWithAreas,
  ZetkinAssignmentAreaStats,
  GraphData,
  SessionDeletedPayload,
} from './types';

export interface CanvassAssignmentsStoreSlice {
  areaGraphByAssignmentId: Record<
    string,
    RemoteList<GraphData & { id: string }>
  >;
  areaStatsByAssignmentId: Record<
    string,
    RemoteItem<ZetkinAssignmentAreaStats & { id: string }>
  >;
  canvassAssignmentList: RemoteList<ZetkinCanvassAssignment>;
  sessionsByAssignmentId: Record<
    string,
    RemoteList<ZetkinCanvassSession & { id: number }>
  >;
  myAssignmentsWithAreasList: RemoteList<AssignmentWithAreas>;
  placeList: RemoteList<ZetkinPlace>;
  statsByCanvassAssId: Record<
    string,
    RemoteItem<ZetkinCanvassAssignmentStats & { id: string }>
  >;
}

const initialState: CanvassAssignmentsStoreSlice = {
  areaGraphByAssignmentId: {},
  areaStatsByAssignmentId: {},
  canvassAssignmentList: remoteList(),
  myAssignmentsWithAreasList: remoteList(),
  placeList: remoteList(),
  sessionsByAssignmentId: {},
  statsByCanvassAssId: {},
};

const canvassAssignmentSlice = createSlice({
  initialState: initialState,
  name: 'canvassAssignments',
  reducers: {
    areaGraphLoad: (state, action: PayloadAction<string>) => {
      const assignmentId = action.payload;

      if (!state.areaGraphByAssignmentId[assignmentId]) {
        state.areaGraphByAssignmentId[assignmentId] = remoteList();
      }

      state.areaGraphByAssignmentId[assignmentId].isLoading = true;
    },
    areaGraphLoaded: (state, action: PayloadAction<[string, GraphData[]]>) => {
      /*const [canvassAssId, statsArray] = action.payload;

      state.areaGraphByAssignmentId[canvassAssId] = remoteItem(canvassAssId, {
        data: statsArray.map((stats) => ({ id: canvassAssId, ...stats })),
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });*/

      const [assignmentId, graphData] = action.payload;

      state.areaGraphByAssignmentId[assignmentId] = remoteList(
        graphData.map((data) => ({ ...data, id: data.areaId }))
      );

      state.areaGraphByAssignmentId[assignmentId].loaded =
        new Date().toISOString();
    },
    areaStatsLoad: (state, action: PayloadAction<string>) => {
      const canvassAssId = action.payload;

      if (!state.areaStatsByAssignmentId[canvassAssId]) {
        state.areaStatsByAssignmentId[canvassAssId] = remoteItem(canvassAssId);
      }
      const statsItem = state.areaStatsByAssignmentId[canvassAssId];

      state.areaStatsByAssignmentId[canvassAssId] = remoteItem(canvassAssId, {
        data: statsItem?.data || null,
        isLoading: true,
      });
    },
    areaStatsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinAssignmentAreaStats]>
    ) => {
      const [canvassAssId, stats] = action.payload;

      state.areaStatsByAssignmentId[canvassAssId] = remoteItem(canvassAssId, {
        data: { id: canvassAssId, ...stats },
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });
    },
    canvassAssignmentCreated: (
      state,
      action: PayloadAction<ZetkinCanvassAssignment>
    ) => {
      const canvassAssignment = action.payload;
      const item = remoteItem(canvassAssignment.id, {
        data: canvassAssignment,
        loaded: new Date().toISOString(),
      });

      state.canvassAssignmentList.items.push(item);
    },
    canvassAssignmentDeleted: (state, action: PayloadAction<number>) => {
      const canvassId = action.payload;
      const canvassAssignmentItem = state.canvassAssignmentList.items.find(
        (item) => item.id === canvassId
      );

      if (canvassAssignmentItem) {
        canvassAssignmentItem.deleted = true;
      }
    },
    canvassAssignmentLoad: (state, action: PayloadAction<string>) => {
      const canvassAssId = action.payload;
      const item = state.canvassAssignmentList.items.find(
        (item) => item.id == canvassAssId
      );

      if (item) {
        item.isLoading = true;
      } else {
        state.canvassAssignmentList.items =
          state.canvassAssignmentList.items.concat([
            remoteItem(canvassAssId, { isLoading: true }),
          ]);
      }
    },
    canvassAssignmentLoaded: (
      state,
      action: PayloadAction<ZetkinCanvassAssignment>
    ) => {
      const canvassAssignment = action.payload;
      const item = state.canvassAssignmentList.items.find(
        (item) => item.id == canvassAssignment.id
      );

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = canvassAssignment;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    canvassAssignmentUpdated: (
      state,
      action: PayloadAction<ZetkinCanvassAssignment>
    ) => {
      const assignment = action.payload;
      const item = findOrAddItem(state.canvassAssignmentList, assignment.id);

      item.data = assignment;
      item.loaded = new Date().toISOString();
    },
    canvassAssignmentsLoad: (state) => {
      state.canvassAssignmentList.isLoading = true;
    },
    canvassAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinCanvassAssignment[]>
    ) => {
      state.canvassAssignmentList = remoteList(action.payload);
      state.canvassAssignmentList.loaded = new Date().toISOString();
    },
    canvassSessionCreated: (
      state,
      action: PayloadAction<ZetkinCanvassSession>
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
    canvassSessionsLoad: (state, action: PayloadAction<string>) => {
      const assignmentId = action.payload;

      if (!state.sessionsByAssignmentId[assignmentId]) {
        state.sessionsByAssignmentId[assignmentId] = remoteList();
      }

      state.sessionsByAssignmentId[assignmentId].isLoading = true;
    },
    canvassSessionsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinCanvassSession[]]>
    ) => {
      const [assignmentId, sessions] = action.payload;

      state.sessionsByAssignmentId[assignmentId] = remoteList(
        sessions.map((session) => ({ ...session, id: session.assignee.id }))
      );

      state.sessionsByAssignmentId[assignmentId].loaded =
        new Date().toISOString();
    },
    myAssignmentsLoad: (state) => {
      state.myAssignmentsWithAreasList.isLoading = true;
    },
    myAssignmentsLoaded: (
      state,
      action: PayloadAction<AssignmentWithAreas[]>
    ) => {
      const assignments = action.payload;
      const timestamp = new Date().toISOString();

      state.myAssignmentsWithAreasList = remoteList(assignments);
      state.myAssignmentsWithAreasList.loaded = timestamp;
      state.myAssignmentsWithAreasList.items.forEach(
        (item) => (item.loaded = timestamp)
      );
    },
    placeCreated: (state, action: PayloadAction<ZetkinPlace>) => {
      const place = action.payload;
      const item = remoteItem(place.id, {
        data: place,
        loaded: new Date().toISOString(),
      });

      state.placeList.items.push(item);
    },
    placeUpdated: (state, action: PayloadAction<ZetkinPlace>) => {
      const place = action.payload;
      const item = findOrAddItem(state.placeList, place.id);

      item.data = place;
      item.loaded = new Date().toISOString();
    },
    placesLoad: (state) => {
      state.placeList.isLoading = true;
    },
    placesLoaded: (state, action: PayloadAction<ZetkinPlace[]>) => {
      const timestamp = new Date().toISOString();
      const places = action.payload;
      state.placeList = remoteList(places);
      state.placeList.loaded = timestamp;
      state.placeList.items.forEach((item) => (item.loaded = timestamp));
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
      const canvassAssId = action.payload;

      if (!state.statsByCanvassAssId[canvassAssId]) {
        state.statsByCanvassAssId[canvassAssId] = remoteItem(canvassAssId);
      }
      const statsItem = state.statsByCanvassAssId[canvassAssId];

      state.statsByCanvassAssId[canvassAssId] = remoteItem(canvassAssId, {
        data: statsItem?.data || null,
        isLoading: true,
      });
    },
    statsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinCanvassAssignmentStats]>
    ) => {
      const [canvassAssId, stats] = action.payload;

      state.statsByCanvassAssId[canvassAssId] = remoteItem(canvassAssId, {
        data: { id: canvassAssId, ...stats },
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });
    },
  },
});

export default canvassAssignmentSlice;
export const {
  areaGraphLoad,
  areaGraphLoaded,
  areaStatsLoad,
  areaStatsLoaded,
  myAssignmentsLoad,
  myAssignmentsLoaded,
  canvassAssignmentCreated,
  canvassAssignmentDeleted,
  canvassAssignmentLoad,
  canvassAssignmentLoaded,
  canvassAssignmentUpdated,
  canvassAssignmentsLoad,
  canvassAssignmentsLoaded,
  canvassSessionCreated,
  canvassSessionsLoad,
  canvassSessionsLoaded,
  placeCreated,
  placesLoad,
  placesLoaded,
  placeUpdated,
  sessionDeleted,
  statsLoad,
  statsLoaded,
} = canvassAssignmentSlice.actions;
