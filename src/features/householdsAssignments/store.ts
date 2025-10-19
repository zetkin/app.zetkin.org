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
  HouseholdCardData,
  ZetkinHouseholdAssignmentStats,
  ZetkinHouseholdAssignment,
  ZetkinHouseholdAssignee,
  ZetkinAssignmentHouseholdStats,
  SessionDeletedPayload,
  ZetkinMetric,
} from './types';

export interface HouseholdAssignmentsStoreSlice {
  householdGraphByAssignmentId: Record<
    number,
    RemoteList<HouseholdCardData & { id: number }>
  >;
  householdStatsByAssignmentId: Record<
    number,
    RemoteItem<ZetkinAssignmentHouseholdStats & { id: number }>
  >;
  householdAssignmentList: RemoteList<ZetkinHouseholdAssignment>;
  assigneesByAssignmentId: Record<
    number,
    RemoteList<ZetkinHouseholdAssignee & { id: string }>
  >;
  metricsByAssignmentId: Record<number, RemoteList<ZetkinMetric>>;
  statsByHouseholdsAssId: Record<
    number,
    RemoteItem<ZetkinHouseholdAssignmentStats & { id: number }>
  >;
}

const initialState: HouseholdAssignmentsStoreSlice = {
  assigneesByAssignmentId: {},
  householdAssignmentList: remoteList(),
  householdGraphByAssignmentId: {},
  householdStatsByAssignmentId: {},
  metricsByAssignmentId: {},
  statsByHouseholdsAssId: {},
};

const householdAssignmentSlice = createSlice({
  initialState: initialState,
  name: 'householdAssignments',
  reducers: {
    assigneeAdded: (state, action: PayloadAction<ZetkinHouseholdAssignee>) => {
      const assignee = action.payload;
      state.assigneesByAssignmentId[assignee.assignment_id] ||=
        remoteListCreated();

      remoteItemUpdated(state.assigneesByAssignmentId[assignee.assignment_id], {
        ...assignee,
        id: `${assignee.user_id}/${assignee.household_id}`,
      });

      const hasStatsItem = !!state.householdStatsByAssignmentId[
        assignee.assignment_id
      ].data?.stats.find(
        (statsItem) => statsItem.household_id == assignee.household_id
      );

      if (!hasStatsItem) {
        state.householdStatsByAssignmentId[assignee.assignment_id].isStale =
          true;
      }
    },
    assigneeDeleted: (state, action: PayloadAction<SessionDeletedPayload>) => {
      const { householdId, assignmentId, assigneeId } = action.payload;

      const sessionsList = state.assigneesByAssignmentId[assignmentId];

      if (sessionsList) {
        const filteredSessions = sessionsList.items.filter(
          (item) =>
            !(
              item.data?.household_id === householdId &&
              item.data?.user_id === assigneeId
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
      action: PayloadAction<[number, ZetkinHouseholdAssignee[]]>
    ) => {
      const [assignmentId, sessions] = action.payload;

      state.assigneesByAssignmentId[assignmentId] = remoteListLoaded(
        sessions.map((session) => ({
          ...session,
          id: `${session.user_id}/${session.household_id}`,
        }))
      );
    },
    householdAssignmentCreated: (
      state,
      action: PayloadAction<ZetkinHouseholdAssignment>
    ) => {
      const householdAssignment = action.payload;
      remoteItemUpdated(state.householdAssignmentList, householdAssignment);
    },
    householdAssignmentDeleted: (state, action: PayloadAction<number>) => {
      const householdsAssId = action.payload;
      remoteItemDeleted(state.householdAssignmentList, householdsAssId);
    },
    householdAssignmentLoad: (state, action: PayloadAction<number>) => {
      const householdsAssId = action.payload;
      remoteItemLoad(state.householdAssignmentList, householdsAssId);
    },
    householdAssignmentLoaded: (
      state,
      action: PayloadAction<ZetkinHouseholdAssignment>
    ) => {
      const householdAssignment = action.payload;
      remoteItemUpdated(state.householdAssignmentList, householdAssignment);
    },
    householdAssignmentUpdated: (
      state,
      action: PayloadAction<ZetkinHouseholdAssignment>
    ) => {
      const updatedHousehold = action.payload;
      remoteItemUpdated(state.householdAssignmentList, updatedHousehold);
    },
    householdAssignmentsLoad: (state) => {
      state.householdAssignmentList = remoteListLoad(
        state.householdAssignmentList
      );
    },
    householdAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinHouseholdAssignment[]>
    ) => {
      state.householdAssignmentList = remoteListLoaded(action.payload);
    },
    householdGraphLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;

      state.householdGraphByAssignmentId[assignmentId] = remoteListLoad(
        state.householdGraphByAssignmentId[assignmentId]
      );
    },
    householdGraphLoaded: (
      state,
      action: PayloadAction<[number, HouseholdCardData[]]>
    ) => {
      const [assignmentId, graphData] = action.payload;

      const loadedHouseholdGraphs = graphData.map((data) => ({
        ...data,
        id: data.household_id!,
      }));

      state.householdGraphByAssignmentId[assignmentId] = remoteListLoaded(
        loadedHouseholdGraphs
      );
    },
    householdStatsLoad: (state, action: PayloadAction<number>) => {
      const householdsAssId = action.payload;

      if (!state.householdStatsByAssignmentId[householdsAssId]) {
        state.householdStatsByAssignmentId[householdsAssId] =
          remoteItem(householdsAssId);
      }
      const statsItem = state.householdStatsByAssignmentId[householdsAssId];

      state.householdStatsByAssignmentId[householdsAssId] = remoteItem(
        householdsAssId,
        {
          data: statsItem?.data || null,
          isLoading: true,
        }
      );
    },
    householdStatsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinAssignmentHouseholdStats]>
    ) => {
      const [householdsAssId, stats] = action.payload;

      state.householdStatsByAssignmentId[householdsAssId] = remoteItem(
        householdsAssId,
        {
          data: { id: householdsAssId, ...stats },
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        }
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
      const householdsAssId = action.payload;

      if (!state.statsByHouseholdsAssId[householdsAssId]) {
        state.statsByHouseholdsAssId[householdsAssId] =
          remoteItem(householdsAssId);
      }
      const statsItem = state.statsByHouseholdsAssId[householdsAssId];

      state.statsByHouseholdsAssId[householdsAssId] = remoteItem(
        householdsAssId,
        {
          data: statsItem?.data || null,
          isLoading: true,
        }
      );
    },
    statsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinHouseholdAssignmentStats]>
    ) => {
      const [householdsAssId, stats] = action.payload;

      state.statsByHouseholdsAssId[householdsAssId] = remoteItem(
        householdsAssId,
        {
          data: { id: householdsAssId, ...stats },
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        }
      );
    },
  },
});

export default householdAssignmentSlice;
export const {
  householdGraphLoad,
  householdGraphLoaded,
  householdStatsLoad,
  householdStatsLoaded,
  householdAssignmentCreated,
  householdAssignmentDeleted,
  householdAssignmentLoad,
  householdAssignmentLoaded,
  householdAssignmentUpdated,
  householdAssignmentsLoad,
  householdAssignmentsLoaded,
  assigneeAdded,
  assigneesLoad,
  assigneesLoaded,
  metricCreated,
  metricDeleted,
  metricUpdated,
  metricsLoad,
  metricsLoaded,
  assigneeDeleted,
  statsLoad,
  statsLoaded,
} = householdAssignmentSlice.actions;
