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
  ZetkinArea,
  ZetkinCanvassAssignee,
  ZetkinCanvassAssignment,
  ZetkinCanvassSession,
  ZetkinPlace,
} from './types';

export interface AreasStoreSlice {
  areaList: RemoteList<ZetkinArea>;
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

const initialState: AreasStoreSlice = {
  areaList: remoteList(),
  assigneesByCanvassAssignmentId: {},
  canvassAssignmentList: remoteList(),
  mySessionsList: remoteList(),
  placeList: remoteList(),
  sessionsByAssignmentId: {},
  statsByCanvassAssId: {},
};

const areasSlice = createSlice({
  initialState: initialState,
  name: 'areas',
  reducers: {
    areaCreated: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      const item = remoteItem(area.id, {
        data: area,
        loaded: new Date().toISOString(),
      });

      state.areaList.items.push(item);
    },
    areaDeleted: (state, action: PayloadAction<string>) => {
      const deletedId = action.payload;
      state.areaList.items = state.areaList.items.filter(
        (item) => item.id != deletedId
      );
    },
    areaLoad: (state, action: PayloadAction<string>) => {
      const areaId = action.payload;
      const item = state.areaList.items.find((item) => item.id == areaId);

      if (item) {
        item.isLoading = true;
      } else {
        state.areaList.items = state.areaList.items.concat([
          remoteItem(areaId, { isLoading: true }),
        ]);
      }
    },
    areaLoaded: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      const item = state.areaList.items.find((item) => item.id == area.id);

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = area;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    areaUpdated: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      const item = findOrAddItem(state.areaList, area.id);

      item.data = area;
      item.loaded = new Date().toISOString();
    },
    areasLoad: (state) => {
      state.areaList.isLoading = true;
    },
    areasLoaded: (state, action: PayloadAction<ZetkinArea[]>) => {
      const timestamp = new Date().toISOString();
      const areas = action.payload;
      state.areaList = remoteList(areas);
      state.areaList.loaded = timestamp;
      state.areaList.items.forEach((item) => (item.loaded = timestamp));
    },
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
        data: statsItem?.data || {
          id: canvassAssId,
          num_areas: 0,
          num_households: 0,
          num_places: 0,
          num_visited_areas: 0,
          num_visited_households: 0,
          num_visited_households_outside_areas: 0,
          num_visited_places: 0,
          num_visited_places_outside_areas: 0,
        },
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

export default areasSlice;
export const {
  areaCreated,
  areaDeleted,
  areaLoad,
  areaLoaded,
  areasLoad,
  areasLoaded,
  areaUpdated,
  assigneeAdd,
  assigneeAdded,
  assigneeUpdated,
  assigneesLoad,
  assigneesLoaded,
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
} = areasSlice.actions;
