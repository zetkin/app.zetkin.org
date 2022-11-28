import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CallAssignmentData, CallAssignmentStats } from './apiTypes';

interface CallAssignmentSlice {
  callAssignments: CallAssignmentData[];
  isLoading: boolean;
  statsById: Record<number, CallAssignmentStats | undefined>;
}

const initialState: CallAssignmentSlice = {
  callAssignments: [],
  isLoading: false,
  statsById: {},
};

const callAssignmentsSlice = createSlice({
  initialState,
  name: 'callAssignments',
  reducers: {
    callAssignmentLoad: (state) => {
      state.isLoading = true;
    },
    callAssignmentLoaded: (
      state,
      action: PayloadAction<CallAssignmentData>
    ) => {
      state.isLoading = false;
      state.callAssignments = state.callAssignments
        .filter((ca) => ca.id != action.payload.id)
        .concat([action.payload]);
    },
    callAssignmentUpdated: (
      state,
      action: PayloadAction<CallAssignmentData>
    ) => {
      const stats = state.statsById[action.payload.id];
      const callAssignment = state.callAssignments.find(
        (ca) => ca.id === action.payload.id
      );
      if (stats && callAssignment?.cooldown != action.payload.cooldown) {
        stats.isStale = true;
        state.callAssignments = state.callAssignments
          .filter((ca) => ca.id != action.payload.id)
          .concat([action.payload]);
      }
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      state.statsById[action.payload] = {
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
        isLoading: true,
        isStale: false,
      };
    },
    statsLoaded: (
      state,
      action: PayloadAction<CallAssignmentStats & { id: number }>
    ) => {
      state.isLoading = false;
      state.statsById[action.payload.id] = {
        allocated: action.payload.allocated,
        blocked: action.payload.blocked,
        callBackLater: action.payload.callBackLater,
        calledTooRecently: action.payload.calledTooRecently,
        done: action.payload.done,
        isLoading: false,
        isStale: false,
        missingPhoneNumber: action.payload.missingPhoneNumber,
        organizerActionNeeded: action.payload.organizerActionNeeded,
        queue: action.payload.queue,
        ready: action.payload.ready,
      };
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
