import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';
import { Zetkin2Household, ZetkinLocationVisit } from './types';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { findOrAddItem } from 'utils/storeUtils/findOrAddItem';

export interface CanvassStoreSlice {
  householdsByLocationId: Record<number, RemoteList<Zetkin2Household>>;
  myAssignmentsList: RemoteList<ZetkinAreaAssignment>;
  visitsByAssignmentId: Record<string, RemoteList<ZetkinLocationVisit>>;
}

const initialState: CanvassStoreSlice = {
  householdsByLocationId: {},
  myAssignmentsList: remoteList(),
  visitsByAssignmentId: {},
};

const canvassSlice = createSlice({
  initialState: initialState,
  name: 'canvass',
  reducers: {
    householdCreated: (state, action: PayloadAction<Zetkin2Household>) => {
      const household = action.payload;
      state.householdsByLocationId[household.location_id] ||= remoteList();
      state.householdsByLocationId[household.location_id].items.push(
        remoteItem(household.id, {
          data: household,
          loaded: new Date().toISOString(),
        })
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
      action: PayloadAction<[number, Zetkin2Household]>
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
      action: PayloadAction<[number, Zetkin2Household]>
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
    householdsLoad: (state, action: PayloadAction<number>) => {
      const locationId = action.payload;
      state.householdsByLocationId[locationId] ||= remoteList();
      state.householdsByLocationId[locationId].isLoading = true;
    },
    householdsLoaded: (
      state,
      action: PayloadAction<[number, Zetkin2Household[]]>
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
  householdLoad,
  householdLoaded,
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
