import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
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
  ZetkinAreaAssignee,
  ZetkinLocation,
  ZetkinAssignmentAreaStats,
  SessionDeletedPayload,
  ZetkinMetric,
} from './types';
import { findOrAddItem } from 'utils/storeUtils/findOrAddItem';
import { Zetkin2Area } from 'features/areas/types';
import {
  ZetkinHouseholdVisit,
  ZetkinLocationVisit,
} from 'features/canvass/types';
import { visitCreated } from 'features/canvass/store';

export interface AreaAssignmentsStoreSlice {
  areaGraphByAssignmentId: Record<
    number,
    RemoteList<AreaCardData & { id: number }>
  >;
  areaStatsByAssignmentId: Record<
    number,
    RemoteItem<ZetkinAssignmentAreaStats & { id: number }>
  >;
  areaAssignmentList: RemoteList<ZetkinAreaAssignment>;
  areasByAssignmentId: Record<string, RemoteList<Zetkin2Area>>;
  assigneesByAssignmentId: Record<
    number,
    RemoteList<ZetkinAreaAssignee & { id: number }>
  >;
  locationsByAssignmentId: Record<number, RemoteList<ZetkinLocation>>;
  metricsByAssignmentId: Record<number, RemoteList<ZetkinMetric>>;
  statsByAreaAssId: Record<
    number,
    RemoteItem<ZetkinAreaAssignmentStats & { id: number }>
  >;
  visitsByHouseholdId: Record<number, RemoteList<ZetkinHouseholdVisit>>;
}

const initialState: AreaAssignmentsStoreSlice = {
  areaAssignmentList: remoteList(),
  areaGraphByAssignmentId: {},
  areaStatsByAssignmentId: {},
  areasByAssignmentId: {},
  assigneesByAssignmentId: {},
  locationsByAssignmentId: {},
  metricsByAssignmentId: {},
  statsByAreaAssId: {},
  visitsByHouseholdId: {},
};

const areaAssignmentSlice = createSlice({
  extraReducers: (builder) =>
    builder.addCase(
      visitCreated,
      (state, action: PayloadAction<ZetkinLocationVisit>) => {
        const visit = action.payload;
        state.locationsByAssignmentId[visit.assignment_id] ||= remoteList();
        const item = findOrAddItem(
          state.locationsByAssignmentId[visit.assignment_id],
          visit.location_id
        );
        item.isStale = true;
      }
    ),
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
    areaAssignmentLoad: (state, action: PayloadAction<number>) => {
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
    areaAssignmentUpdated: (
      state,
      action: PayloadAction<ZetkinAreaAssignment>
    ) => {
      const updatedArea = action.payload;
      remoteItemUpdated(state.areaAssignmentList, updatedArea);
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
    areaGraphLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;

      if (!state.areaGraphByAssignmentId[assignmentId]) {
        state.areaGraphByAssignmentId[assignmentId] = remoteList();
      }

      state.areaGraphByAssignmentId[assignmentId].isLoading = true;
    },
    areaGraphLoaded: (
      state,
      action: PayloadAction<[number, AreaCardData[]]>
    ) => {
      const [assignmentId, graphData] = action.payload;

      state.areaGraphByAssignmentId[assignmentId] = remoteList(
        graphData.map((data) => ({ ...data, id: data.area_id! }))
      );

      state.areaGraphByAssignmentId[assignmentId].loaded =
        new Date().toISOString();
    },
    areaStatsLoad: (state, action: PayloadAction<number>) => {
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
      action: PayloadAction<[number, ZetkinAssignmentAreaStats]>
    ) => {
      const [areaAssId, stats] = action.payload;

      state.areaStatsByAssignmentId[areaAssId] = remoteItem(areaAssId, {
        data: { id: areaAssId, ...stats },
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });
    },
    assigneeAdded: (state, action: PayloadAction<ZetkinAreaAssignee>) => {
      const assignee = action.payload;
      if (!state.assigneesByAssignmentId[assignee.assignment_id]) {
        state.assigneesByAssignmentId[assignee.assignment_id] = remoteList();
      }
      const item = remoteItem(assignee.user_id, {
        data: { ...assignee, id: assignee.user_id },
        loaded: new Date().toISOString(),
      });

      state.assigneesByAssignmentId[assignee.assignment_id].items.push(item);

      const hasStatsItem = !!state.areaStatsByAssignmentId[
        assignee.assignment_id
      ].data?.stats.find((statsItem) => statsItem.area_id == assignee.area_id);

      if (!hasStatsItem) {
        state.areaStatsByAssignmentId[assignee.assignment_id].isStale = true;
      }
    },
    assigneeDeleted: (state, action: PayloadAction<SessionDeletedPayload>) => {
      const { areaId, assignmentId, assigneeId } = action.payload;

      const sessionsList = state.assigneesByAssignmentId[assignmentId];

      if (sessionsList) {
        const filteredSessions = sessionsList.items.filter(
          (item) =>
            !(
              item.data?.area_id === areaId && item.data?.user_id === assigneeId
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

      if (!state.assigneesByAssignmentId[assignmentId]) {
        state.assigneesByAssignmentId[assignmentId] = remoteList();
      }

      state.assigneesByAssignmentId[assignmentId].isLoading = true;
    },
    assigneesLoaded: (
      state,
      action: PayloadAction<[number, ZetkinAreaAssignee[]]>
    ) => {
      const [assignmentId, sessions] = action.payload;

      state.assigneesByAssignmentId[assignmentId] = remoteList(
        sessions.map((session) => ({ ...session, id: session.user_id }))
      );

      state.assigneesByAssignmentId[assignmentId].loaded =
        new Date().toISOString();
    },
    assignmentAreasLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.areasByAssignmentId[assignmentId] ||= remoteList();
      state.areasByAssignmentId[assignmentId].isLoading = true;
    },
    assignmentAreasLoaded: (
      state,
      action: PayloadAction<[number, Zetkin2Area[]]>
    ) => {
      const [assignmentId, areas] = action.payload;
      state.areasByAssignmentId[assignmentId] = remoteList(areas);
      state.areasByAssignmentId[assignmentId].isLoading = false;
      state.areasByAssignmentId[assignmentId].loaded = new Date().toISOString();
    },
    householdVisitCreated: (
      state,
      action: PayloadAction<ZetkinHouseholdVisit>
    ) => {
      const visit = action.payload;
      state.visitsByHouseholdId[visit.household_id] ||= remoteList([]);
      state.visitsByHouseholdId[visit.household_id].items.push(
        remoteItem(visit.id, { data: visit, loaded: new Date().toISOString() })
      );
    },
    locationCreated: (state, action: PayloadAction<ZetkinLocation>) => {
      const location = action.payload;

      Object.values(state.locationsByAssignmentId).forEach((list) => {
        remoteItemUpdated(list, location);
      });
    },
    locationLoad: (state, action: PayloadAction<[number, number]>) => {
      const [assignmentId, locationId] = action.payload;
      state.locationsByAssignmentId[assignmentId] ||= remoteList();
      const item = findOrAddItem(
        state.locationsByAssignmentId[assignmentId],
        locationId
      );
      item.isLoading = true;
    },
    locationLoaded: (
      state,
      action: PayloadAction<[number, number, ZetkinLocation]>
    ) => {
      const timestamp = new Date().toISOString();
      const [assignmentId, locationId, location] = action.payload;
      state.locationsByAssignmentId[assignmentId] ||= remoteList();
      const item = findOrAddItem(
        state.locationsByAssignmentId[assignmentId],
        locationId
      );
      item.isLoading = false;
      item.data = location;
      item.loaded = timestamp;
      item.isStale = false;
    },
    locationUpdated: (state, action: PayloadAction<ZetkinLocation>) => {
      const location = action.payload;

      Object.values(state.locationsByAssignmentId).forEach((list) => {
        remoteItemUpdated(list, location);
      });
    },
    locationsInvalidated: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.locationsByAssignmentId[assignmentId] ||= remoteList();
      state.locationsByAssignmentId[assignmentId].isStale = true;
    },
    locationsLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.locationsByAssignmentId[assignmentId] ||= remoteList();
      state.locationsByAssignmentId[assignmentId].isLoading = true;
    },
    locationsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinLocation[]]>
    ) => {
      const timestamp = new Date().toISOString();
      const [assignmentId, locations] = action.payload;
      state.locationsByAssignmentId[assignmentId] = remoteList(locations);
      state.locationsByAssignmentId[assignmentId].loaded = timestamp;
      state.locationsByAssignmentId[assignmentId].items.forEach(
        (item) => (item.loaded = timestamp)
      );
    },
    metricCreated: (state, action: PayloadAction<[number, ZetkinMetric]>) => {
      const [assignmentId, metric] = action.payload;
      state.metricsByAssignmentId[assignmentId].items.push(
        remoteItem(metric.id, {
          data: metric,
          loaded: new Date().toISOString(),
        })
      );
    },
    metricDeleted: (state, action: PayloadAction<[number, number]>) => {
      const [assignmentId, metricId] = action.payload;
      state.metricsByAssignmentId[assignmentId].items =
        state.metricsByAssignmentId[assignmentId].items.filter(
          (item) => item.id != metricId
        );
    },
    metricUpdated: (state, action: PayloadAction<[number, ZetkinMetric]>) => {
      const [assignmentId, metric] = action.payload;
      const item = findOrAddItem(
        state.metricsByAssignmentId[assignmentId],
        metric.id
      );
      item.data = metric;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    metricsLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.metricsByAssignmentId[assignmentId] ||= remoteList();
      state.metricsByAssignmentId[assignmentId].isLoading = true;
    },
    metricsLoaded: (state, action: PayloadAction<[number, ZetkinMetric[]]>) => {
      const [assignmentId, metrics] = action.payload;
      state.metricsByAssignmentId[assignmentId] = remoteList(metrics);
      state.metricsByAssignmentId[assignmentId].loaded =
        new Date().toISOString();
    },
    statsLoad: (state, action: PayloadAction<number>) => {
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
      action: PayloadAction<[number, ZetkinAreaAssignmentStats]>
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
  assigneeAdded,
  assigneesLoad,
  assigneesLoaded,
  assignmentAreasLoad,
  assignmentAreasLoaded,
  householdVisitCreated,
  locationCreated,
  locationLoad,
  locationLoaded,
  locationsInvalidated,
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
} = areaAssignmentSlice.actions;
