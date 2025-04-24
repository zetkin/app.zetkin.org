import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';
import { ZetkinLocationVisit } from './types';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';

export interface CanvassStoreSlice {
  myAssignmentsList: RemoteList<ZetkinAreaAssignment>;
  visitsByAssignmentId: Record<string, RemoteList<ZetkinLocationVisit>>;
}

const initialState: CanvassStoreSlice = {
  myAssignmentsList: remoteList(),
  visitsByAssignmentId: {},
};

const canvassSlice = createSlice({
  initialState: initialState,
  name: 'canvass',
  reducers: {
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
      const assignmentId = visit.areaAssId;
      if (!state.visitsByAssignmentId[assignmentId]) {
        state.visitsByAssignmentId[assignmentId] = remoteList();
      }

      state.visitsByAssignmentId[assignmentId].items.push(
        remoteItem(visit.id, { data: visit })
      );
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
  myAssignmentsLoad,
  myAssignmentsLoaded,
  visitCreated,
  visitsInvalidated,
  visitsLoad,
  visitsLoaded,
} = canvassSlice.actions;
