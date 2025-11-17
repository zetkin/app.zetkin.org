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
  VisitCardData,
  ZetkinVisitAssignmentStats,
  ZetkinVisitAssignment,
  ZetkinMetric,
  ZetkinVisitAssignee,
} from './types';

export interface VisitAssignmentsStoreSlice {
  visitGraphByAssignmentId: Record<
    number,
    RemoteList<VisitCardData & { id: number }>
  >;
  visitStatsByAssignmentId: Record<
    number,
    RemoteItem<ZetkinVisitAssignmentStats & { id: number }>
  >;
  visitAssignmentList: RemoteList<ZetkinVisitAssignment>;
  assigneesByAssignmentId: Record<
    number,
    RemoteList<ZetkinVisitAssignee & { id: number }>
  >;
  metricsByAssignmentId: Record<number, RemoteList<ZetkinMetric>>;
  myAssignmentsList: RemoteList<ZetkinVisitAssignment>;
  statsByVisitAssId: Record<
    number,
    RemoteItem<ZetkinVisitAssignmentStats & { id: number }>
  >;
}

const initialState: VisitAssignmentsStoreSlice = {
  assigneesByAssignmentId: {},
  metricsByAssignmentId: {},
  myAssignmentsList: remoteList(),
  statsByVisitAssId: {},
  visitAssignmentList: remoteList(),
  visitGraphByAssignmentId: {},
  visitStatsByAssignmentId: {},
};

const visitAssignmentSlice = createSlice({
  initialState: initialState,
  name: 'visitAssignments',
  reducers: {
    assigneeAdd: (state, action: PayloadAction<[number, number]>) => {
      const [vaId, assigneeId] = action.payload;
      state.assigneesByAssignmentId[vaId].items.push(
        remoteItem(assigneeId, { isLoading: true })
      );
    },
    assigneeAdded: (
      state,
      action: PayloadAction<[number, ZetkinVisitAssignee]>
    ) => {
      const [vaId, assignee] = action.payload;
      state.assigneesByAssignmentId[vaId].items = state.assigneesByAssignmentId[
        vaId
      ].items
        .filter((a) => a.id != assignee.id)
        .concat([remoteItem(assignee.id, { data: assignee })]);
    },
    assigneeConfigure: (state, action: PayloadAction<[number, number]>) => {
      const [vaId, userId] = action.payload;
      const item = state.assigneesByAssignmentId[vaId].items.find(
        (item) => item.id == userId
      );
      if (item) {
        item.isLoading = true;
      }
    },
    assigneeConfigured: (
      state,
      action: PayloadAction<[number, ZetkinVisitAssignee]>
    ) => {
      const [vaId, assignee] = action.payload;
      const item = state.assigneesByAssignmentId[vaId].items.find(
        (item) => item.id == assignee.id
      );
      if (item) {
        item.isLoading = false;
        item.data = assignee;
      }
    },
    assigneeRemove: (state, action: PayloadAction<[number, number]>) => {
      const [vaId, assignee] = action.payload;
      const item = state.assigneesByAssignmentId[vaId].items.find(
        (item) => item.id == assignee
      );
      if (item) {
        item.isLoading = true;
      }
    },
    assigneeRemoved: (state, action: PayloadAction<[number, number]>) => {
      const [vaId, assignee] = action.payload;
      state.assigneesByAssignmentId[vaId].items = state.assigneesByAssignmentId[
        vaId
      ].items.filter((item) => item.id != assignee);
    },
    assigneesLoad: (state, action: PayloadAction<number>) => {
      state.assigneesByAssignmentId[action.payload] =
        remoteList<ZetkinVisitAssignee>();
      state.assigneesByAssignmentId[action.payload].isLoading = true;
    },
    assigneesLoaded: (
      state,
      action: PayloadAction<[ZetkinVisitAssignee[], number]>
    ) => {
      const [assignees, assignmentId] = action.payload;
      const timestamp = new Date().toISOString();

      state.assigneesByAssignmentId[assignmentId] = remoteList(assignees);
      state.assigneesByAssignmentId[assignmentId].loaded = timestamp;
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
    myAssignmentsLoad: (state) => {
      state.myAssignmentsList.isLoading = true;
    },
    myAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinVisitAssignment[]>
    ) => {
      const assignments = action.payload;
      const timestamp = new Date().toISOString();

      state.myAssignmentsList = remoteList(assignments);
      state.myAssignmentsList.loaded = timestamp;
      state.myAssignmentsList.items.forEach(
        (item) => (item.loaded = timestamp)
      );
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      const visitAssId = action.payload;

      if (!state.statsByVisitAssId[visitAssId]) {
        state.statsByVisitAssId[visitAssId] = remoteItem(visitAssId);
      }
      const statsItem = state.statsByVisitAssId[visitAssId];

      state.statsByVisitAssId[visitAssId] = remoteItem(visitAssId, {
        data: statsItem?.data || null,
        isLoading: true,
      });
    },
    statsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinVisitAssignmentStats]>
    ) => {
      const [visitAssId, stats] = action.payload;

      state.statsByVisitAssId[visitAssId] = remoteItem(visitAssId, {
        data: { id: visitAssId, ...stats },
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });
    },
    visitAssignmentCreated: (
      state,
      action: PayloadAction<ZetkinVisitAssignment>
    ) => {
      const visitAssignment = action.payload;
      remoteItemUpdated(state.visitAssignmentList, visitAssignment);
    },
    visitAssignmentDeleted: (state, action: PayloadAction<number>) => {
      const visitAssId = action.payload;
      remoteItemDeleted(state.visitAssignmentList, visitAssId);
    },
    visitAssignmentLoad: (state, action: PayloadAction<number>) => {
      const visitAssId = action.payload;
      remoteItemLoad(state.visitAssignmentList, visitAssId);
    },
    visitAssignmentLoaded: (
      state,
      action: PayloadAction<ZetkinVisitAssignment>
    ) => {
      const visitAssignment = action.payload;
      remoteItemUpdated(state.visitAssignmentList, visitAssignment);
    },
    visitAssignmentUpdate: (
      state,
      action: PayloadAction<[number, string[]]>
    ) => {
      const [id, attributes] = action.payload;
      const vaItem = state.visitAssignmentList.items.find(
        (item) => item.id === id
      );

      if (vaItem) {
        vaItem.mutating = vaItem.mutating
          .filter((attr) => !attributes.includes(attr))
          .concat(attributes);
      }
    },
    visitAssignmentUpdated: (
      state,
      action: PayloadAction<[ZetkinVisitAssignment, string[]]>
    ) => {
      const [assignment, mutating] = action.payload;
      const vaItem = state.visitAssignmentList.items.find(
        (item) => item.id === assignment.id
      );

      if (vaItem) {
        vaItem.mutating = vaItem.mutating.filter((attr) =>
          mutating.includes(attr)
        );
      }

      state.visitAssignmentList.items = state.visitAssignmentList.items
        .filter((va) => va.id !== assignment.id)
        .concat([remoteItem(assignment.id, { data: assignment })]);
    },
    visitAssignmentsLoad: (state) => {
      state.visitAssignmentList = remoteListLoad(state.visitAssignmentList);
    },
    visitAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinVisitAssignment[]>
    ) => {
      state.visitAssignmentList = remoteListLoaded(action.payload);
    },
    visitGraphLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;

      state.visitGraphByAssignmentId[assignmentId] = remoteListLoad(
        state.visitGraphByAssignmentId[assignmentId]
      );
    },
    visitGraphLoaded: (
      state,
      action: PayloadAction<[number, VisitCardData[]]>
    ) => {
      const [assignmentId, graphData] = action.payload;

      const loadedVisitGraphs = graphData.map((data) => ({
        ...data,
        id: data.visit_id!,
      }));

      state.visitGraphByAssignmentId[assignmentId] =
        remoteListLoaded(loadedVisitGraphs);
    },
    visitStatsLoad: (state, action: PayloadAction<number>) => {
      const visitAssId = action.payload;

      if (!state.visitStatsByAssignmentId[visitAssId]) {
        state.visitStatsByAssignmentId[visitAssId] = remoteItem(visitAssId);
      }
      const statsItem = state.visitStatsByAssignmentId[visitAssId];

      state.visitStatsByAssignmentId[visitAssId] = remoteItem(visitAssId, {
        data: statsItem?.data || null,
        isLoading: true,
      });
    },
    visitStatsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinVisitAssignmentStats]>
    ) => {
      const [visitAssId, stats] = action.payload;

      state.visitStatsByAssignmentId[visitAssId] = remoteItem(visitAssId, {
        data: { id: visitAssId, ...stats },
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });
    },
  },
});

export default visitAssignmentSlice;
export const {
  visitGraphLoad,
  visitGraphLoaded,
  visitStatsLoad,
  visitStatsLoaded,
  visitAssignmentCreated,
  visitAssignmentDeleted,
  visitAssignmentLoad,
  visitAssignmentLoaded,
  visitAssignmentUpdate,
  visitAssignmentUpdated,
  visitAssignmentsLoad,
  visitAssignmentsLoaded,
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
  myAssignmentsLoad,
  myAssignmentsLoaded,
  assigneeRemove,
  assigneeRemoved,
  statsLoad,
  statsLoaded,
} = visitAssignmentSlice.actions;
