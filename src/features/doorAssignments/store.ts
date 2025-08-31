import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteListCreated,
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
  DoorCardData,
  ZetkinDoorAssignmentStats,
  ZetkinDoorAssignment,
  ZetkinDoorAssignee,
  ZetkinLocation,
  ZetkinAssignmentDoorStats,
  SessionDeletedPayload,
  ZetkinMetric,
} from './types';
import { Zetkin2Door } from 'features/doors/types';
import { ZetkinHouseholdVisit } from 'features/canvass/types';

export interface DoorAssignmentsStoreSlice {
  doorGraphByAssignmentId: Record<
    number,
    RemoteList<DoorCardData & { id: number }>
  >;
  doorStatsByAssignmentId: Record<
    number,
    RemoteItem<ZetkinAssignmentDoorStats & { id: number }>
  >;
  doorAssignmentList: RemoteList<ZetkinDoorAssignment>;
  doorsByAssignmentId: Record<string, RemoteList<Zetkin2Doors>>;
  assigneesByAssignmentId: Record<
    number,
    RemoteList<ZetkinDoorAssignee & { id: number }>
  >;
  locationsByAssignmentId: Record<number, RemoteList<ZetkinLocation>>;
  locationsByAssignmentIdAndDoorId: Record<string, RemoteList<ZetkinLocation>>;
  metricsByAssignmentId: Record<number, RemoteList<ZetkinMetric>>;
  statsByDoorAssId: Record<
    number,
    RemoteItem<ZetkinDoorAssignmentStats & { id: number }>
  >;
  visitsByHouseholdId: Record<number, RemoteList<ZetkinHouseholdVisit>>;
}

const initialState: DoorAssignmentsStoreSlice = {
  doorAssignmentList: remoteList(),
  doorGraphByAssignmentId: {},
  doorStatsByAssignmentId: {},
  doorsByAssignmentId: {},
  assigneesByAssignmentId: {},
  locationsByAssignmentId: {},
  locationsByAssignmentIdAndDoorId: {},
  metricsByAssignmentId: {},
  statsByDoorAssId: {},
  visitsByHouseholdId: {},
};

const doorAssignmentSlice = createSlice({
  initialState: initialState,
  name: 'doorAssignments',
  reducers: {
    doreAssignmentCreated: (
      state,
      action: PayloadAction<ZetkinDoorAssignment>
    ) => {
      const doorAssignment = action.payload;
      remoteItemUpdated(state.doorAssignmentList, doorAssignment);
    },
    doorAssignmentDeleted: (state, action: PayloadAction<number>) => {
      const doorAssId = action.payload;
      remoteItemDeleted(state.doorAssignmentList, doorAssId);
    },
    doorAssignmentLoad: (state, action: PayloadAction<number>) => {
      const doorAssId = action.payload;
      remoteItemLoad(state.doorAssignmentList, doorAssId);
    },
    doorAssignmentLoaded: (
      state,
      action: PayloadAction<ZetkinDoorAssignment>
    ) => {
      const doorAssignment = action.payload;
      remoteItemUpdated(state.doorAssignmentList, doorAssignment);
    },
    doorAssignmentUpdated: (
      state,
      action: PayloadAction<ZetkinDoorAssignment>
    ) => {
      const updatedDoor = action.payload;
      remoteItemUpdated(state.doorAssignmentList, updatedDoor);
    },
    doorAssignmentsLoad: (state) => {
      state.doorAssignmentList = remoteListLoad(state.doorAssignmentList);
    },
    doorAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinDoorAssignment[]>
    ) => {
      state.doorAssignmentList = remoteListLoaded(action.payload);
    },
    doorGraphLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;

      state.doorGraphByAssignmentId[assignmentId] = remoteListLoad(
        state.doorGraphByAssignmentId[assignmentId]
      );
    },
    doorGraphLoaded: (
      state,
      action: PayloadAction<[number, DoorCardData[]]>
    ) => {
      const [assignmentId, graphData] = action.payload;

      const loadedDoorGraphs = graphData.map((data) => ({
        ...data,
        id: data.door_id!,
      }));

      state.doorGraphByAssignmentId[assignmentId] =
        remoteListLoaded(loadedDoorGraphs);
    },
    doorStatsLoad: (state, action: PayloadAction<number>) => {
      const doorAssId = action.payload;

      if (!state.doorStatsByAssignmentId[doorAssId]) {
        state.doorStatsByAssignmentId[doorAssId] = remoteItem(doorAssId);
      }
      const statsItem = state.doorStatsByAssignmentId[doorAssId];

      state.doorStatsByAssignmentId[doorAssId] = remoteItem(doorAssId, {
        data: statsItem?.data || null,
        isLoading: true,
      });
    },
    doorStatsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinAssignmentDoorStats]>
    ) => {
      const [doorAssId, stats] = action.payload;

      state.doorStatsByAssignmentId[doorAssId] = remoteItem(doorAssId, {
        data: { id: doorAssId, ...stats },
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });
    },
    assigneeAdded: (state, action: PayloadAction<ZetkinDoorAssignee>) => {
      const assignee = action.payload;
      state.assigneesByAssignmentId[assignee.assignment_id] ||=
        remoteListCreated();

      remoteItemUpdated(state.assigneesByAssignmentId[assignee.assignment_id], {
        ...assignee,
        id: assignee.user_id,
      });

      const hasStatsItem = !!state.doorStatsByAssignmentId[
        assignee.assignment_id
        ].data?.stats.find((statsItem) => statsItem.door_id == assignee.door_id);

      if (!hasStatsItem) {
        state.doorStatsByAssignmentId[assignee.assignment_id].isStale = true;
      }
    },
    assigneeDeleted: (state, action: PayloadAction<SessionDeletedPayload>) => {
      const { doorId, assignmentId, assigneeId } = action.payload;

      const sessionsList = state.assigneesByAssignmentId[assignmentId];

      if (sessionsList) {
        const filteredSessions = sessionsList.items.filter(
          (item) =>
            !(
              item.data?.door_id === doorId && item.data?.user_id === assigneeId
            )
        );
        state.assigneesByAssignmentId[assignmentId] = {
          ...sessionsList,
          items: filteredSessions,
        };
      }
    },
    assigneesLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.assigneesByAssignmentId[assignmentId] = remoteListLoad(
        state.assigneesByAssignmentId[assignmentId]
      );
    },
    assigneesLoaded: (
      state,
      action: PayloadAction<[number, ZetkinDoorAssignee[]]>
    ) => {
      const [assignmentId, sessions] = action.payload;

      state.assigneesByAssignmentId[assignmentId] = remoteListLoaded(
        sessions.map((session) => ({ ...session, id: session.user_id }))
      );
    },
    assignmentDoorsLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.doorsByAssignmentId[assignmentId] = remoteListLoad(
        state.doorsByAssignmentId[assignmentId]
      );
    },
    assignmentDoorsLoaded: (
      state,
      action: PayloadAction<[number, Zetkin2Door[]]>
    ) => {
      const [assignmentId, doors] = action.payload;
      state.doorsByAssignmentId[assignmentId] = remoteListLoaded(doors);
    },
    householdVisitCreated: (
      state,
      action: PayloadAction<ZetkinHouseholdVisit>
    ) => {
      const visit = action.payload;
      state.visitsByHouseholdId[visit.household_id] ||= remoteListCreated();
      remoteItemUpdated(state.visitsByHouseholdId[visit.household_id], visit);
    },
    householdVisitsCreated: (
      state,
      action: PayloadAction<ZetkinHouseholdVisit[]>
    ) => {
      const visits = action.payload;

      for (const visit of visits) {
        const householdId = visit.household_id;
        state.visitsByHouseholdId[householdId] ||= remoteListCreated();
        remoteItemUpdated(state.visitsByHouseholdId[householdId], visit);
      }
    },
    locationCreated: (state, action: PayloadAction<ZetkinLocation>) => {
      const location = action.payload;

      Object.values(state.locationsByAssignmentId).forEach((list) => {
        remoteItemUpdated(list, location);
      });

      Object.values(state.locationsByAssignmentIdAndDoorId).forEach((list) => {
        remoteItemUpdated(list, location);
      });
    },
    locationLoaded: (
      state,
      action: PayloadAction<[number, ZetkinLocation]>
    ) => {
      const [assignmentId, location] = action.payload;

      remoteItemUpdated(state.locationsByAssignmentId[assignmentId], location);

      Object.keys(state.locationsByAssignmentIdAndDoorId).forEach((key) => {
        const [keyAssignmentIdStr] = key.split(':');
        const keyAssignmentId = Number(keyAssignmentIdStr);

        if (keyAssignmentId == assignmentId) {
          const list = state.locationsByAssignmentIdAndDoorId[key];
          if (list.items.some((item) => item.id == location.id)) {
            remoteItemUpdated(list, location);
          }
        }
      });
    },
    locationUpdated: (state, action: PayloadAction<ZetkinLocation>) => {
      const location = action.payload;

      Object.values(state.locationsByAssignmentId).forEach((list) => {
        remoteItemUpdated(list, location);
      });
      Object.values(state.locationsByAssignmentIdAndDoorId).forEach((list) => {
        remoteItemUpdated(list, location);
      });
    },
    locationsLoad: (state, action: PayloadAction<string>) => {
      const key = action.payload;

      state.locationsByAssignmentIdAndDoorId[key] = remoteListLoad(
        state.locationsByAssignmentIdAndDoorId[key]
      );

      const [assignmentIdStr] = key.split(':');
      const assignmentId = Number(assignmentIdStr);
      state.locationsByAssignmentId[assignmentId] = remoteListLoad(
        state.locationsByAssignmentId[assignmentId]
      );
    },
    locationsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinLocation[]]>
    ) => {
      const [key, locations] = action.payload;

      state.locationsByAssignmentIdAndDoorId[key] = remoteListLoaded(locations);

      const [assignmentIdStr] = key.split(':');
      const assignmentId = Number(assignmentIdStr);
      state.locationsByAssignmentId[assignmentId] = remoteListLoad(
        state.locationsByAssignmentId[assignmentId]
      );
    },
    metricCreated: (state, action: PayloadAction<[number, ZetkinMetric]>) => {
      const [assignmentId, metric] = action.payload;
      remoteItemUpdated(state.metricsByAssignmentId[assignmentId], metric);
    },
    metricDeleted: (state, action: PayloadAction<[number, number]>) => {
      const [assignmentId, metricId] = action.payload;
      remoteItemDeleted(state.metricsByAssignmentId[assignmentId], metricId);
    },
    metricUpdated: (state, action: PayloadAction<[number, ZetkinMetric]>) => {
      const [assignmentId, metric] = action.payload;
      remoteItemUpdated(state.metricsByAssignmentId[assignmentId], metric);
    },
    metricsLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.metricsByAssignmentId[assignmentId] = remoteListLoad(
        state.metricsByAssignmentId[assignmentId]
      );
    },
    metricsLoaded: (state, action: PayloadAction<[number, ZetkinMetric[]]>) => {
      const [assignmentId, metrics] = action.payload;
      state.metricsByAssignmentId[assignmentId] = remoteListLoaded(metrics);
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      const doorAssId = action.payload;

      if (!state.statsByDoorAssId[doorAssId]) {
        state.statsByDoorAssId[doorAssId] = remoteItem(doorAssId);
      }
      const statsItem = state.statsByDoorAssId[doorAssId];

      state.statsByDoorAssId[doorAssId] = remoteItem(doorAssId, {
        data: statsItem?.data || null,
        isLoading: true,
      });
    },
    statsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinDoorAssignmentStats]>
    ) => {
      const [doorAssId, stats] = action.payload;

      state.statsByDoorAssId[doorAssId] = remoteItem(doorAssId, {
        data: { id: doorAssId, ...stats },
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });
    },
  },
});

export default doorAssignmentSlice;
export const {
  doorGraphLoad,
  doorGraphLoaded,
  doorStatsLoad,
  doorStatsLoaded,
  doorAssignmentCreated,
  doorAssignmentDeleted,
  doorAssignmentLoad,
  doorAssignmentLoaded,
  doorAssignmentUpdated,
  doorAssignmentsLoad,
  doorAssignmentsLoaded,
  assigneeAdded,
  assigneesLoad,
  assigneesLoaded,
  assignmentDoorsLoad,
  assignmentDoorsLoaded,
  householdVisitCreated,
  householdVisitsCreated,
  locationCreated,
  locationLoaded,
  locationsLoad,
  locationsLoaded,
  locationUpdated,
  metricCreated,
  metricDeleted,
  metricUpdated,
  metricsLoad,
  metricsLoaded,
  assigneeDeleted,
  statsLoad,
  statsLoaded,
} = doorAssignmentSlice.actions;
