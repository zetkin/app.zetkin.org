import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
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
  ZetkinAssignmentHouseholdStats,
  ZetkinMetric,
  ZetkinHouseholdsAssignee,
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
    RemoteList<ZetkinHouseholdsAssignee & { id: number }>
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
    assigneeAdd: (state, action: PayloadAction<[number, number]>) => {
      const [haId, assigneeId] = action.payload;
      state.assigneesByAssignmentId[haId].items.push(
        remoteItem(assigneeId, { isLoading: true })
      );
    },
    assigneeAdded: (
      state,
      action: PayloadAction<[number, ZetkinHouseholdsAssignee]>
    ) => {
      const [haId, assignee] = action.payload;
      state.assigneesByAssignmentId[haId].items = state.assigneesByAssignmentId[
        haId
      ].items
        .filter((a) => a.id != assignee.id)
        .concat([remoteItem(assignee.id, { data: assignee })]);
    },
    assigneeConfigure: (state, action: PayloadAction<[number, number]>) => {
      const [haId, userId] = action.payload;
      const item = state.assigneesByAssignmentId[haId].items.find(
        (item) => item.id == userId
      );
      if (item) {
        item.isLoading = true;
      }
    },
    assigneeConfigured: (
      state,
      action: PayloadAction<[number, ZetkinHouseholdsAssignee]>
    ) => {
      const [haId, assignee] = action.payload;
      const item = state.assigneesByAssignmentId[haId].items.find(
        (item) => item.id == assignee.id
      );
      if (item) {
        item.isLoading = false;
        item.data = assignee;
      }
    },
    assigneeRemove: (state, action: PayloadAction<[number, number]>) => {
      const [haId, assignee] = action.payload;
      const item = state.assigneesByAssignmentId[haId].items.find(
        (item) => item.id == assignee
      );
      if (item) {
        item.isLoading = true;
      }
    },
    assigneeRemoved: (state, action: PayloadAction<[number, number]>) => {
      const [haId, assignee] = action.payload;
      state.assigneesByAssignmentId[haId].items = state.assigneesByAssignmentId[
        haId
      ].items.filter((item) => item.id != assignee);
    },
    assigneesLoad: (state, action: PayloadAction<number>) => {
      state.assigneesByAssignmentId[action.payload] =
        remoteList<ZetkinHouseholdsAssignee>();
      state.assigneesByAssignmentId[action.payload].isLoading = true;
    },
    assigneesLoaded: (
      state,
      action: PayloadAction<[ZetkinHouseholdsAssignee[], number]>
    ) => {
      const [assignees, assignmentId] = action.payload;
      const timestamp = new Date().toISOString();

      state.assigneesByAssignmentId[assignmentId] = remoteList(assignees);
      state.assigneesByAssignmentId[assignmentId].loaded = timestamp;
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
    householdAssignmentUpdate: (
      state,
      action: PayloadAction<[number, string[]]>
    ) => {
      const [id, attributes] = action.payload;
      const haItem = state.householdAssignmentList.items.find(
        (item) => item.id === id
      );

      if (haItem) {
        haItem.mutating = haItem.mutating
          .filter((attr) => !attributes.includes(attr))
          .concat(attributes);
      }
    },
    householdAssignmentUpdated: (
      state,
      action: PayloadAction<[ZetkinHouseholdAssignment, string[]]>
    ) => {
      const [assignment, mutating] = action.payload;
      const haItem = state.householdAssignmentList.items.find(
        (item) => item.id === assignment.id
      );

      if (haItem) {
        haItem.mutating = haItem.mutating.filter((attr) =>
          mutating.includes(attr)
        );
      }

      state.householdAssignmentList.items = state.householdAssignmentList.items
        .filter((ha) => ha.id !== assignment.id)
        .concat([remoteItem(assignment.id, { data: assignment })]);
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
  householdAssignmentUpdate,
  householdAssignmentUpdated,
  householdAssignmentsLoad,
  householdAssignmentsLoaded,
  assigneeAdd,
  assigneeAdded,
  assigneeConfigure,
  assigneeConfigured,
  assigneesLoad,
  assigneesLoaded,
  metricCreated,
  metricDeleted,
  metricUpdated,
  metricsLoad,
  metricsLoaded,
  assigneeRemove,
  assigneeRemoved,
  statsLoad,
  statsLoaded,
} = householdAssignmentSlice.actions;
