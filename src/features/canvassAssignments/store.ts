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
} from './types';

export interface CanvassAssignmentsStoreSlice {
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
  areaStatsLoad,
  areaStatsLoaded,
  myAssignmentsLoad,
  myAssignmentsLoaded,
  canvassAssignmentCreated,
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
  statsLoad,
  statsLoaded,
} = canvassAssignmentSlice.actions;
