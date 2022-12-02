import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  remoteItem,
  RemoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';

import { CallAssignmentData, CallAssignmentStats } from './apiTypes';

interface CallAssignmentSlice {
  assignmentList: RemoteList<CallAssignmentData>;
  statsById: Record<number, RemoteItem<CallAssignmentStats>>;
}

const initialState: CallAssignmentSlice = {
  assignmentList: remoteList(),
  statsById: {},
};

const callAssignmentsSlice = createSlice({
  initialState,
  name: 'callAssignments',
  reducers: {
    callAssignmentLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.assignmentList.items.find((item) => item.id == id);
      state.assignmentList.items = state.assignmentList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    callAssignmentLoaded: (
      state,
      action: PayloadAction<CallAssignmentData>
    ) => {
      const id = action.payload.id;
      const item = state.assignmentList.items.find((item) => item.id == id);

      if (!item) {
        throw new Error(
          'Finished loading something that never started loading'
        );
      }

      item.data = action.payload;
      item.loaded = new Date().toISOString();
      item.isLoading = false;
      item.isStale = false;
    },
    callAssignmentUpdated: (
      state,
      action: PayloadAction<CallAssignmentData>
    ) => {
      const statsItem = state.statsById[action.payload.id];
      const caItem = state.assignmentList.items.find(
        (item) => item.id == action.payload.id
      );
      const callAssignment = caItem?.data;

      if (
        //TODO: clean up this hot mess w better caching logic
        callAssignment?.cooldown != action.payload.cooldown ||
        JSON.stringify(action.payload.target.filter_spec) !=
          JSON.stringify(callAssignment?.target.filter_spec)
      ) {
        if (statsItem) {
          statsItem.isStale = true;
        }
        state.assignmentList.items = state.assignmentList.items
          .filter((ca) => ca.id != action.payload.id)
          .concat([remoteItem(action.payload.id, { data: action.payload })]);
      }
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      const statsItem = state.statsById[action.payload];
      state.statsById[action.payload] = remoteItem(action.payload, {
        data: statsItem?.data || {
          allTargets: 0,
          allocated: 0,
          blocked: 0,
          callBackLater: 0,
          calledTooRecently: 0,
          done: 0,
          missingPhoneNumber: 0,
          organizerActionNeeded: 0,
          queue: 0,
          ready: 0,
          ...state.statsById[action.payload],
        },
        isLoading: true,
      });
    },
    statsLoaded: (
      state,
      action: PayloadAction<CallAssignmentStats & { id: number }>
    ) => {
      state.statsById[action.payload.id] = remoteItem<CallAssignmentStats>(
        action.payload.id,
        {
          data: action.payload,
          isLoading: false,
          isStale: false,
        }
      );
    },
  },
});

export default callAssignmentsSlice.reducer;
export const {
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdated,
  statsLoad,
  statsLoaded,
} = callAssignmentsSlice.actions;
