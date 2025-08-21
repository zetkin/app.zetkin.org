import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteListCreated,
  remoteListInvalidated,
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
  AreaCardData,
  ZetkinAreaAssignmentStats,
  ZetkinAreaAssignment,
  ZetkinAreaAssignee,
  ZetkinLocation,
  ZetkinAssignmentAreaStats,
  SessionDeletedPayload,
  ZetkinMetric,
} from './types';
import { Zetkin2Area } from 'features/areas/types';
import { ZetkinHouseholdVisit } from 'features/canvass/types';

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
  locationsByAssignmentIdAndAreaId: Record<string, RemoteList<ZetkinLocation>>;
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
  locationsByAssignmentIdAndAreaId: {},
  metricsByAssignmentId: {},
  statsByAreaAssId: {},
  visitsByHouseholdId: {},
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
      state.areaAssignmentList = remoteListLoad(state.areaAssignmentList);
    },
    areaAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinAreaAssignment[]>
    ) => {
      state.areaAssignmentList = remoteListLoaded(action.payload);
    },
    areaGraphLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;

      state.areaGraphByAssignmentId[assignmentId] = remoteListLoad(
        state.areaGraphByAssignmentId[assignmentId]
      );
    },
    areaGraphLoaded: (
      state,
      action: PayloadAction<[number, AreaCardData[]]>
    ) => {
      const [assignmentId, graphData] = action.payload;

      const loadedAreaGraphs = graphData.map((data) => ({
        ...data,
        id: data.area_id!,
      }));

      state.areaGraphByAssignmentId[assignmentId] =
        remoteListLoaded(loadedAreaGraphs);
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
      state.assigneesByAssignmentId[assignee.assignment_id] ||=
        remoteListCreated();

      remoteItemUpdated(state.assigneesByAssignmentId[assignee.assignment_id], {
        ...assignee,
        id: assignee.user_id,
      });

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
      state.assigneesByAssignmentId[assignmentId] = remoteListLoad(
        state.assigneesByAssignmentId[assignmentId]
      );
    },
    assigneesLoaded: (
      state,
      action: PayloadAction<[number, ZetkinAreaAssignee[]]>
    ) => {
      const [assignmentId, sessions] = action.payload;

      state.assigneesByAssignmentId[assignmentId] = remoteListLoaded(
        sessions.map((session) => ({ ...session, id: session.user_id }))
      );
    },
    assignmentAreasLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.areasByAssignmentId[assignmentId] = remoteListLoad(
        state.areasByAssignmentId[assignmentId]
      );
    },
    assignmentAreasLoaded: (
      state,
      action: PayloadAction<[number, Zetkin2Area[]]>
    ) => {
      const [assignmentId, areas] = action.payload;
      state.areasByAssignmentId[assignmentId] = remoteListLoaded(areas);
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

      Object.values(state.locationsByAssignmentIdAndAreaId).forEach((list) => {
        remoteItemUpdated(list, location);
      });
    },
    locationLoaded: (
      state,
      action: PayloadAction<[number, ZetkinLocation]>
    ) => {
      const [assignmentId, location] = action.payload;

      remoteItemUpdated(state.locationsByAssignmentId[assignmentId], location);

      Object.keys(state.locationsByAssignmentIdAndAreaId).forEach((key) => {
        const [keyAssignmentIdStr] = key.split(':');
        const keyAssignmentId = Number(keyAssignmentIdStr);

        if (keyAssignmentId == assignmentId) {
          const list = state.locationsByAssignmentIdAndAreaId[key];
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
      Object.values(state.locationsByAssignmentIdAndAreaId).forEach((list) => {
        remoteItemUpdated(list, location);
      });
    },
    locationsInvalidated: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.locationsByAssignmentId[assignmentId] = remoteListInvalidated(
        state.locationsByAssignmentId[assignmentId]
      );
    },
    locationsLoad: (state, action: PayloadAction<string>) => {
      const key = action.payload;

      state.locationsByAssignmentIdAndAreaId[key] = remoteListLoad(
        state.locationsByAssignmentIdAndAreaId[key]
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

      state.locationsByAssignmentIdAndAreaId[key] = remoteListLoaded(locations);

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
  householdVisitsCreated,
  locationCreated,
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
