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
  ZetkinCanvassAssignee,
  ZetkinCanvassAssignment,
  ZetkinCanvassSession,
  ZetkinPlace,
} from './types';

export interface CanvassAssignmentsStoreSlice {
  canvassAssignmentList: RemoteList<ZetkinCanvassAssignment>;
  sessionsByAssignmentId: Record<
    string,
    RemoteList<ZetkinCanvassSession & { id: number }>
  >;
  assigneesByCanvassAssignmentId: Record<
    string,
    RemoteList<ZetkinCanvassAssignee>
  >;
  mySessionsList: RemoteList<ZetkinCanvassSession & { id: string }>;
  placeList: RemoteList<ZetkinPlace>;
  statsByCanvassAssId: Record<
    string,
    RemoteItem<ZetkinCanvassAssignmentStats & { id: string }>
  >;
}

const initialState: CanvassAssignmentsStoreSlice = {
  assigneesByCanvassAssignmentId: {},
  canvassAssignmentList: remoteList(),
  mySessionsList: remoteList(),
  placeList: remoteList(),
  sessionsByAssignmentId: {},
  statsByCanvassAssId: {},
};

const canvassAssignmentSlice = createSlice({
  initialState: initialState,
  name: 'canvassAssignments',
  reducers: {
    assigneeAdd: (state, action: PayloadAction<[string, number]>) => {
      const [canvassAssId, assigneeId] = action.payload;

      if (!state.assigneesByCanvassAssignmentId[canvassAssId]) {
        state.assigneesByCanvassAssignmentId[canvassAssId] = remoteList();
      }

      state.assigneesByCanvassAssignmentId[canvassAssId].items.push(
        remoteItem(assigneeId, { isLoading: true })
      );
    },
    assigneeAdded: (
      state,
      action: PayloadAction<[string, ZetkinCanvassAssignee]>
    ) => {
      const [canvassAssId, assignee] = action.payload;

      if (!state.assigneesByCanvassAssignmentId[canvassAssId]) {
        state.assigneesByCanvassAssignmentId[canvassAssId] = remoteList();
      }

      state.assigneesByCanvassAssignmentId[canvassAssId].items =
        state.assigneesByCanvassAssignmentId[canvassAssId].items
          .filter((item) => item.id != assignee.id)
          .concat([
            remoteItem(assignee.canvassAssId, {
              data: assignee,
            }),
          ]);
    },
    assigneeUpdated: (
      state,
      action: PayloadAction<[string, ZetkinCanvassAssignee]>
    ) => {
      const [canvassAssId, assignee] = action.payload;

      if (!state.assigneesByCanvassAssignmentId[canvassAssId]) {
        state.assigneesByCanvassAssignmentId[canvassAssId] = remoteList();
      }

      state.assigneesByCanvassAssignmentId[canvassAssId].items
        .filter((item) => item.id == assignee.id)
        .concat([
          remoteItem(assignee.canvassAssId, {
            data: assignee,
          }),
        ]);
    },
    assigneesLoad: (state, action: PayloadAction<string>) => {
      const canvassAssId = action.payload;

      if (!state.assigneesByCanvassAssignmentId[canvassAssId]) {
        state.assigneesByCanvassAssignmentId[canvassAssId] = remoteList();
      }

      state.assigneesByCanvassAssignmentId[canvassAssId].isLoading = true;
    },
    assigneesLoaded: (
      state,
      action: PayloadAction<[string, ZetkinCanvassAssignee[]]>
    ) => {
      const [canvassAssId, assignees] = action.payload;

      if (!state.assigneesByCanvassAssignmentId[canvassAssId]) {
        state.assigneesByCanvassAssignmentId[canvassAssId] = remoteList();
      }

      state.assigneesByCanvassAssignmentId[canvassAssId] =
        remoteList(assignees);
      state.assigneesByCanvassAssignmentId[canvassAssId].loaded =
        new Date().toISOString();
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
      state.mySessionsList.isLoading = true;
    },
    myAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinCanvassSession[]>
    ) => {
      const sessions = action.payload;
      const timestamp = new Date().toISOString();

      state.mySessionsList = remoteList(
        sessions.map((session) => ({
          ...session,
          id: `${session.assignment.id} ${session.assignee.id}`,
        }))
      );
      state.mySessionsList.loaded = timestamp;
      state.mySessionsList.items.forEach((item) => (item.loaded = timestamp));
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
  assigneeAdd,
  assigneeAdded,
  assigneeUpdated,
  assigneesLoad,
  assigneesLoaded,
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
  statsLoad,
  statsLoaded,
} = canvassAssignmentSlice.actions;
