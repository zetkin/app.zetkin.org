import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItem,
  remoteItemUpdated,
  RemoteList,
  remoteList,
  remoteListCreated,
  remoteListLoad,
  remoteListLoaded,
} from 'utils/storeUtils';
import {
  HouseholdWithColor,
  ZetkinHouseholdVisit,
  ZetkinLocationVisit,
} from './types';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { findOrAddItem } from 'utils/storeUtils/findOrAddItem';

export interface CanvassStoreSlice {
  householdsByLocationId: Record<number, RemoteList<HouseholdWithColor>>;
  myAssignmentsList: RemoteList<ZetkinAreaAssignment>;
  visitsByAssignmentAndLocationId: Record<
    number,
    Record<number, RemoteList<ZetkinHouseholdVisit>>
  >;
  visitsByAssignmentId: Record<string, RemoteList<ZetkinLocationVisit>>;
}

const initialState: CanvassStoreSlice = {
  householdsByLocationId: {},
  myAssignmentsList: remoteList(),
  visitsByAssignmentAndLocationId: {},
  visitsByAssignmentId: {},
};

const canvassSlice = createSlice({
  initialState: initialState,
  name: 'canvass',
  reducers: {
    householdCreated: (state, action: PayloadAction<HouseholdWithColor>) => {
      const household = action.payload;
      state.householdsByLocationId[household.location_id] ||= remoteList();
      state.householdsByLocationId[household.location_id].items.push(
        remoteItem(household.id, {
          data: household,
          loaded: new Date().toISOString(),
        })
      );
    },
    householdDeleted: (state, action: PayloadAction<[number, number]>) => {
      const [locationId, householdId] = action.payload;
      state.householdsByLocationId[locationId].items =
        state.householdsByLocationId[locationId].items.filter(
          (item) => item.id != householdId
        );
    },
    householdLoad: (state, action: PayloadAction<[number, number]>) => {
      const [locationId, householdId] = action.payload;

      state.householdsByLocationId[locationId] ||= remoteList();
      const item = findOrAddItem(
        state.householdsByLocationId[locationId],
        householdId
      );

      item.isLoading = true;
    },
    householdLoaded: (
      state,
      action: PayloadAction<[number, HouseholdWithColor]>
    ) => {
      const [locationId, household] = action.payload;
      state.householdsByLocationId[locationId] ||= remoteList();
      const item = findOrAddItem(
        state.householdsByLocationId[locationId],
        household.id
      );
      item.isLoading = false;
      item.loaded = new Date().toISOString();
      item.data = household;
    },
    householdUpdated: (
      state,
      action: PayloadAction<[number, HouseholdWithColor]>
    ) => {
      const [locationId, household] = action.payload;
      state.householdsByLocationId[locationId] ||= remoteList();
      const item = findOrAddItem(
        state.householdsByLocationId[locationId],
        household.id
      );
      item.isLoading = false;
      item.loaded = new Date().toISOString();
      item.data = household;
    },
    householdVisitCreated: (
      state,
      action: PayloadAction<[number, ZetkinHouseholdVisit]>
    ) => {
      const [locationId, visit] = action.payload;
      state.visitsByAssignmentAndLocationId[visit.assignment_id] ||= {};
      state.visitsByAssignmentAndLocationId[visit.assignment_id][locationId] ||=
        remoteListCreated();

      remoteItemUpdated(
        state.visitsByAssignmentAndLocationId[visit.assignment_id][locationId],
        visit
      );
    },
    householdVisitsLoad: (state, action: PayloadAction<[number, number]>) => {
      const [assignmentId, locationId] = action.payload;
      state.visitsByAssignmentAndLocationId[assignmentId] ||= {};
      state.visitsByAssignmentAndLocationId[assignmentId][locationId] =
        remoteListLoad(
          state.visitsByAssignmentAndLocationId[assignmentId][locationId]
        );
    },
    householdVisitsLoaded: (
      state,
      action: PayloadAction<[number, number, ZetkinHouseholdVisit[]]>
    ) => {
      const [assignmentId, locationId, visits] = action.payload;
      state.visitsByAssignmentAndLocationId[assignmentId] ||= {};
      state.visitsByAssignmentAndLocationId[assignmentId][locationId] =
        remoteListLoaded(visits);
    },
    householdsLoad: (state, action: PayloadAction<number>) => {
      const locationId = action.payload;
      state.householdsByLocationId[locationId] ||= remoteList();
      state.householdsByLocationId[locationId].isLoading = true;
    },
    householdsLoaded: (
      state,
      action: PayloadAction<[number, HouseholdWithColor[]]>
    ) => {
      const [locationId, households] = action.payload;
      state.householdsByLocationId[locationId] = remoteList(households);
      state.householdsByLocationId[locationId].loaded =
        new Date().toISOString();
    },
    myAssignmentsLoad: (state) => {
      state.myAssignmentsList.isLoading = true;
    },
    myAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinAreaAssignment[]>
    ) => {
      const assignments = action.payload;
      const timestamp = new Date().toISOString();

      state.myAssignmentsList = remoteList(assignments);
      state.myAssignmentsList.loaded = timestamp;
      state.myAssignmentsList.items.forEach(
        (item) => (item.loaded = timestamp)
      );
    },
    visitCreated: (state, action: PayloadAction<ZetkinLocationVisit>) => {
      const visit = action.payload;
      const assignmentId = visit.assignment_id;
      if (!state.visitsByAssignmentId[assignmentId]) {
        state.visitsByAssignmentId[assignmentId] = remoteList();
      }

      state.visitsByAssignmentId[assignmentId].items.push(
        remoteItem(visit.id, { data: visit })
      );
    },
    visitUpdated: (state, action: PayloadAction<ZetkinLocationVisit>) => {
      const visit = action.payload;
      const assignmentId = visit.assignment_id;

      state.visitsByAssignmentId[assignmentId] ||= remoteList();
      const item = findOrAddItem(
        state.visitsByAssignmentId[assignmentId],
        visit.id
      );
      item.data = visit;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    visitsInvalidated: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.visitsByAssignmentId[assignmentId].isStale = true;
    },
    visitsLoad: (state, action: PayloadAction<number>) => {
      state.visitsByAssignmentId[action.payload] = remoteList();
      state.visitsByAssignmentId[action.payload].isLoading = true;
    },
    visitsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinLocationVisit[]]>
    ) => {
      const [locationId, visits] = action.payload;
      state.visitsByAssignmentId[locationId] = remoteList(visits);
      state.visitsByAssignmentId[locationId].isLoading = false;
      state.visitsByAssignmentId[locationId].loaded = new Date().toISOString();
    },
  },
});

export default canvassSlice;
export const {
  householdCreated,
  householdDeleted,
  householdLoad,
  householdLoaded,
  householdVisitCreated,
  householdVisitsLoad,
  householdVisitsLoaded,
  householdUpdated,
  householdsLoad,
  householdsLoaded,
  myAssignmentsLoad,
  myAssignmentsLoaded,
  visitCreated,
  visitUpdated,
  visitsInvalidated,
  visitsLoad,
  visitsLoaded,
} = canvassSlice.actions;
