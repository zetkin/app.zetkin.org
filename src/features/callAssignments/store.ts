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
    statsLoad: (state) => {
      state.isLoading = true;
    },
    statsLoaded: (
      state,
      action: PayloadAction<CallAssignmentStats & { id: number }>
    ) => {
      state.isLoading = false;
      state.statsById[action.payload.id] = {
        blocked: action.payload.blocked,
        done: action.payload.done,
        ready: action.payload.ready,
      };
    },
  },
});

export default callAssignmentsSlice.reducer;
export const {
  callAssignmentLoad,
  callAssignmentLoaded,
  statsLoad,
  statsLoaded,
} = callAssignmentsSlice.actions;
