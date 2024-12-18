import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  findOrAddItem,
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
  ZetkinPlace,
  AssignmentWithAreas,
  ZetkinAssignmentAreaStats,
  SessionDeletedPayload,
  ZetkinPlaceVisit,
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
  myAssignmentsWithAreasList: RemoteList<AssignmentWithAreas>;
  placeList: RemoteList<ZetkinPlace>;
  statsByAreaAssId: Record<
    string,
    RemoteItem<ZetkinAreaAssignmentStats & { id: string }>
  >;
  visitsByAssignmentId: Record<string, RemoteList<ZetkinPlaceVisit>>;
}

const initialState: AreaAssignmentsStoreSlice = {
  areaAssignmentList: remoteList(),
  areaGraphByAssignmentId: {},
  areaStatsByAssignmentId: {},
  myAssignmentsWithAreasList: remoteList(),
  placeList: remoteList(),
  sessionsByAssignmentId: {},
  statsByAreaAssId: {},
  visitsByAssignmentId: {},
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
      const item = remoteItem(areaAssignment.id, {
        data: areaAssignment,
        loaded: new Date().toISOString(),
      });

      state.areaAssignmentList.items.push(item);
    },
    areaAssignmentDeleted: (state, action: PayloadAction<number>) => {
      const areaAssId = action.payload;
      const areaAssignmentItem = state.areaAssignmentList.items.find(
        (item) => item.id === areaAssId
      );

      if (areaAssignmentItem) {
        areaAssignmentItem.deleted = true;
      }
    },
    areaAssignmentLoad: (state, action: PayloadAction<string>) => {
      const areaAssId = action.payload;
      const item = state.areaAssignmentList.items.find(
        (item) => item.id == areaAssId
      );

      if (item) {
        item.isLoading = true;
      } else {
        state.areaAssignmentList.items = state.areaAssignmentList.items.concat([
          remoteItem(areaAssId, { isLoading: true }),
        ]);
      }
    },
    areaAssignmentLoaded: (
      state,
      action: PayloadAction<ZetkinAreaAssignment>
    ) => {
      const areaAssignment = action.payload;
      const item = state.areaAssignmentList.items.find(
        (item) => item.id == areaAssignment.id
      );

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = areaAssignment;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
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
      const assignment = action.payload;
      const item = findOrAddItem(state.areaAssignmentList, assignment.id);

      item.data = assignment;
      item.loaded = new Date().toISOString();
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
    placesInvalidated: (state) => {
      state.placeList.isStale = true;
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
    visitCreated: (state, action: PayloadAction<ZetkinPlaceVisit>) => {
      const visit = action.payload;
      const assignmentId = visit.areaAssId;
      if (!state.visitsByAssignmentId[assignmentId]) {
        state.visitsByAssignmentId[assignmentId] = remoteList();
      }

      state.visitsByAssignmentId[assignmentId].items.push(
        remoteItem(visit.id, { data: visit })
      );
    },
    visitsInvalidated: (state, action: PayloadAction<string>) => {
      const assignmentId = action.payload;
      state.visitsByAssignmentId[assignmentId].isStale = true;
    },
    visitsLoad: (state, action: PayloadAction<string>) => {
      state.visitsByAssignmentId[action.payload] = remoteList();
      state.visitsByAssignmentId[action.payload].isLoading = true;
    },
    visitsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinPlaceVisit[]]>
    ) => {
      const [placeId, visits] = action.payload;
      state.visitsByAssignmentId[placeId] = remoteList(visits);
      state.visitsByAssignmentId[placeId].isLoading = false;
      state.visitsByAssignmentId[placeId].loaded = new Date().toISOString();
    },
  },
});

export default areaAssignmentSlice;
export const {
  areaGraphLoad,
  areaGraphLoaded,
  areaStatsLoad,
  areaStatsLoaded,
  myAssignmentsLoad,
  myAssignmentsLoaded,
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
  placeCreated,
  placesInvalidated,
  placesLoad,
  placesLoaded,
  placeUpdated,
  sessionDeleted,
  statsLoad,
  statsLoaded,
  visitCreated,
  visitsInvalidated,
  visitsLoad,
  visitsLoaded,
} = areaAssignmentSlice.actions;
