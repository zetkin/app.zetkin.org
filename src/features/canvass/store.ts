import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';
import { AssignmentWithAreas, ZetkinLocationVisit } from './types';

export interface CanvassStoreSlice {
  myAssignmentsWithAreasList: RemoteList<AssignmentWithAreas>;
  visitsByAssignmentId: Record<string, RemoteList<ZetkinLocationVisit>>;
}

const initialState: CanvassStoreSlice = {
  myAssignmentsWithAreasList: remoteList(),
  visitsByAssignmentId: {},
};

const canvassSlice = createSlice({
  initialState: initialState,
  name: 'canvass',
  reducers: {
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
      action: PayloadAction<[string, ZetkinLocationVisit[]]>
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
